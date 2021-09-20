<template>
    <div id="game">
        <canvas
            id="canvas"
            class="canvas"
            height="800"
            width="1200"
            @mousedown="drawStart"
            @mousemove="drawing"
            @mouseup="drawEnd" />
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
                    <input type="text" placeholder="请输入答案" />
                    <button>确认</button>
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
            answerList: [
                {
                    user: "丁玉亮",
                    answer: "牛",
                },
            ],
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.canvas = document.getElementById("canvas");
            this.context = this.canvas.getContext("2d");
        },
        drawStart(e) {
            this.mouseBeginX = e.clientX - this.canvas.offsetLeft;
            this.mouseBeginY = e.clientY - this.canvas.offsetTop;
            this.context.moveTo( this.mouseBeginX, this.mouseBeginY);
            this.openDraw(e);
            this.start = true;
        },
        drawing(e) {
            if (this.start) {
                this.openDraw(e);
            }
        },
        drawEnd(e) {
            this.start = false;
        },
        openDraw(e) {
            let ctx = this.context;
            ctx.strokeStyle = "#000";
            this.mouseX = e.clientX - this.canvas.offsetLeft;
            this.mouseY = e.clientY - this.canvas.offsetTop;
            ctx.lineTo(this.mouseX, this.mouseY);
            ctx.stroke();
        }
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
