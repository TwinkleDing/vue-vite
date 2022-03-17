<template>
    <div class="login-box">
        <!-- <Particles
            id="particles"
            :particlesInit="particlesInit"
            :particlesLoaded="particlesLoaded"
            :options="ParticlesOption"
        >
        </Particles> -->
        <div
            class="login-box-content"
            :class="registerAnimation ? 'tranx' : ''"
        >
            <div class="title">{{ $t("login.title") }}</div>
            <login v-if="!register" @register="registerOpen" />
            <registered v-else @register="registerClose" />
            <div class="language" style="background-color: #409eff">
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
        return {
            register: false,
            registerAnimation: "tranx",
            thimer: false,
            vuePath: "https://github.com/TwinkleDing/vue-template",
            nodePath: "https://github.com/TwinkleDing/koa-mongodb",
            ParticlesOption: {
                background: {
                    color: {
                        value: "#0d47a1",
                    },
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: "repulse",
                        },
                        resize: true,
                    },
                    modes: {
                        bubble: {
                            distance: 400,
                            duration: 2,
                            opacity: 0.8,
                            size: 40,
                        },
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#ffffff",
                    },
                    links: {
                        color: "#ffffff",
                        distance: 150,
                        enable: true,
                        opacity: 0.5,
                        width: 1,
                    },
                    collisions: {
                        enable: true,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outMode: "bounce",
                        random: false,
                        speed: 6,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 80,
                    },
                    opacity: {
                        value: 0.5,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        random: true,
                        value: 5,
                    },
                },
                detectRetina: true,
            },
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
                this.registerAnimation = "tranx";
            }, 600);
        },
        registerClose() {
            this.registerAnimation = false;
            this.throttle(() => {
                this.register = false;
                this.registerAnimation = "tranx";
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
