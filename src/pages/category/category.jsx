import React, { Component } from 'react'

import { Card, Table, Button, message } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Modal } from 'antd';//引入模态框
import LinkButton from '../../components/link-button/index'
import { reqCategorys, reqUpdateCategory, reqAddCategory } from '../../api/index'
import AddForm from './add-form'
import UpdateForm from './update-form'


/*
商品分类路由
*/
export default class Category extends Component {

    state = {
        loading: false,//是否在获取数据中，false为不在
        categorys: [],//一级分类列表
        subCategorys: [],//二级分类列表
        parentId: '0',//当前需要显示的分类列表的父分类ID
        parentName: '',//当前需要显示的父分类名称
        showStatus: 0,//标识添加/更新的确认框是否显示，0：都不显示，1：显示添加，2：显示更新

    }
    //初始化Table所有列的数组
    initColumns = () => {
        //列及信息
        this.columns = [
            {
                title: '分类的名称',
                //指定对应的列的内容，name与上面的数据源获取的列表对象中的name对应，显示数据对应的属性名
                dataIndex: 'name',

            },
            {
                width: 300,  //指定列宽度
                title: '操作',
                //将每一行对应的category对象传入
                render: (category) => ( //指定返回需要显示的界面标签，在antd的Table下面找到的范例

                    <span>
                        <LinkButton onClick={() => { this.showUpdate(category) }}>修改分类</LinkButton>

                        {this.state.parentId === '0' ? <LinkButton onClick={() => { this.showSubCategorys(category) }}>查看子分类</LinkButton> : null}

                        {/* 通过这个箭头函数，实现在点击的时候调用，要不然就会在渲染的时候直接调用 */}
                        {/* this.showSubCategorys.bind(this, category)也可以实现 */}
                    </span>
                ),
            },

        ];
    }
    //异步获取一级或二级分类列表显示
    //parentId:如果没有指定根据状态中的parentId请求，如果指定了根据指定的请求
    getCategorys = async (parentId) => {
        //在发请求之前，显示loading
        this.setState({ loading: true })
        parentId = parentId || this.state.parentId
        //发Ajax请求获得数据
        const result = await reqCategorys(parentId)//
        //在请求完成之后，隐藏loading
        this.setState({ loading: false })
        if (result.status === 0) {
            //取出分类数组（可能是一级也可能是二级的）
            const categorys = result.data
            //更新状态
            if (parentId === '0') {
                this.setState({
                    categorys
                })
            } else {
                this.setState({
                    //上面的reqCategorys方法返回的是const categorys = result.data所以这里赋值需要注意
                    subCategorys: categorys
                })
            }

        } else {
            message.error('获取分类列表失败')
        }
    }
    //显示指定一级分类对象的二级子列表
    showSubCategorys = (category) => {
        //先更新状态,将子列表的id及名称赋值
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => { //setState的状态更新且重新执行render之后执行，这样就能在保证获得状态之后更新
            //跟新完成后调用获取二级列表
            this.getCategorys()
        })


    }
    //返回显示一级分类列表
    showCategorys = () => {
        //将初始状态还原到原来的空状态就可还原成原来的情况,一级列表显示
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: [],

        })
    }
    //响应点击取消：隐藏确定框
    handleCancel = () => {
        this.setState({
            showStatus: 0
        })
    }
    //显示添加的确认框
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }
    //添加分类
    addCategory = () => {

        this.form.validateFields()
            .then(async (values) => {//表单验证成功之后在进行修改提交
                //1隐藏确定框
                this.setState({
                    showStatus: 0
                })
                //2收集数据，并提交添加分类得到请求
                const parentId = values.parentId  //在option中对应的列表名称对应各自的_id，value='_id'
                const categoryName = values.categoryName

                const result = await reqAddCategory(parentId, categoryName)
                if (result.status === 0) {
                    //3重新显示列表
                    if (parentId === this.state.parentId) {
                        this.getCategorys()//添加的分类是当前显示的分类
                    } else if (parentId === '0') {//在二级分类列表下添加一节分类，重新获取一级分类列表，但不需要显示一级列表
                        this.getCategorys('0')  //通过输入'0'实现parentId='0'这样就能重新获取一级列表，但是不更新页面
                    }

                }
            })



    }
    //显示更新（修改分类）的确认框
    showUpdate = (category) => {
        //保存分类对象
        this.category = category;
        //更新显示状态
        this.setState({
            showStatus: 2
        })
        console.log('弹出修改框');
        console.log(category);


    }
    //更新分类（修改分类）的确认键
    updateCategory = () => {
        this.form.validateFields()
            .then(async (values) => {//表单验证成功之后在进行修改提交
                //1隐藏确定框
                this.setState({
                    showStatus: 0
                })
                //2发请求更新分类
                //准备数据
                const categoryId = this.category._id
                // const categoryName = this.form.getFieldValue('categoryName1')//获取值的方法用验证的values替代
                const categoryName = values.categoryName1

                console.log(categoryName);

                const result = await reqUpdateCategory({ categoryId, categoryName })
                if (result.status === 0) {
                    //3重新显示列表
                    this.getCategorys()
                }
            })



    }


    //为第一次render准备数据
    componentWillMount() {
        this.initColumns();
    }
    //执行异步任务：发异步Ajax请求
    componentDidMount() {
        //获取一级分类列表显示，这是因为初始值查找的parentId是'0'
        this.getCategorys()
    }
    render() {
        //读取状态数据
        const { parentId, loading, categorys, subCategorys, parentName, showStatus } = this.state
        //读取指定的分类
        const category = this.category || {}//只有在点击触发的时候才会有this.category，所以给一个空对象，否则第一次渲染会报错


        //card的左侧
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{ marginRight: 5 }} />
                {/* 上面是按钮修改一下间距 */}
                <span>{parentName}</span>
            </span>
        )
        //Card的右侧
        const extra = (
            <Button type="primary" onClick={this.showAdd}>
                <PlusOutlined />
                {/* 加号样式 */}
        添加
            </Button>
        )

        return (
            <Card title={title} extra={extra} >
                <Table
                    dataSource={parentId === '0' ? categorys : subCategorys}
                    columns={this.columns}
                    bordered  //带边框
                    rowKey='_id'  //表格行 key 的取值，可以是字符串或一个函数
                    loading={loading}//设置一个值，数据加载的时候显示loading，加载完毕不显示
                    pagination={{ defaultPageSize: 5, showQuickJumper: true }}//设置分页为5
                />
                {/* 通过控制标签形式的modal框的visible状态实现模态框的显示 */}
                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categorys={categorys}
                        parentId={parentId}

                        setForm={(form) => { this.form = form }}
                    />
                </Modal>
                <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        categoryName={category.name}

                        setForm={(form) => { this.form = form }}//将函数传入子组件从而获得子组件属性
                    />
                    {console.log(this.form)}
                </Modal>
            </Card>
        )
    }
}
