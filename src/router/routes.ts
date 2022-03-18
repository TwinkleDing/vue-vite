import Index from "../pages/dashboard/index.vue";
import Login from "../pages/login/index.vue";

interface LabelledValue {
    path: string;
    name: string;
    component: string;
    redirect?: string;
}

const routes: LabelledValue = [
    {
        path: "/",
        name: "index",
        redirect: "/index",
    },
    {
        path: "/index",
        name: "index",
        component: Index,
    },
    {
        path: "/login",
        name: "login",
        component: Login,
    },
];

export default routes;
