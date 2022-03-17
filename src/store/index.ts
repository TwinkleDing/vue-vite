import { createStore } from "vuex";
import getters from "./getters";
import common from "./modules/common";
import themeColor from "./modules/themeColor";

export default new createStore({
    modules: {
        common,
        themeColor,
    },
    getters,
});
