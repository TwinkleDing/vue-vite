let apiUrl: string = `http://localhost:6677`

if (process.env.NODE_ENV === "production") {
    apiUrl = window.config?.apiUrl
}

export const BaseUrl = apiUrl
