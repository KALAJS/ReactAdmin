import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import './login.less'
import logo from '../../assets/images/logo.png'

import { login } from '../../redux/actions'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';

/*
登录的路由组件
*/
class Login extends Component {
    onFinish = async (values) => {
        console.log('Received values of form: ', values);
        //结构values
        const { username, password } = values;
        //调用分发异步action的函数=>发登录的异步 请求，有了结果后更新状态
        this.props.login(username, password)



    };
    render() {
        //如果用户已经登录，自动跳转到管理界面
        const user = this.props.user
        if (user && user._id) {
            return <Redirect to='/home' />
        }
        const errorMsg = this.props.user.errorMsg

        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="" />
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <div className={user.errorMsg ? 'error-msg show' :
                        'error-msg'}>{user.errorMsg}</div>
                    <h2>用户登录</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                            username: 'admin'//对应下面的name属性在这里设置初始值
                        }}
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            name="username"
                            //声明式认证：直接使用别人定义好的验证规则进行验证
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: '请输入你的用户名',
                                },
                                {
                                    min: 4,
                                    message: '不能小于4位'
                                },
                                {
                                    max: 12,
                                    message: '不能大于12位'
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_]+$/,
                                    message: '用户名必须是英文、数字或下划线组成'
                                },



                            ]}
                        >

                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                //利用Rule里面的元素validator进行自定义判断，设定函数进行比较
                                // () => ({  //括号里面可以传值{ getFieldValue }参考案例即可
                                //     validator(rule, value) {
                                //         if (!value) {
                                //             return Promise.reject('请输入密码');
                                //         } else if (value.length < 4) {
                                //             return Promise.reject('密码长度不能小于4位');
                                //         } else if (value.length > 12) {
                                //             return Promise.reject('密码长度不能大于12位');
                                //         } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                                //             return Promise.reject('密码必须是英文、数字或下划线组成');
                                //         } else {
                                //             return Promise.resolve('验证通过');
                                //         }
                                //     }
                                // }),
                                {
                                    validator: (rule, value) => {
                                        if (!value) {
                                            return Promise.reject('请输入密码');
                                        } else if (value.length < 4) {
                                            return Promise.reject('密码长度不能小于4位');
                                        } else if (value.length > 12) {
                                            return Promise.reject('密码长度不能大于12位');
                                        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                                            return Promise.reject('密码必须是英文、数字或下划线组成');
                                        } else {
                                            return Promise.resolve('验证通过');
                                        }
                                    }
                                }
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" twoToneColor="#52c41a" />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
        </Button>

                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}
export default connect(
    state => ({ user: state.user }),
    { login }
)(Login)


/*
1前台表单验证
2收集表单输入数据
*/

/*
async和await
1作用？
简化promise对象的使用：不用再使用then()来指定成功/失败的回调函数
以同步编码的方式（没有回调函数）方式实现异步流程
2哪里写await
再返回promise的表达式左侧写await：不想要promise，想要promise异步执行的成功的value数据
3哪里写async
await所在函数(最近的)定义的左侧写async
*/