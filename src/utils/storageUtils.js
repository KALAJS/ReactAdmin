/*
进行local数据存储管理模块，将登录信息存储到本地
locaStorage对一些低版本浏览器不兼容，所以引入store处理这个问题
*/
import store from 'store';

const USER_KEY = 'user_key';//设置统一的名称防止出错
export default {
    //保存user
    saveUser(user) {
        //JSON.stringify将JSON对象变成JSON字符串
        // localStorage.setItem(USER_KEY, JSON.stringify(user))
        store.set(USER_KEY, user);
    },
    //读取user
    getUser() {
        //JSON.parse()是将JSON字符串变成JSON对象
        // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
        return store.get(USER_KEY) || {};
    },
    //删除user
    removeUser() {
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY);
    }
}