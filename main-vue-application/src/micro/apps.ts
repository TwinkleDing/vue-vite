const apps = [
    {
        name: "MicroVueApp",
        entry: process.env.NODE_ENV === "development" ? "//localhost:668" : "/microApps/MicroVue",
        container: "#frame",
        activeRule: "/MicroVue"
    },
    {
        name: "MicroReactApp",
        entry: process.env.NODE_ENV === "development" ? "//localhost:669" : "/microApps/MicroReact",
        container: "#frame",
        activeRule: "/MicroReact"
    }
]

export default apps
