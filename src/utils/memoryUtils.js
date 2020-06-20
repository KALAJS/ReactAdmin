/*
用来再内存中保存一些工具模块
*/

export default {
    //用了redux这个就没有用了
    user: {},//保存当前登录的user,login返回的result.data存储再user中就可以再admin中调用
    product: {},//指定的商品对象
}