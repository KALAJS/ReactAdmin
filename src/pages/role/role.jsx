import React, { Component } from 'react'
import { Button, Card, Table, Modal, message } from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api/index'
import AddForm from './add-form'
import AuthForm from './auth-form'

import { formateDate } from '../../utils/dateUtils'
import { connect } from 'react-redux'
import { logout } from '../../redux/actions'

/*
角色路由
*/
class Role extends Component {

    state = {
        roles: [],//所有角色对象
        role: {},//选中的role
        isShowAdd: false,//是否显示添加界面
        isShowAuth: false,//是否显示设置权限界面
    }

    constructor(props) {
        super(props)
        this.auth = React.createRef()
    }
    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate  //本身就是一个回调函数，所以直接将回调函数付给他
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            },

        ]
    }
    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({
                roles
            })
        }
    }
    onRow = (role) => {
        return {
            onClick: event => {  //点击行
                console.log(role);
                this.setState({
                    role
                })
            },
        }
    }
    //添加角色
    AddRole = () => {
        //进行表单验证，只能通过了才向下处理
        this.form.validateFields()
            .then(async (values) => {//表单验证成功之后在进行修改提交
                //隐藏确认框
                this.setState({
                    isShowAdd: false
                })
                //收集输入数据
                const { roleName } = values
                //请求添加
                const result = await reqAddRole(roleName)
                if (result.status === 0) {
                    message.success('添加角色成功')
                    // this.getRoles()以前都是用这种方法下面换一种方法更新列表
                    //新产生的角色
                    const role = result.data
                    //更新roles状态
                    //法1
                    // const roles = [...this.state.roles]//react要求一个新的数组去更新状态，而不是原来的直接更新
                    // roles.push(role)
                    // this.setState({
                    //     roles
                    // })
                    //法2
                    this.setState(state => ({
                        roles: [...state.roles, role]
                    }))

                } else {
                    message.success('添加角色失败')
                }

            })




        //根据结果提示/更新列表显示
    }
    //更新角色
    updateRole = async () => {
        //隐藏确认框
        this.setState({
            isShowAuth: false
        })
        const role = this.state.role
        //得到最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        //更新授权时间，然后再上面的列生成的地方用render函数去解决渲染的问题
        role.auth_time = Date.now()
        //再这里更新对应的授权人名
        role.auth_name = this.props.user.username
        //请求更新
        const result = await reqUpdateRole(role)
        if (result.status === 0) {

            //如果当前更新的是自己角色的权限，强制退出
            if (role._id === this.props.user.role_id) {
                this.props.logout()
                message.success('当前用户角色权限修改了，请重新登录')
            } else {
                message.success('设置角色权限成功')
                // this.getRoles()  或者用下面的方法
                //下面的之所以会有效果，是因为role是来自roles数组，同时const role = this.state.role
                //所以上面的role指向this.state.role，role.menus = menus这样的话就是更新state中的role
                //也就是更新roles 
                this.setState({
                    roles: [...this.state.roles]
                })
            }


        }
    }
    componentWillMount() {
        this.initColumn()
    }
    componentDidMount() {
        this.getRoles()
    }
    render() {
        const { roles, role, isShowAdd, isShowAuth } = this.state
        const title = (
            <span>
                <Button type='primary' onClick={() => { this.setState({ isShowAdd: true }) }}>创建角色</Button>
                <Button type='primary' disabled={!role._id} style={{ marginLeft: 10 }}
                    onClick={() => { this.setState({ isShowAuth: true }) }}>设置角色权限</Button>
                {/* 没有role._id代表没有选中，所以按钮是灰色的 */}
            </span>
        )


        return (

            < Card title={title} >
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{ defaultPageSize: PAGE_SIZE }}
                    rowSelection={{
                        type: 'radio', selectedRowKeys: [role._id],
                        onSelect: (role) => { //选择某个radio时回调
                            this.setState({
                                role
                            })
                        }
                    }}
                    //onRow是鼠标点击行，点击行就回调修改role，
                    //这样将 selectedRowKeys: [role._id] }与rowKey='_id'一致被选中
                    onRow={this.onRow}
                />
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.AddRole}
                    onCancel={() => { this.setState({ isShowAdd: false }) }}
                >
                    <AddForm
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => { this.setState({ isShowAuth: false }) }}
                >
                    <AuthForm
                        ref={this.auth}
                        role={role}
                    />
                </Modal>
            </Card >
        )
    }
}


export default connect(
    state => ({ user: state.user }),
    { logout }
)(Role)