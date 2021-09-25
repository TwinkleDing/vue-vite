export default {
    server: {
        host: "0.0.0.0",
        port: "667",
        proxy: {
            "/": {
                target: "http://jsonplaceholder.typicode.com",
                changeOrigin: true,
                configure: ( proxy, options ) => {
                    // proxy 是 'http-proxy' 的实例
                }
            }
        }
    }
};