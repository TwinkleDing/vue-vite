import { createI18n }  from "vue-i18n";
import store from "@/store";
// import elementEnLocale from "element-ui/lib/locale/lang/en";
// import elementZhLocale from "element-ui/lib/locale/lang/zh-CN";
import zhLocale from "./zh";
import enLocale from "./en";

const i18n = createI18n({
    locale: store.getters.language,
    messages: {
        zh: {
            ...zhLocale,
            // ...elementZhLocale
        },
        en: {
            ...enLocale,
            // ...elementEnLocale
        },
    },
});

export default i18n;
