/*
能发送异步ajax请求的函数模块
封装axios库
函数的返回值是promise对象
1优化：统一处理请求异常
2调用antd中的message处理错误信息
*/

import axios from 'axios';
import { message } from 'antd';


//data = {}, type = 'GET'形参默认值r，axios返回的是一个promise对象
export default function ajax(url, data = {}, type = 'GET') {
    return new Promise((resolve, reject) => {
        let promise;
        //1执行异步ajax请求
        if (type === 'GET') {  //发GET请求
            promise = axios.get(url, {//配置对象
                params: data//指定请求参数
            })
        } else {//发POST请求
            promise = axios.post(url, data)
        }
        //2如果成功了，调用resolve（value）
        promise.then((response) => {
            resolve(response.data);
        })
            //3如果失败了，不调用reject（reason），而是显示异常信息
            //通过antd的message.error 方法实现错误信息的提示（在界面），从而不需要reject将错误信息传递到login控件
            //所以在login组件中也不需要用try catch来处理错误信息
            //这里的请求出错是连接到数据库过程出现问题，密码输错在连接正常的情况下是返回的是请求成功
            .catch(error => {
                message.error('请求出错了' + error.message)
            })
    })

}


//初始版上面将统一处理请求错误的问题
// export default function ajax(url, data = {}, type = 'GET') {
//     if (type === 'GET') {  //发GET请求
//         return axios.get(url, {//配置对象
//             params: data//指定请求参数
//         })
//     } else {//发POST请求
//         return axios.post(url, data)
//     }
// }