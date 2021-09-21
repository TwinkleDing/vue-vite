<template>
    <div id="game" @mouseup="drawEnd">
        <div>
            <canvas
                v-show="drawer"
                id="canvas"
                class="canvas"
                height="800"
                width="1200"
                @mousedown="drawStart"
                @mousemove="drawing" />
            <canvas
                v-show="!drawer"
                id="canvasAnswer"
                class="canvas"
                height="800"
                width="1200" />
            <div @click="emptyAll">
                一键清空
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
                <div>提示：<span>2个字</span>；<span>动物</span></div>
                <div>
                    <input v-model="answerInput" type="text" placeholder="请输入答案" />
                    <button @click="submit">确认</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "game",
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
            answerList: [
                {
                    user: "丁玉亮",
                    answer: "牛",
                },
            ],
            drawer: true
        };
    },
    mounted() {
        this.init();
        this.socket = new WebSocket("ws://localhost:3001/test");
        this.socket.onmessage = (msg) => {
            let answer = document.getElementById("canvasAnswer");
            let ctx = answer.getContext("2d");
            ctx.strokeStyle = "#000";
            let client = JSON.parse(msg.data);
            if(client.status === "empty") {
                ctx.clearRect(0, 0, 1200, 800);
                return;
            }
            if(client.status === "drawing") {
                ctx.moveTo(this.mouseLastX, this.mouseLastY);
            }else {
                ctx.moveTo(client.x, client.y);
            }
            ctx.lineTo(client.x, client.y);
            this.mouseLastX = client.x;
            this.mouseLastY = client.y;
            ctx.stroke();
        };
    },
    methods: {
        init() {
            this.canvas = document.getElementById("canvas");
            this.context = this.canvas.getContext("2d");
        },
        submit() {

        },
        emptyAll() {
            this.mouseBeginX = null;
            this.mouseBeginY = null;
            this.mouseLastX= null;
            this.mouseLastY = null;
            this.context.beginPath();
            this.context.clearRect(0, 0, 1200, 800);
            this.socket.send(JSON.stringify({
                status: "empty"
            }));
        },
        drawStart(e) {
            this.mouseBeginX = e.clientX - this.canvas.offsetLeft;
            this.mouseBeginY = e.clientY - this.canvas.offsetTop;
            this.context.moveTo(this.mouseBeginX, this.mouseBeginY);
            this.openDraw(e, "start");
            this.start = true;
        },
        drawing(e) {
            if (this.start) {
                this.openDraw(e, "drawing");
            }
        },
        drawEnd(e) {
            this.start = false;
        },
        openDraw(e, status) {
            let ctx = this.context;
            ctx.strokeStyle = "#000";
            this.mouseX = e.clientX - this.canvas.offsetLeft;
            this.mouseY = e.clientY - this.canvas.offsetTop;
            ctx.lineTo(this.mouseX, this.mouseY);
            ctx.stroke();
            let client = {
                status,
                x: this.mouseX,
                y: this.mouseY,
            };
            this.socket.send(JSON.stringify(client));
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
  .canvas {
    border: 2px solid #ac0;
  }
  .answer-list {
    border: 2px solid #3333ff;
    width: 400px;
    height: 100%;
    display: flex;
    .answer {
      height: 40px;
    }
  }
}
</style>
