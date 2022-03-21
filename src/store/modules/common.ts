import { setStore, getStore, removeStore } from '@/utils/store'
import { userData } from '@/utils/interface'
import { lighten } from '@/utils/themeColor'

const common = {
    state: {
        language:
            getStore({
                name: 'language'
            }) || 'zh',
        themeColor:
            getStore({
                name: 'themeColor'
            }) || '#007dff',
        userInfo:
            getStore({
                name: 'userInfo'
            }) || {}
    },
    mutations: {
        SET_LANGUAGE: (state:any, language:string) => {
            state.language = language
            var head = document.getElementsByTagName('head')[0]
            for (let i in head.children) {
                if (head.children[i].attributes) {
                    if (head.children[i].attributes[0]) {
                        if (head.children[i].attributes[0].name === 'href') {
                            if (head.children[i].attributes[0].value.includes('public.css')) {
                                head.removeChild(head.children[i])
                                console.log(head.children[i])
                            }
                        }
                    }
                }
            }
            if (language === 'fan') {
                loadStyles('../../css/ar_public.css')
            } else {
                loadStyles('../../css/public.css')
            }

            function loadStyles(url:string) {
                var link = document.createElement('link')
                link.rel = 'stylesheet'
                link.type = 'text/css'
                link.href = url
                head.appendChild(link)
            }
            setStore({
                name: 'language',
                content: state.language
            })
        },
        SET_THEME_COLOR(state: any, color: string) {
            state.themeColor = color
            let attribute = ''
            attribute += `--systemThemeColor: ${color};`
            let result = lighten(color, 58)
            attribute += `--systemThemeColorActive: ${result};`
            document.querySelector(':root').setAttribute('style', attribute)
            setStore({
                name: 'themeColor',
                content: color
            })
        },
        SET_USER_INFO(state: any, userInfo: userData) {
            state.userInfo = userInfo
            setStore({
                name: 'userInfo',
                content: state.userInfo
            })
        }
    },
    actions: {}
}
export default common
