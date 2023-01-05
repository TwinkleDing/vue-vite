import { createI18n } from "vue-i18n"
import store from "@/store"
import zhLocale from "./zh"
import enLocale from "./en"

// 语言方向初始化
store.commit("SET_LANGUAGE", store.getters.language)

const i18n = createI18n({
    globalInjection: true,
    legacy: false,
    locale: store.getters.language,
    messages: {
        zh: {
            ...zhLocale
        },
        en: {
            ...enLocale
        }
    }
})

export default i18n
