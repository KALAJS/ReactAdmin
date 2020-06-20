import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd';//引入模态框

import { connect } from 'react-redux'

import Linkbutton from '../link-button'
import { reqWeather } from '../../api'
import menuList from '../config/menuConfig'
import { formateDate } from '../../utils/dateUtils'

import { logout } from '../../redux/actions'
import './index.less'


const { confirm } = Modal;//模态框中的confirm
/*
左侧导航地组件
*/
class Header extends Component {
    state = {
        //Date.now() 方法返回自1970年1月1日 00:00:00 UTC到当前时间的毫秒数。
        currentTime: formateDate(Date.now()),//当前时间字符串
        dayPictureUrl: '',  //天气图片的url
        weather: ''//天气的文本
    }
    getTime = () => {
        //每隔一秒钟，并更新状态数据,定时器的清除需要一个值，这样才能传递到clearInterval（）
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({ currentTime })
        }, 1000)
    }
    getWeather = async () => {
        //接口请求函数请求异步获取数据
        const { dayPictureUrl, weather } = await reqWeather('北京')
        //更新状态
        this.setState({ dayPictureUrl, weather })
    }
    getTitle = () => {
        // 当前路由组件的地址，由于这个组件不是路由组件，所以需要用到withRouter进行包装之后再暴露
        //这样就能获得location属性
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {//find方法只能查找一层所以用forEach进行遍历两次
            if (item.key === path) {//如果当前item对象的key与path一样，则item的title就是需要显示的title
                title = item.title
            } else if (item.children) {
                item.children.forEach(cItem => {
                    if (path.indexOf(cItem.key) === 0) {
                        title = cItem.title
                        // cItem.key === path
                    }

                })
            }
        })
        return title
    }
    //退出登录

    logout = () => {//实现模态框
        confirm({


            content: '确定退出吗？',
            onOk: () => {   //这是一个对象所以箭头函数需要这么写
                // 1和2的顺序不能变

                this.props.logout()

            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    //第一次render之后执行
    //一般在此执行异步操作：发ajax请求/启动定时器
    componentDidMount() {
        //获取当前的时间
        this.getTime()
        //获取当前的天气
        this.getWeather()
    }
    //不能这样做：不会更新显示
    // componentWillMount(){
    //     this.title=this.getTitle()
    // }

    //当前组件卸载之前调用
    componentWillUnmount() {
        //清除定时器
        clearInterval(this.intervalId)
    }
    render() {

        const { currentTime, dayPictureUrl, weather } = this.state
        const username = this.props.user.username
        //当前需要显示的title

        const title = this.props.headTitle
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <Linkbutton onClick={this.logout}>退出</Linkbutton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}



export default connect(
    state => ({ headTitle: state.headTitle, user: state.user }),
    { logout }
)(withRouter(Header))