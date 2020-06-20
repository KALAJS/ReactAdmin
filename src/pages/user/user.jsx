import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { formateDate } from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/constants'
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from '../../api'
import UserForm from './user-form'
/*
用户路由
*/
export default class User extends Component {
    state = {
        users: [],//所用的用户列表
        roles: [],//所有角色的列表
        isShow: false,//标识是否显示确认框
    }
    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                // render:(role_id)=>this.state.roles.find(role=>role._id===role_id).name每次都要重新遍历
                render: (role_id) => this.roleNames[role_id]

            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            },
        ]
    }

    // 点方法后面跟的必须是一个指定的属性名称，而中括号方法里面可以是变量。例如
    // var haha = "name";
    // console.log(obj.haha); // undefined
    // console.log(obj[haha]); // cedric


    //根据role的数组，生成包含所有角色名的对象（属性名）,初始值是空对象，所以这里能生成一个对象只统计一次
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        //保存起来在initColumns中就能用
        this.roleNames = roleNames
    }
    //显示添加界面
    showAdd = () => {
        this.user = null  //去除前面保存的user，在添加的界面这个地方需要清除
        this.setState({ isShow: true })
    }

    //显示修改界面
    showUpdate = (user) => {
        this.user = user//保存user
        this.setState({
            isShow: true
        })
    }

    //删除指定用户
    deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗？`,

            onOk: async () => {  //这个地方修改为箭头函数形式
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success('删除用户成功')
                    this.getUsers()
                }
            },

        })
    }

    //添加或者更新用户
    addOrUpdateUser = async () => {

        this.setState({ isShow: false })
        //1收集输入的数据
        const user = this.form.getFieldsValue()
        //如果是更新，需要给user指定_id属性
        if (this.user) {
            user._id = this.user._id
        }
        //2提交添加的请求
        const result = await reqAddOrUpdateUser(user)
        //3更新显示列表
        if (result.status === 0) {
            message.success(`${this.user ? '修改' : '添加'}用户成功`)
            this.getUsers()
        }
    }

    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const { users, roles } = result.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles
            })
        }
    }
    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getUsers()
    }
    render() {
        const { users, isShow, roles } = this.state
        const user = this.user || {}  //防止传过来的是undefined
        const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>
        return (
            <Card title={title}>
                <Table
                    dataSource={users}
                    columns={this.columns}
                    bordered  //带边框
                    rowKey='_id'  //表格行 key 的取值，可以是字符串或一个函数
                    //loading={loading}//设置一个值，数据加载的时候显示loading，加载完毕不显示
                    pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}//设置分页为5
                />
                <Modal
                    title={user._id ? '修改用户' : '添加用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => this.setState({ isShow: false })}
                >
                    <UserForm setForm={(form) => this.form = form} roles={roles} user={user} />
                </Modal>
            </Card>
        )
    }
}
