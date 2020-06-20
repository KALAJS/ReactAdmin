import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'antd';


import { connect } from 'react-redux'
import { setHeadTitle } from '../../redux/actions'


import logo from '../../assets/images/logo.png';
import menuList from '../config/menuConfig';
import './index.less';

const { SubMenu } = Menu;
/*
左侧导航地组件
*/
class LeftNav extends Component {

    //判断当前登录用户对item是否有权限
    hasAuth = (item) => {
        const { key, isPublic } = item
        const menus = this.props.user.role.menus
        const username = this.props.user.username
        //1如果当前用户是admin，
        //2如果当前item是公开的
        //3当前用户有此item的权限：key有没有menus中
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children) {//4如果当前用户有此item的某个子item的权限
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)

        }
        return false
    }

    //根据menu的数据数组生成对应的标签数组
    //使用map()+递归调用
    getMenuNodes_map = (menuList) => {

        //得到当前请求的路由路径
        const path = this.props.location.pathname;

        return menuList.map(item => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            {item.icon}
                            <span>{item.title}</span>
                        </Link>

                    </Menu.Item>)
            } else {

                //查找一个当前请求路径匹配的子item,find是查找当前传递过来的item,不是遍历
                const cItem = item.children.find(cItem => cItem.key === path)


                //如果存在，说明当前item的子列表需要打开
                if (cItem) {
                    this.openKey = item.key
                }

                return (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                {item.icon}
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {/* 递归调用 生成sub下面的menu*/}
                        {this.getMenuNodes_map(item.children)}

                    </SubMenu>
                )
            }
        })
    }

    //根据memu的数据生成对应的标签数组
    //使用reduce()+递归调用
    getMenuNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            //得到当前请求的路由路径
            const path = this.props.location.pathname;

            //如果当前用户有item对应的权限，才需要显示对应的菜单项
            if (this.hasAuth(item)) {

                //判断item是否是当前对应的item
                if (item.key === path || path.indexOf(item.key) === 0) {
                    //更新redux中的headerTitle状态
                    this.props.setHeadTitle(item.title)
                }



                if (!item.children) {
                    //向pre中添加<Menu.Item>
                    pre.push((
                        <Menu.Item key={item.key}>
                            <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>
                                {item.icon}
                                <span>{item.title}</span>
                            </Link>

                        </Menu.Item>
                    ))
                } else {

                    //查找一个当前请求路径匹配的子item,以前是path===cItem.key
                    //path.indexOf(cItem.key) === 0是为了匹配主路径相同
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                    //如果存在，说明当前item的子列表需要打开
                    if (cItem) {
                        this.openKey = item.key
                    }




                    //向pre中添加<SubMenu>
                    pre.push((
                        <SubMenu
                            key={item.key}

                            title={
                                <span>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {/* 递归调用 生成sub下面的menu*/}
                            {this.getMenuNodes(item.children)}

                        </SubMenu>
                    ))
                }
            }



            return pre
        }, [])
    }

    componentWillMount() {
        //在第一次render运行之前，为第一个render准备数据（必须同步），this.openKey在渲染之前需要赋值
        //这样就能实现只用渲染一次而不是每次点击就渲染的多次渲染出结果
        this.menuNodes = this.getMenuNodes(menuList)
        //这个地方不能是const menuNodes=this.getMenuNodes(menuList)
        //将其赋值给this.menuNodes才能实现在外部的调用
        //componentDidMount在第一次render（）之后调用一次，启动异步任务，后面异步更新状态
    }

    render() {



        //得到当前请求的路由路径
        let path = this.props.location.pathname;
        //得到需要打开的菜单项的key
        const openKey = this.openKey
        //'abc'.indexOf('a')对应的值是0 b对应的是1 c对应的是2
        if (path.indexOf('/product') === 0) {//当前请求的是商品或其子路由界面
            path = '/product'
        }


        return (
            <div className="left-nav">
                {/* 点击头部即可跳转link */}
                <Link to='/home'>
                    <header className="left-nav-header">
                        <img src={logo} alt="logo" />
                        <h1>硅谷后台</h1>
                    </header>
                </Link>



                <Menu
                    // 初始化被选中
                    // defaultSelectedKeys	初始选中的菜单项 key 数组
                    // 修改为下面的selectedKeys 当前选中的菜单项 key 数组
                    selectedKeys={[path]}
                    //初始化被展开的  openKeys不行是因为其他的就展不开了
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"

                >
                    {/* 用独一无二的链接去替代key的数字,这样就能做到key的独一无二
                    <Menu.Item key="/home">
                        <Link to='/home'>
                            <PieChartOutlined />
                            <span>首页</span>
                        </Link>

                    </Menu.Item>

                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                <MailOutlined />
                                <span>商品</span>
                            </span>
                        }
                    >
                        <Menu.Item key="/category">
                            <Link to='/category'>
                                <MailOutlined />
                                <span>品类管理</span>
                            </Link>

                        </Menu.Item>
                        <Menu.Item key="/product">
                            <Link to='/product'>
                                <MailOutlined />
                                <span>商品管理</span>
                            </Link>
                        </Menu.Item>

                    </SubMenu>
                    <Menu.Item key="/user">
                        <Link to='/user'>
                            <MailOutlined />
                            <span>用户管理</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/role">
                        <Link to='/role'>
                            <MailOutlined />
                            <span>角色管理</span>
                        </Link>
                    </Menu.Item> */}
                    {
                        this.menuNodes
                    }

                </Menu>
            </div>

        )
    }
}
/*
withRouter 是高阶组件
包装非路由组件，返回一个新的组件
新的组件向非路由组件传递3个属性：history/location/match
LeftNav不是一个路由组件，而是一个普通的静态组件
*/

export default connect(
    state => ({ user: state.user }),
    { setHeadTitle }
)(withRouter(LeftNav)) 