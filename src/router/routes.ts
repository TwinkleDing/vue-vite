import Index from "../views/index/index.vue";
import Login from "../pages/login/index.vue";

interface LabelledValue {
    path: string;
    component: string;
}

const routes: LabelledValue = [
    {
        path: "/",
        redirect: "/index"
    },
    {
        path: "/index",
        component: Index,
    },
    {
        path: "/login",
        component: Login,
    },
];

export default routes;
