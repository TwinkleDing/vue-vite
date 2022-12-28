<template>
  <div id="game" @mouseup="drawEnd">
    <div>
      <canvas
        v-show="drawer"
        id="canvas"
        class="canvas"
        height="800"
        width="1000"
        @mousedown="drawStart"
        @mousemove="drawing"
      />
      <canvas
        v-show="!drawer"
        id="canvasAnswer"
        class="canvas"
        height="800"
        width="1000"
      />
      <div v-if="drawer">
        <div v-if="status === 'Started'" class="flex">
          <color-list @set-line-color="setLineColor" />
          <width-list @set-line-width="setLineWidth" />
          <el-button @click="emptyAll">一键清空</el-button>
        </div>
        <div class="flex">
          <el-button @click="startGame">开始游戏</el-button>
          <el-button @click="nextUser">更换玩家</el-button>
        </div>
      </div>
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
        <div>提示：<el-tag>2个字</el-tag>；<el-tag>动物</el-tag></div>
        <div v-if="!drawer" class="flex">
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
      drawer: localStorage.getItem("user") === "twinkleding",
      question: "",
      lineColor: "#000",
      lineWidth: "1",
      status: StatusList[0],
    };
  },
  mounted() {
    this.init();
    this.socket.onmessage = (msg) => {
      const canvasAnswer = document.getElementById("canvasAnswer");
      const ctx = canvasAnswer.getContext("2d");
      const client = JSON.parse(msg.data);
      // 玩家加入游戏
      if (client.status === "user") {
        this.answerList.push({
          user: "系统",
          answer: `欢迎${client.user}加入游戏`,
        });
        return;
      }

      if (client.status === "qusetionUser") {
        this.drawer = client.user === this.user;
      }
      // 提交答案
      if (client.status === "answer") {
        this.answerList.push({
          user: client.user,
          answer: client.answer,
        });
      }
      // 开始游戏，获取问题
      if (client.status === "StartGame") {
        this.status = StatusList[1];
        this.question = client.question.split("，")[0];
      }
      // 清空画板
      if (client.status === "Empty") {
        ctx.beginPath();
        ctx.clearRect(0, 0, 1200, 800);
        return;
      }
      // 绘制途中
      if (["start", "drawing"].includes(client.status)) {
        if (client.status === "drawing") {
          ctx.moveTo(this.mouseLastX, this.mouseLastY);
        } else if (client.status === "start") {
          ctx.moveTo(client.x, client.y);
        }
        drawAnswerCanvas(ctx, client);
      }
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
              status: "user",
              user: value,
            };
            this.user = value;
            this.sendClient(client);
          });
        } else {
          const client = {
            status: "user",
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
      const client = {
        status: "StartGame",
      };
      this.sendClient(client);
    },
    //下一个玩家进行游戏
    nextUser() {},
    // 提交答案
    submit() {
      if (this.answerInput === "") {
        return;
      }
      const client = {
        status: "answer",
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
      this.openDraw(e, "start");
      this.start = true;
    },
    // 绘制中
    drawing(e) {
      if (this.start) {
        this.openDraw(e, "drawing");
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
      ctx.lineTo(client.x, client.y);
      this.mouseLastX = client.x;
      this.mouseLastY = client.y;
      ctx.stroke();
      ctx.beginPath();
    },
    sendClient(msg) {
      this.socket.send(JSON.stringify(msg));
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
}
</style>
