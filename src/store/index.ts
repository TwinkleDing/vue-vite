import { createStore } from "vuex";
import getters from "./getters";
import common from "./modules/common";

export default new createStore({
    modules: {
        common,
    },
    getters,
});
