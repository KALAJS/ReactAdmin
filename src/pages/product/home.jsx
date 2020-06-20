import React, { Component } from 'react'
import { Card, Select, Input, Button, Table, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
import memoryUtils from '../../utils/memoryUtils';


const Option = Select.Option

//product默认的子路由组件
export default class ProductHome extends Component {

    state = {
        total: 0,//商品的总数量
        products: [],//商品的数组
        loading: false,//是否正在加载中
        searchName: '',//搜索的关键字
        searchType: 'productName',//根据哪个字段搜索
    }
    //初始化Table列的数组
    initColums = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',

            },
            {
                title: '商品描述',
                dataIndex: 'desc',

            },
            {
                title: '价格',
                dataIndex: 'price',
                //render在这里用于指定这个列这里显示的界面
                //由于上面有了dataIndex所以这里传入的就是对应的dataIndex也就是price
                //要是没有传的话对应的就算是包含所有信息的对象
                render: (price) => '￥' + price

            },
            {
                width: 100,
                title: '商品描述',

                render: (products) => {
                    const { status, _id } = products
                    const newstatus = (status === 1 ? 2 : 1)
                    return (
                        <span>
                            <Button type='primary'
                                onClick={() => this.updateStatus(_id, newstatus)}
                            >{status === 1 ? '下架' : '上架'}</Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },

            {
                width: 100,
                title: '操作',
                render: (product) => {
                    return (
                        <span>
                            {/* 由于是路由组件可以访问到history属性进行跳转 ,product是对应的属性，现在以对象的形式传入，
                            接收的时候也要对应对象的形式*/}
                            <LinkButton onClick={() => this.showDetail(product)}>详情</LinkButton>
                            <LinkButton onClick={() => this.showUpdate(product)}>修改</LinkButton>
                        </span>
                    )
                }
            },
        ];
    }
    //显示商品详情界面
    showDetail = (product) => {
        //缓存product对象==>给detail组件使用
        memoryUtils.product = product
        this.props.history.push('./product/detail')
    }
    //显示修改商品界面
    showUpdate = (product) => {
        //缓存product对象==>给detail组件使用
        memoryUtils.product = product
        this.props.history.push('/product/addupdate')
    }

    //获取指定页码的列表数据显示
    getProducts = async (pageNum) => {
        this.pageNum = pageNum//将所在显示的页码存入到pageNum中,这样其他方法就能看见
        this.setState({ loading: true })//显示加载loading效果
        const { searchName, searchType } = this.state
        //如果搜索关键字有值，说明我们要进行搜索分页
        let result
        if (searchName) {
            result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
            //注意这个地方的赋值问题
        } else {//一般分页
            result = await reqProducts(pageNum, PAGE_SIZE)//PAGE_SIZE是需要去显示的页码常量在utils中
        }

        this.setState({ loading: false })//隐藏加载loading效果
        if (result.status === 0) {
            //取出分页数据，更新状态，显示分页列表
            const { total, list } = result.data
            this.setState({
                total,
                products: list
            })
        }
    }

    //更新商品的状态
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if (result.status === 0) {
            message.success('更新商品成功')
            this.getProducts(this.pageNum)  //重新过去分页数据，这样就会更新
        } else (
            message.error('更新商品失败')
        )
    }
    componentWillMount() {
        this.initColums()
    }
    componentDidMount() {
        this.getProducts(1)
    }
    render() {
        //取出状态数据
        const { products, total, loading, searchType, searchName } = this.state




        const title = (
            <span>
                <Select value={searchType} onChange={value => this.setState({ searchType: value })}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                {/* 写数字可以省略，字符串不能省略 */}
                <Input placeholder='关键字' style={{ width: 150, margin: '0 15px' }} value={searchName}
                    onChange={event => this.setState({ searchName: event.target.value })}
                />{/*注意Input的onChange方法传入的是event，注意看文档*/}
                {/* 显示搜索的第一页 */}
                <Button type="primary" onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
                <PlusOutlined />
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table dataSource={products}
                    columns={this.columns}
                    loading={loading}
                    rowKey='_id'
                    bordered
                    pagination={{
                        current: this.pageNum, //查询分页之后显示在第一页
                        total, defaultPageSize: PAGE_SIZE, showQuickJumper: true,
                        onChange: this.getProducts  //这个看看后面要是不行的话传值进去试试(values)=>{},table的页面点击等
                    }}//注意这个onChange是写在pagination中的

                >

                </Table>
            </Card>
        )
    }
}
