import { createStore } from "vuex"
import getters from "./getters"
import settings from "./modules/settings"
import user from "./modules/user"

const store: any = new (createStore as any)({
    modules: {
        settings,
        user
    },
    getters
})

export default store
