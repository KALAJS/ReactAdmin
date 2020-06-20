import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
import propTypes from 'prop-types'


const Item = Form.Item
const Option = Select.Option

//添加/修改用户的form组件
export default class UserForm extends Component {
    static propTypes = {
        setForm: propTypes.func.isRequired,
        roles: propTypes.array.isRequired,
        user: propTypes.object,

    }

    constructor(props) {
        super(props)
        //创建用来保存ref标识的标签对象的容器
        this.formRef = React.createRef();
    }
    // formRef = React.createRef();
    roleNameChange = () => {

        // this.props.setForm(this.formRef.current.getFieldsValue(['categoryName', 'parentId']))
        this.props.setForm(this.formRef.current)

    }
    onFill = () => {//初始值重置

        this.formRef.current.resetFields();
    };
    componentDidUpdate() {
        this.onFill()//调用初始值重置
    }

    render() {
        const { roles } = this.props
        const user = this.props.user || {}  //防止传过来的是undefined
        const formItemLayout =
        {
            labelCol: { span: 4 },//左侧的label的宽度，总共24格，用于form的大小设置
            wrapperCol: { span: 15 },
        }

        return (
            <Form
                initialValues={{
                    remember: true,
                    username: user.username,
                    password: user.password,
                    phone: user.phone,
                    email: user.email,
                    role_id: user.role_id
                }}
                onValuesChange={this.roleNameChange}
                ref={this.formRef}
                {...formItemLayout}
            >

                <Item name='username' label='用户名'
                    rules={[
                        { required: true, message: '用户名必须输入' },
                    ]}>
                    <Input placeholder="请输入用户名" />
                </Item>
                {
                    user._id ? null : (
                        <Item name='password' label='密码'
                            rules={[
                                { required: true, message: '密码必须输入' },
                            ]}>
                            <Input type='password' placeholder="请输入密码" />
                        </Item>
                    )
                }
                <Item name='phone' label='手机号'
                    rules={[
                        { required: true, message: '角色名称必须输入' },
                    ]}>
                    <Input placeholder="请输入手机号" />
                </Item>

                <Item name='email' label='邮箱'
                    rules={[
                        { required: true, message: '邮箱必须输入' },
                    ]}>
                    <Input placeholder="请输入邮箱" />
                </Item>
                <Item name='role_id' label='角色'
                    rules={[
                        { required: true, message: '邮箱必须输入' },
                    ]}>
                    <Select>
                        {
                            roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                        }
                    </Select>
                </Item>
            </Form>
        )
    }
}
