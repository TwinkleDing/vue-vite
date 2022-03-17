<template>
    <div class="login-box">
        <!-- <Particles
            id="particles"
            :particlesInit="particlesInit"
            :particlesLoaded="particlesLoaded"
            :options="ParticlesOption"
        /> -->
        <div
            class="login-box-content"
            :class="registerAnimation ? 'transformX' : ''"
        >
            <div class="title">{{ $t("login.title") }}</div>
            <login v-if="!register" @register="registerOpen" />
            <registered v-else @register="registerClose" />
            <div class="language">
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
import ParticlesOption from "./components/ParticlesOption";

export default {
    name: "LoginBox",
    data() {
        return {
            register: false,
            registerAnimation: "transformX",
            vuePath: "https://github.com/TwinkleDing/vue-template",
            nodePath: "https://github.com/TwinkleDing/koa-mongodb",
            ParticlesOption: ParticlesOption,
        };
    },
    components: {
        Login,
        Registered,
    },
    mounted() {},
    computed: {
        ...mapGetters(["language"]),
    },
    methods: {
        changeLan(lang) {
            this.$i18n.locale = lang;
            this.$store.commit("SET_LANGUAGE", lang);
        },
        registerOpen() {
            this.registerAnimation = false;
            this.throttle(() => {
                this.register = true;
                this.registerAnimation = "transformX";
            }, 600);
        },
        registerClose() {
            this.registerAnimation = false;
            this.throttle(() => {
                this.register = false;
                this.registerAnimation = "transformX";
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
        particlesInit(e) {
            console.log(e);
        },
        particlesLoaded(e) {
            console.log(e);
        },
    },
};
</script>

<style lang='scss' scoped>
@import "@/css/theme.scss";

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
        box-shadow: 0 0 10px 0 $--color-primary;
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
            background: $--color-primary;
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
    .transformX {
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
