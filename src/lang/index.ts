import { createI18n } from "vue-i18n"
import store from "@/store"
import zhLocale from "./zh"
import enLocale from "./en"

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
