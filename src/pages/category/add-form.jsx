import React, { Component } from 'react'
import { Form, Select, Input } from 'antd'
import propTypes from 'prop-types'


const Item = Form.Item
const { Option } = Select  //解构的方式写出来的
//添加分类的form组件
export default class AddForm extends Component {

    static propTypes = {
        categorys: propTypes.array.isRequired,//一级分类的数组
        parentId: propTypes.string.isRequired//父分类的ID
    }
    formRef = React.createRef();
    categoryNameChange = () => {

        // this.props.setForm(this.formRef.current.getFieldsValue(['categoryName', 'parentId']))
        this.props.setForm(this.formRef.current)

    }
    onFill = () => {//初始值重置
        this.formRef.current.setFieldsValue({
            category: this.props.parentId,
            categoryName: ''
        });
        this.formRef.current.resetFields();
    };
    componentDidUpdate() {
        this.onFill()//调用初始值重置
    }

    render() {
        const { categorys, parentId } = this.props

        return (
            <Form
                initialValues={{
                    remember: true,
                    parentId: parentId,  //从父组件传入的parentId
                    categoryName: ''
                }}
                onValuesChange={this.categoryNameChange}
                ref={this.formRef}
            >
                <Item name='parentId'>
                    <Select >
                        <Option value='0'>一级分类</Option>
                        {
                            categorys.map(c => <Option value={c._id}>{c.name}</Option>)
                            //以_id作为value 的值进行Option生成内容就是.name
                        }
                    </Select>
                </Item>
                <Item name='categoryName'
                    rules={[
                        { required: true, message: '分类名称必须输入' },
                    ]}>
                    <Input placeholder="请输入名称" />
                </Item>

            </Form>
        )
    }
}
