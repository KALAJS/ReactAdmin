import React, { Component } from 'react'
import propTypes from 'prop-types'
import { Form, Input } from 'antd'



const Item = Form.Item

//更新分类(修改分类)的form组件
class UpdateForm extends Component {
    static propType = {
        categoryName: propTypes.string.isRequired,
        setForm: propTypes.func.isRequired
    }

    formRef = React.createRef();
    categoryNameChange = () => {

        // this.props.setForm(this.formRef.current.getFieldValue('categoryName1'))
        this.props.setForm(this.formRef.current)//将this.formRef.current传回就能调用它的方法


    }
    onFill = () => {//初始值重置
        this.formRef.current.setFieldsValue({
            categoryName1: this.props.categoryName,
        });
    };
    componentDidUpdate() {
        this.onFill()//调用初始值重置
    }


    render() {
        const { categoryName } = this.props
        console.log(categoryName);


        return (
            <Form
                initialValues={{
                    remember: false,
                    categoryName1: categoryName,
                }}
                onValuesChange={this.categoryNameChange}
                ref={this.formRef}
            >
                <Item name='categoryName1'
                    rules={[
                        { required: true, message: '分类名称必须输入' },
                    ]}
                >
                    <Input placeholder="请输入名称" />

                </Item>

            </Form>
        )
    }
}


export default UpdateForm