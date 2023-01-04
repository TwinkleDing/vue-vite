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

<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessageBox } from "element-plus";
import ColorList from "../components/ColorList.vue";
import WidthList from "../components/WidthList.vue";
import { ColorMap } from "../config.js";
import { WidthMap } from "../config.js";
const WebSocketUrl = "ws://localhost:678/test";
const DefaultUser = "twinkleding";
const CountdownTime = 120; // 绘制时间的倒计时
const AnswerCountdownTime = 30; // 猜到答案之后从30s开始倒计时
const WaitCountdownTime = 10; // 猜题结束到下一人的等待时间
const PromptTime = 20; // 给出提示的间隔
const StatusList = ["NoStart", "Started", "End"]; // 绘制的状态列表
let isDrawer = ref(localStorage.getItem("user") === DefaultUser);
let countdown = ref(CountdownTime);
let lineColor = ref(ColorMap[0]);
let lineWidth = ref(WidthMap[0]);
let status = ref(StatusList[0]);
let answerInput = ref("");
let question = ref("");
let drawer = ref("");
let user = ref("");
let answerList = reactive([]);
let prompt = reactive([]);
let start = false;
let mouseX = null;
let mouseY = null;
let mouseBeginX = null;
let mouseBeginY = null;
let mouseLastX = null;
let mouseLastY = null;
let questionTimer = null;
let answerTimer = null;
let waitTimer = null;
let canvas = null;
let context = null;
let socket = null;

// 初始化连接websocket，设置玩家名称
const init = () => {
  socket = new WebSocket(WebSocketUrl);
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  user.value = localStorage.getItem("user");
  socket.onopen = () => {
    if (!user) {
      ElMessageBox.confirm("请输入玩家名称", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
      }).then(({ value }) => {
        localStorage.setItem("user", value);
        const client = {
          status: "User",
          user: value,
        };
        user.value = value;
        sendClient(client);
      });
    } else {
      const client = {
        status: "User",
        user: user.value,
      };
      sendClient(client);
    }
  };
};
// 设置画笔颜色
const setLineColor = (e) => {
  lineColor.value = e;
};
// 设置画笔粗细
const setLineWidth = (e) => {
  lineWidth.value = e - 2;
};
// 开始游戏
const startGame = () => {
  countdown.value = CountdownTime;
  const client = {
    status: "StartGame",
    user: user.value,
  };
  sendClient(client);
};
//下一个玩家进行游戏
const nextUser = () => {
  clearTimeout(questionTimer);
  const client = {
    status: "NextUser",
  };
  sendClient(client);
};
// 提交答案
const submit = () => {
  if ("" === answerInput.value) {
    return;
  }
  const client = {
    status: "Answer",
    user: user,
    answer: answerInput.value,
  };
  answerInput.value = "";
  sendClient(client);
};
// 清空画板
const emptyAll = () => {
  mouseBeginX = null;
  mouseBeginY = null;
  mouseLastX = null;
  mouseLastY = null;
  context.beginPath();
  context.clearRect(0, 0, 1200, 800);
  const client = {
    status: "Empty",
  };
  sendClient(client);
};
// 开始绘制
const drawStart = (e) => {
  if (StatusList[1] === status.value) {
    mouseBeginX = e.clientX - canvas.offsetLeft;
    mouseBeginY = e.clientY - canvas.offsetTop;
    context.moveTo(mouseBeginX, mouseBeginY);
    openDraw(e, "Start");
    start = true;
  }
};
// 绘制中
const drawing = (e) => {
  if (start && StatusList[1] === status.value) {
    openDraw(e, "Drawing");
  }
};
// 绘制结束
const drawEnd = (e) => {
  context.beginPath();
  start = false;
};
const openDraw = (e, status) => {
  const ctx = context;
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = lineWidth;
  mouseX = e.clientX - canvas.offsetLeft;
  mouseY = e.clientY - canvas.offsetTop;
  ctx.lineTo(mouseX, mouseY);
  ctx.stroke();
  const client = {
    status,
    x: mouseX,
    y: mouseY,
    lineColor: lineColor,
    lineWidth: lineWidth,
  };
  sendClient(client);
};
// 画板展示绘制
const drawAnswerCanvas = (ctx, client) => {
  ctx.strokeStyle = client.lineColor;
  ctx.lineWidth = client.lineWidth;
  mouseLastX = client.x;
  mouseLastY = client.y;
  ctx.lineTo(client.x, client.y);
  ctx.stroke();
  ctx.beginPath();
};
const sendClient = (msg) => {
  socket.send(JSON.stringify(msg));
};
// 倒计时方法
const countdownFnc = (time) => {
  answerTimer = setInterval(() => {
    countdown.value--;
    if (0 === countdown.value) {
      clearInterval(answerTimer);
      answerList.push({
        user: "系统",
        answer: "时间结束",
      });
      waitGame();
    }
  }, 1000);
};
// 等待时间
const waitGame = () => {
  status.value = StatusList[2];
  let count = 2;
  answerList.push({
    user: "系统",
    answer: `等待下场开始，还剩${count * 5}s`,
  });
  countdown.value = WaitCountdownTime;
  answerTimer = setInterval(() => {
    countdown.value--;
    if (0 === countdown.value) {
      clearInterval(answerTimer);
    }
  }, 1000);
  waitTimer = setInterval(() => {
    count--;
    if (0 === count) {
      clearInterval(waitTimer);
      clearInterval(answerTimer);
      answerList.push({
        user: "系统",
        answer: "等待时间结束，游戏开始",
      });
      if (isDrawer) {
        nextUser();
      }
    } else {
      answerList.push({
        user: "系统",
        answer: `等待下场开始，还剩${count * 5}s`,
      });
    }
  }, 5000);
};
const submitAnswer = (client) => {
  if (client.answer === question) {
    answerList.push({
      user: client.user,
      answer: "回答正确！",
    });
    countdownFnc(AnswerCountdownTime);
  } else {
    answerList.push({
      user: client.user,
      answer: client.answer,
    });
  }
};
const startGameFnc = (client) => {
  countdown.value = CountdownTime;
  drawer.value = client.user;
  status.value = StatusList[1];
  question.value = client.question.split("，")[0];
  // 清空之前遗留的
  clearTimeout(questionTimer);
  prompt = [];
  // 开始计时给提示
  questionTimer = setTimeout(() => {
    prompt.push(client.question.split("，")[1]);
    clearTimeout(questionTimer);
    questionTimer = setTimeout(() => {
      prompt.push(client.question.split("，")[2]);
    }, PromptTime);
  }, PromptTime);
  countdownFnc(countdown);
};
const userIn = (client) => {
  let hasSelf = false;
  answerList.forEach((item) => {
    if (item.answer.includes(client.user)) {
      hasSelf = true;
    }
  });
  if (user.value === client.user && hasSelf) {
    return;
  }
  answerList.push({
    user: "系统",
    answer: `欢迎${client.user}加入游戏`,
  });
};
const socketMsg = () => {
  socket.onmessage = (msg) => {
    const canvasAnswer = document.getElementById("canvasAnswer");
    const ctx = canvasAnswer.getContext("2d");
    const client = JSON.parse(msg.data);
    // 玩家加入游戏
    if ("User" === client.status) {
      userIn(client);
      return;
    }
    if ("NextUser" === client.status) {
      if (client.user === user.value) {
        startGame();
        drawer.value = client.user;
        isDrawer.value = client.user === user.value;
      }
      return;
    }
    // 提交答案
    if ("Answer" === client.status) {
      // 回答正确
      submitAnswer(client);
      return;
    }
    // 开始游戏，获取问题
    if ("StartGame" === client.status) {
      startGameFnc(client);
      return;
    }
    // 清空画板
    if ("Empty" === client.status) {
      ctx.beginPath();
      ctx.clearRect(0, 0, 1200, 800);
      return;
    }
    // 绘制途中
    if (["Start", "Drawing"].includes(client.status)) {
      if ("Drawing" === client.status) {
        ctx.moveTo(mouseLastX, mouseLastY);
      } else if ("Start" === client.status) {
        ctx.moveTo(client.x, client.y);
      }
      drawAnswerCanvas(ctx, client);
      return;
    }
    if ("Onunload" === client.status) {
      answerList.push({
        user: "系统",
        answer: `玩家${client.user}退出游戏`,
      });
    }
  };
};

onMounted(() => {
  init();
  // 处理websocket返回的信息
  socketMsg();
  // 关闭窗口时发送
  window.onbeforeunload = () => {
    const client = {
      status: "Onunload",
      user: user.value,
    };
    sendClient(client);
  };
});
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
