import request from "@/router/axios";
import { baseUrl } from "@/config/env";

// 评论列表
export const commentList = data =>
    request({
        url: baseUrl+"/leave",
        method: "get",
        params: {
            ...data
        }
    });

// 添加评论
export const addComment = data =>
    request({
        url: baseUrl+"/leave",
        method: "post",
        data: {
            ...data
        }
    });

// 删除评论
export const deleteComment = data =>
    request({
        url: baseUrl+"/leave",
        method: "delete",
        data: {
            ...data
        }
    });
