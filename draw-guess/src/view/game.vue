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
                <div>提示：<el-tag>2个字</el-tag>；<el-tag>动物</el-tag></div>
                <div style="display:flex">
                    <el-input @keyup.enter="submit" v-model="answerInput" type="text" placeholder="请输入答案" />
                    <el-button type="primary" @click="submit">确认</el-button>
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
            user: "",
            drawer: localStorage.getItem("user") === "丁玉亮"
        };
    },
    mounted() {
        this.init();
        this.socket.onmessage = (msg) => {
            let answer = document.getElementById("canvasAnswer");
            let ctx = answer.getContext("2d");
            ctx.strokeStyle = "#000";
            let client = JSON.parse(msg.data);
            console.log(client);
            if(client.status === "user") {
                this.answerList.push({
                    user: "系统",
                    answer: `欢迎${client.user}加入游戏`
                });
                return;
            }
            if(client.status === "qusetionUser") {
                this.drawer = client.user === this.user;
            }
            if(client.status === "answer") {
                this.answerList.push({
                    user: client.user,
                    answer: client.answer
                });
            }
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
            this.socket = new WebSocket("ws://localhost:3001/test");
            this.canvas = document.getElementById("canvas");
            this.context = this.canvas.getContext("2d");
            this.user=localStorage.getItem("user");
            this.socket.onopen = () => {
                if(!this.user){
                    this.$prompt("请输入玩家姓名", "提示", {
                        cancelButtonText: "取消",
                        confirmButtonText: "确定",
                    }).then(({ value }) => {
                        localStorage.setItem("user", value);
                        let client = {
                            status: "user",
                            user: value,
                        };
                        this.socket.send(JSON.stringify(client));
                    });
                }else{
                    let client = {
                        status: "user",
                        user: this.user,
                    };
                    this.socket.send(JSON.stringify(client));
                }
            };
        },
        submit() {
            if(this.answerInput === "") {
                return;
            }
            let client = {
                status: "answer",
                user: this.user,
                answer: this.answerInput
            };
            this.answerInput = "";
            this.socket.send(JSON.stringify(client));
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
