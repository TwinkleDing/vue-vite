import { createRouter, createWebHashHistory } from "vue-router"
import routes from "./routes"

const router: any = new (createRouter as any)({
    history: createWebHashHistory(),
    routes: [...routes]
})

export default router
