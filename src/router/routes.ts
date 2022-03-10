import Index from "../views/index/index.vue";
import Login from "../pages/login/index.vue";

interface LabelledValue {
    path: string;
    component: any;
    ss: any;
}

const routes: LabelledValue = [
    {
        path: "/",
        component: Index,
    },
    {
        path: "/login",
        component: Login,
    },
];

export default routes;
