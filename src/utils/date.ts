export const calcDate = (date1, date2) => {
    var date3 = date2 - date1,

        days = Math.floor(date3 / (24 * 3600 * 1000)),

        leave1 = date3 % (24 * 3600 * 1000), //计算天数后剩余的毫秒数
        hours = Math.floor(leave1 / (3600 * 1000)),

        leave2 = leave1 % (3600 * 1000), //计算小时数后剩余的毫秒数
        minutes = Math.floor(leave2 / (60 * 1000)),

        leave3 = leave2 % (60 * 1000), //计算分钟数后剩余的毫秒数
        seconds = Math.round(date3 / 1000);
    return {
        leave1,
        leave2,
        leave3,
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    };
};

/**
 * 日期格式化
 */
export function dateFormat(date: new Date()): string {
    let format: string = "yyyy-MM-dd hh:mm:ss";
    if (date !== "Invalid Date") {
        var o = {
            "M+": date.getMonth() + 1, //month
            "d+": date.getDate(), //day
            "h+": date.getHours(), //hour
            "m+": date.getMinutes(), //minute
            "s+": date.getSeconds(), //second
            "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
            S: date.getMilliseconds() //millisecond
        };
        if (/(y+)/.test(format)) {
            format = format.replace(
                RegExp.$1,
                String(date.getFullYear()).substr(4 - RegExp.$1.length)
            );
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1
                        ? o[k]
                        : ("00" + o[k]).substr(String(o[k]).length)
                );
            }
        }
        return format;
    }
    return "";
}
