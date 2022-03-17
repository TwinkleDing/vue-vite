import { setStore } from "@/utils/store";
import { lighten } from "@/utils/themeColor"

const themeColor = {
    state: {
        themeColor: "#007dff",
    },
    mutations: {
        SET_THEME_COLOR(state: any, color: string) {
            state.themeColor = color;
            let attribute = ''
            attribute += `--systemThemeColor: ${color};`
            let result = lighten(color, 58)
            attribute += `--systemThemeColorActive: ${result};`
            document.querySelector(':root').setAttribute('style', attribute)
            setStore({
                name: "themeColor",
                content: color
            });
        }
    }
}

export default themeColor;