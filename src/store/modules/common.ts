import { setStore, getStore, removeStore } from "@/utils/store";
import { userData } from "@/utils/interface";

const common = {
    state: {
        userInfo:
            getStore({
                name: "userInfo",
            }) || {},
        language:
            getStore({
                name: "language",
            }) || "zh",
    },
    mutations: {
        SET_LANGUAGE: (state, language) => {
            state.language = language;
            var head = document.getElementsByTagName("head")[0];

            function loadStyles(url) {
                var link = document.createElement("link");
                link.rel = "stylesheet";
                link.type = "text/css";
                link.href = url;
                head.appendChild(link);
            }
            if (process.env.NODE_ENV === "production") {
                for (let i in head.children) {
                    if (head.children[i].attributes) {
                        if (head.children[i].attributes[0]) {
                            if (
                                head.children[i].attributes[0].name === "href"
                            ) {
                                if (
                                    head.children[
                                        i
                                    ].attributes[0].value.includes("public.css")
                                ) {
                                    head.removeChild(head.children[i]);
                                    console.log(head.children[i]);
                                }
                            }
                        }
                    }
                }
                if (language === "en") {
                    loadStyles("/css/ar_public.css");
                } else {
                    loadStyles("/css/public.css");
                }
            }
            setStore({
                name: "language",
                content: state.language,
            });
        },
        SET_USER_INFO(state: any, userInfo: userData) {
            state.userInfo = userInfo;
            setStore({
                name: "userInfo",
                content: state.userInfo,
            });
        },
    },
    actions: {},
};
export default common;
