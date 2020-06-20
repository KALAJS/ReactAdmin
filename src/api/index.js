/*
要求：能根据接口文档定义接口请求
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise
*/

//使用自己包装好的Ajax进行控件接口
import ajax from './ajax';
import jsonp from 'jsonp';
import { message } from 'antd'

const BASE = '/api'  //用于与后台的基路径匹配
//登录  每个组件接口逐步暴露控件后面的username与password是根据接口文档来的,返回值是promise对象
export const reqLogin = (username, password) => ajax(BASE + '/Login', { username, password }, 'POST')



//获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', { parentId })
//{parentId2:parentId}前面的对应属性名，后面的对应传递的值，由于接口文档对应的属性名是parentId，所以parentId2是不对的（去掉2）
//添加分类
//用两个参数接收，方法一
export const reqAddCategory = (parentId, categoryName) => ajax(BASE + '/manage/category/add', { parentId, categoryName }, 'POST')

//更新分类
//用一个对象接收，方法二
export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax(BASE + '/manage/category/update', { categoryId, categoryName }, 'POST')

//获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', { categoryId })

//获取商品分页列表（实现后台分页）
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', { pageNum, pageSize })

//更新商品状态（上架/下架）
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updatestatus', { productId, status }, 'POST')


//搜索商品分页列表(商品名称/商品描述)  将变量值作为属性名，需要在外边加上[]
//searchType:搜索的类型，productName/productDesc
//detail desc name imgs pCategoryId categoryId
export const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) => ajax(BASE + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName
})

//删除指定名称的图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', { name }, 'POST')


//添加商品 因为要提交好多的信息这里用一个对象product包含这些属性
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')
//更新商品  上面进行了二合一
// export const reqUpdateProduct = (product) => ajax('/manage/product/update', product, 'POST')

//获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')

//添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', { roleName }, 'POST')

//更新角色 ,将一个role对象传递过去，这样省的一个个属性了
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')

//获取所有用户的列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')

//删除指定用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', { userId }, 'POST')

//添加或更新用户  这里用user对象传入需要的数据
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

//json请求的接口请求函数
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        // ``与${}是模板字符串，可以在里面添加js语法
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        jsonp(url, {}, (err, data) => {
            if (!err || data.status === 'success') {
                //取出需要的数据，用解构的方法
                const { dayPictureUrl, weather } = data.results[0].weather_data[0]
                resolve({ dayPictureUrl, weather })
            } else {
                //如果失败了
                message.error('获取天气信息失败！')
            }
        })
    })

}
