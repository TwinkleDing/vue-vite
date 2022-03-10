<template>
    <div class="login-box">
        <vue-particles
            color="#47CD88"
            linesColor="#47CD88"
            shapeType="star"
            hoverMode="grab"
            clickMode="remove"
            :particleOpacity="0.7"
            :particlesNumber="80"
            :particleSize="4"
            :linesWidth="1"
            :lineLinked="true"
            :lineOpacity="0.4"
            :linesDistance="150"
            :moveSpeed="3"
            :hoverEffect="true"
            :clickEffect="true"
        >
        </vue-particles>
        <div class="login-box-content" :class="regestAnimation ? 'tranx' : ''">
            <div class="title">{{ $t("login.title") }}</div>
            <login v-if="!regest" @regest="regestOpen" />
            <registered v-else @regest="regestClose" />
            <div class="language" :style="`background-color:${themeColor}`">
                <span
                    @click="changeLan('zh')"
                    :style="language === 'zh' ? `color: #fff` : ''"
                    >中</span
                >
                /
                <span
                    @click="changeLan('en')"
                    :style="language === 'en' ? `color: #fff` : ''"
                    >En</span
                >
            </div>
            <div class="node-path">
                vue path: <a :href="vuePath">{{ vuePath }}</a>
            </div>
            <div class="node-path">
                node path: <a :href="nodePath">{{ nodePath }}</a>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Login from "./components/Login.vue";
import Registered from "./components/Registered.vue";

export default {
    name: "LoginBox",
    data() {
        /*
    color: String类型。默认'#dedede'。粒子颜色。
    particleOpacity: Number类型。默认0.7。粒子透明度。
    particlesNumber: Number类型。默认80。粒子数量。
    shapeType: String类型。默认'circle'。可用的粒子外观类型有："circle","edge","triangle", "polygon","star"。
    particleSize: Number类型。默认80。单个粒子大小。
    linesColor: String类型。默认'#dedede'。线条颜色。
    linesWidth: Number类型。默认1。线条宽度。
    lineLinked: 布尔类型。默认true。连接线是否可用。
    lineOpacity: Number类型。默认0.4。线条透明度。
    linesDistance: Number类型。默认150。线条距离。
    moveSpeed: Number类型。默认3。粒子运动速度。
    hoverEffect: 布尔类型。默认true。是否有hover特效。
    hoverMode: String类型。默认true。可用的hover模式有: "grab", "repulse", "bubble"。
    clickEffect: 布尔类型。默认true。是否有click特效。
    clickMode: String类型。默认true。可用的click模式有: "push", "remove", "repulse", "bubble"
    */
        return {
            regest: false,
            regestAnimation: "tranx",
            thimer: false,
            vuePath: "https://github.com/TwinkleDing/vue-template",
            nodePath: "https://github.com/TwinkleDing/koa-mongodb",
        };
    },
    components: {
        Login,
        Registered,
    },
    mounted() {
        this.$store.dispatch("logOut");
    },
    computed: {
        ...mapGetters(["language", "themeColor"]),
    },
    methods: {
        changeLan(lang) {
            this.$i18n.locale = lang;
            this.$store.commit("SET_LANGUAGE", lang);
        },
        regestOpen() {
            this.regestAnimation = false;
            this.throttle(() => {
                this.regest = true;
                this.regestAnimation = "tranx";
            }, 600);
        },
        regestClose() {
            this.regestAnimation = false;
            this.throttle(() => {
                this.regest = false;
                this.regestAnimation = "tranx";
            }, 600);
        },
        throttle(fn, wait) {
            if (!this.timer) {
                this.timer = setTimeout(() => {
                    fn();
                    clearTimeout(this.timer);
                    this.timer = false;
                }, wait);
            }
        },
    },
};
</script>

<style lang='less' scoped>
.login-box {
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 800px;
    position: relative;
    &-content {
        width: 500px;
        min-width: 330px;
        background: #fff;
        box-sizing: border-box;
        box-shadow: 0 0 10px;
        padding: 20px 70px 10px;
        position: relative;
        border-radius: 20px;
        overflow: hidden;
        z-index: 1;
        transform: rotateX(90deg) scaleX(0.5) scaleY(0.5);
        transition: transform 0.5s linear;
        .title {
            font-size: 26px;
            font-family: fantasy;
            line-height: 54px;
        }
        .language {
            position: absolute;
            bottom: -2px;
            right: -30px;
            font-size: 14px;
            height: 40px;
            width: 100px;
            line-height: 40px;
            color: #333;
            transform: rotate(-45deg);
            span {
                cursor: pointer;
            }
        }
        .node-path {
            font-size: 14px;
            a {
                color: gray;
            }
        }
    }
    .tranx {
        transform: rotateX(0);
        transition: transform 0.5s linear;
    }
    #particles-js {
        background: royalblue;
        height: 100%;
        width: 100%;
        position: absolute;
    }
}
</style>
