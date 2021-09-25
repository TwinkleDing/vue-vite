module.exports = {
    root: true,
    parserOptions: {
        sourceType: "module"
    },
    parser: "vue-eslint-parser",
    env: {
        browser: true,
        node: true,
        es6: true
    },
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
        "indent": [ "error", 4 ],
        "brace-style": [
            2,
            "1tbs",
            {
                allowSingleLine: false
            }
        ],
        semi: [ 2, "always" ],
        // 控制逗号在行尾出现还是在行首出现
        "comma-style": [ 2, "last" ],
        // 双峰驼命名格式
        "camelcase": 2,
        // 使用 === 替代 ==
        "eqeqeq": [ 2, "allow-null" ],
        "no-const-assign": 2, //禁止修改const声明的变量
        "no-constant-condition": 2, //禁止在条件中使用常量表达式 if(true) if(1)
        "no-else-return": 2, //如果if语句里面有return,后面不能跟else语句
        "no-empty": 2, //块语句中的内容不能为空
        "no-eq-null": 2, //禁止对null使用==或!=运算符
        "no-extra-parens": 2, //禁止非必要的括号
        "no-extra-semi": 2, //禁止多余的冒号
        "no-func-assign": 2, //禁止重复的函数声明
        "no-implicit-coercion": 1, //禁止隐式转换
        "no-irregular-whitespace": 2, //不能有不规则的空格
        "no-mixed-requires": [ 0, false ], //声明时不能混用声明类型
        "no-mixed-spaces-and-tabs": [ 2, false ], //禁止混用tab和空格
        "linebreak-style": [ 0, "windows" ], //换行风格
        "no-multi-spaces": 1, //不能用多余的空格
        "no-multi-str": 2, //字符串不能用\换行
        "no-multiple-empty-lines": [ 1, {
            "max": 2
        } ], //空行最多不能超过2行
        "no-nested-ternary": 0, //禁止使用嵌套的三目运算
        "no-param-reassign": 2, //禁止给参数重新赋值
        "no-sequences": 0, //禁止使用逗号运算符
        "no-spaced-func": 2, //函数调用时 函数名与()之间不能有空格
        "no-sparse-arrays": 2, //禁止稀疏数组， [1,,2]
        "no-trailing-spaces": 1, //一行结束后面不要有空格
        "no-undef-init": 2, //变量初始化时不能直接给它赋值为undefined
        "curly": [ 2, "all" ], //必须使用 if(){} 中的{}
        "dot-location": 0, //对象访问符的位置，换行的时候在行首还是行尾
        "func-names": 0, //函数表达式必须有名字
        "object-shorthand": 0, //强制对象字面量缩写语法
        "quotes": [ 1, "double" ], //引号类型 `` "" ''
    },
};