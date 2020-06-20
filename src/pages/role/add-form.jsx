import React, { Component } from 'react'
import { Form, Input } from 'antd'



const Item = Form.Item

//添加分类的form组件
export default class AddForm extends Component {


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
        const formItemLayout =
        {
            labelCol: { span: 4 },//左侧的label的宽度，总共24格，用于form的大小设置
            wrapperCol: { span: 15 },
        }

        return (
            <Form
                initialValues={{
                    remember: true,

                    roleName: ''
                }}
                onValuesChange={this.roleNameChange}
                ref={this.formRef}
            >

                <Item name='roleName' label='角色名称'  {...formItemLayout}
                    rules={[
                        { required: true, message: '角色名称必须输入' },
                    ]}>
                    <Input placeholder="请输入名称" />
                </Item>

            </Form>
        )
    }
}
