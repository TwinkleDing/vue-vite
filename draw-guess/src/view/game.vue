<template>
  <div id="game" @mouseup="drawEnd">
    <div>
      <canvas
        v-show="isDrawer"
        id="canvas"
        class="canvas"
        height="800"
        width="1000"
        @mousedown="drawStart"
        @mousemove="drawing"
      />
      <canvas
        v-show="!isDrawer"
        id="canvasAnswer"
        class="canvas"
        height="800"
        width="1000"
      />
      <div v-if="isDrawer">
        <div v-if="status === 'Started'" class="flex">
          <color-list @set-line-color="setLineColor" />
          <width-list @set-line-width="setLineWidth" />
          <el-button @click="emptyAll">一键清空</el-button>
        </div>
        <div v-if="status === 'NoStart'" class="flex">
          <el-button @click="startGame">我画</el-button>
          <el-button @click="nextUser">你画</el-button>
        </div>
      </div>
      <div v-if="status === 'Started' && !isDrawer">当前玩家：{{ drawer }}</div>
    </div>
    <div>
      <div class="answer-list">
        <div v-for="(item, index) in answerList" :key="index">
          <span>{{ item.user }}</span>
          ：
          <span>{{ item.answer }}</span>
        </div>
      </div>
      <div>
        <div>
          <div v-if="isDrawer && status === 'Started'">题目：{{ question }}</div>
          <div v-if="status !== 'NoStart'">倒计时：{{ countdown }}s</div>
          <div v-if="!isDrawer && status === 'Started'" class="prompt">
            提示：
            <el-tag v-for="(item, index) in prompt" :key="index">{{ item }}</el-tag>
          </div>
        </div>
        <div v-if="!isDrawer || status !== 'Started'" class="flex">
          <el-input
            @keyup.enter="submit"
            v-model="answerInput"
            type="text"
            placeholder="请输入答案"
          />
          <el-button type="primary" @click="submit">我猜</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ColorList from "../components/ColorList.vue";
import WidthList from "../components/WidthList.vue";
const StatusList = ["NoStart", "Started", "End"];
const CountdownTime = 10;
const AnswerCountdownTime = 30;
const WaitCountdownTime = 10;
export default {
  name: "game",
  components: {
    ColorList,
    WidthList,
  },
  data() {
    return {
      canvas: null,
      context: null,
      start: false,
      mouseX: null,
      mouseY: null,
      mouseBeginX: null,
      mouseBeginY: null,
      mouseLastX: null,
      mouseLastY: null,
      socket: null,
      answerInput: "",
      answerList: [],
      user: "",
      drawer: "",
      isDrawer: localStorage.getItem("user") === "twinkleding",
      question: "",
      lineColor: "#000",
      lineWidth: "1",
      status: StatusList[0],
      prompt: [],
      questionTimer: null,
      answerTimer: null,
      waitTimer: null,
      countdown: CountdownTime,
    };
  },
  mounted() {
    this.init();
    this.socket.onmessage = (msg) => {
      const canvasAnswer = document.getElementById("canvasAnswer");
      const ctx = canvasAnswer.getContext("2d");
      const client = JSON.parse(msg.data);
      // 玩家加入游戏
      if (client.status === "User") {
        this.answerList.push({
          user: "系统",
          answer: `欢迎${client.user}加入游戏`,
        });
        return;
      }
      if (client.status === "NextUser") {
        if (client.user === this.user) {
          this.startGame();
          this.drawer = client.user;
          this.isDrawer = client.user === this.user;
        }
      }
      // 提交答案
      if (client.status === "Answer") {
        // 回答正确
        if (client.answer.trim() === this.question) {
          this.answerList.push({
            user: client.user,
            answer: "回答正确！",
          });
          this.countdownFnc(AnswerCountdownTime);
        } else {
          this.answerList.push({
            user: client.user,
            answer: client.answer,
          });
        }
      }
      // 开始游戏，获取问题
      if (client.status === "StartGame") {
        this.countdown === CountdownTime;
        this.drawer = client.user;
        this.status = StatusList[1];
        this.question = client.question.split("，")[0];
        // 清空之前遗留的
        clearTimeout(this.questionTimer);
        this.prompt = [];
        // 开始计时给提示
        this.questionTimer = setTimeout(() => {
          this.prompt.push(client.question.split("，")[1]);
          clearTimeout(this.questionTimer);
          this.questionTimer = setTimeout(() => {
            this.prompt.push(client.question.split("，")[2]);
          }, 20000);
        }, 20000);
        this.countdownFnc(this.countdown);
      }
      // 清空画板
      if (client.status === "Empty") {
        ctx.beginPath();
        ctx.clearRect(0, 0, 1200, 800);
        return;
      }
      // 绘制途中
      if (["Start", "Drawing"].includes(client.status)) {
        if (client.status === "Drawing") {
          ctx.moveTo(this.mouseLastX, this.mouseLastY);
        } else if (client.status === "Start") {
          ctx.moveTo(client.x, client.y);
        }
        this.drawAnswerCanvas(ctx, client);
      }
    };
    window.onbeforeunload = () => {
      const client = {
        status: "Onunload",
        user: this.user,
      };
      this.sendClient(client);
    };
  },
  methods: {
    // 初始化连接websocket，设置玩家名称
    init() {
      this.socket = new WebSocket("ws://localhost:3001/test");
      this.canvas = document.getElementById("canvas");
      this.context = this.canvas.getContext("2d");
      this.user = localStorage.getItem("user");
      this.socket.onopen = () => {
        if (!this.user) {
          this.$prompt("请输入玩家名称", "提示", {
            cancelButtonText: "取消",
            confirmButtonText: "确定",
          }).then(({ value }) => {
            localStorage.setItem("user", value);
            const client = {
              status: "User",
              user: value,
            };
            this.user = value;
            this.sendClient(client);
          });
        } else {
          const client = {
            status: "User",
            user: this.user,
          };
          this.sendClient(client);
        }
      };
    },
    // 设置画笔颜色
    setLineColor(e) {
      this.lineColor = e;
    },
    // 设置画笔粗细
    setLineWidth(e) {
      this.lineWidth = e - 2;
    },
    // 开始游戏
    startGame() {
      this.countdown === CountdownTime;
      const client = {
        status: "StartGame",
        user: this.user,
      };
      this.sendClient(client);
    },
    //下一个玩家进行游戏
    nextUser() {
      clearTimeout(this.questionTimer);
      const client = {
        status: "NextUser",
      };
      this.sendClient(client);
    },
    // 提交答案
    submit() {
      if (this.answerInput === "") {
        return;
      }
      const client = {
        status: "Answer",
        user: this.user,
        answer: this.answerInput,
      };
      this.answerInput = "";
      this.sendClient(client);
    },
    // 清空画板
    emptyAll() {
      this.mouseBeginX = null;
      this.mouseBeginY = null;
      this.mouseLastX = null;
      this.mouseLastY = null;
      this.context.beginPath();
      this.context.clearRect(0, 0, 1200, 800);
      const client = {
        status: "Empty",
      };
      this.sendClient(client);
    },
    // 开始绘制
    drawStart(e) {
      this.mouseBeginX = e.clientX - this.canvas.offsetLeft;
      this.mouseBeginY = e.clientY - this.canvas.offsetTop;
      this.context.moveTo(this.mouseBeginX, this.mouseBeginY);
      this.openDraw(e, "Start");
      this.start = true;
    },
    // 绘制中
    drawing(e) {
      if (this.start) {
        this.openDraw(e, "Drawing");
      }
    },
    // 绘制结束
    drawEnd(e) {
      this.context.beginPath();
      this.start = false;
    },
    openDraw(e, status) {
      const ctx = this.context;
      ctx.strokeStyle = this.lineColor;
      ctx.lineWidth = this.lineWidth;
      this.mouseX = e.clientX - this.canvas.offsetLeft;
      this.mouseY = e.clientY - this.canvas.offsetTop;
      ctx.lineTo(this.mouseX, this.mouseY);
      ctx.stroke();
      const client = {
        status,
        x: this.mouseX,
        y: this.mouseY,
        lineColor: this.lineColor,
        lineWidth: this.lineWidth,
      };
      this.sendClient(client);
    },
    // 画板展示绘制
    drawAnswerCanvas(ctx, client) {
      ctx.strokeStyle = client.lineColor;
      ctx.lineWidth = client.lineWidth;
      this.mouseLastX = client.x;
      this.mouseLastY = client.y;
      ctx.lineTo(client.x, client.y);
      ctx.stroke();
      ctx.beginPath();
    },
    sendClient(msg) {
      this.socket.send(JSON.stringify(msg));
    },
    countdownFnc(time) {
      console.log(this.countdown);
      this.answerTimer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(this.answerTimer);
          this.answerList.push({
            user: "系统",
            answer: "时间结束",
          });
          this.waitGame();
        }
      }, 1000);
    },
    waitGame() {
      this.status = "End";
      let count = 2;
      this.answerList.push({
        user: "系统",
        answer: `等待下场开始，还剩${count * 5}s`,
      });
      this.countdown = WaitCountdownTime;
      this.answerTimer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(this.answerTimer);
        }
      }, 1000);
      this.waitTimer = setInterval(() => {
        count--;
        if (count <= 0) {
          clearInterval(this.waitTimer);
          clearInterval(this.answerTimer);
          this.answerList.push({
            user: "系统",
            answer: "等待时间结束，游戏开始",
          });
          this.nextUser();
        } else {
          this.answerList.push({
            user: "系统",
            answer: `等待下场开始，还剩${count * 5}s`,
          });
        }
      }, 5000);
    },
  },
};
</script>

<style lang="less" scoped>
#game {
  height: 800px;
  width: 100%;
  min-width: 1400px;
  display: flex;
  #canvas {
    border: 2px solid #ac0;
  }
  #canvasAnswer {
    border: 2px solid #ca0;
  }
  .answer-list {
    border: 2px solid #3333ff;
    width: 400px;
    height: 100%;
    .answer {
      height: 40px;
    }
  }
  .prompt {
    margin: 3px 0;
    .el-tag {
      margin-right: 5px;
    }
  }
}
</style>
