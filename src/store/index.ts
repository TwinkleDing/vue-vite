import { createStore } from "vuex"
import getters from "./getters"
import common from "./modules/common"

const store: any = new (createStore as any)({
    modules: {
        common
    },
    getters
})

export default store
