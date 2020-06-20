import React, { Component } from 'react'
import { Card, List } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button'
import { BASE_IMG_URL } from '../../utils/constants'
import { reqCategory } from '../../api'
import memoryUtils from '../../utils/memoryUtils';

const Item = List.Item
//product的详情子路由组件
export default class ProductDetail extends Component {

    state = {
        cName1: '',//一级分类名称
        cName2: '',//二类分类名称

    }

    async componentDidMount() {
        //得到当前商品的分类ID
        const { pCategoryId, categoryId } = memoryUtils.product
        if (pCategoryId === '0') {//pCategoryId  ,是对应查询物品的parentId
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({ cName1 })
        } else {//二级分类下的物品
            //通过多个await发送请求效率太低
            // const result1 = await reqCategory(pCategoryId)
            // const result2 = await reqCategory(categoryId)
            // const cName1 = result1.data.name
            // const cName2 = result2.data.name
            //一次性发送多个请求Promise.all（[]）将多个实例包装成一个新的实例
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({
                cName1,
                cName2
            })
        }
    }
    //在卸载之前清除保存的数据
    componentWillUnmount() {
        memoryUtils.product = {}
    }
    render() {
        //读取携带过来的state数据（product）
        const { name, desc, price, detail, imgs } = memoryUtils.product
        const { cName1, cName2 } = this.state
        const title = (
            <span>
                {/* 使用link-button包裹按钮 */}
                <LinkButton style={{ marginRight: 15, fontSize: 20 }}
                    onClick={() => this.props.history.goBack()}
                >
                    <ArrowLeftOutlined />
                </LinkButton>

                <span>商品详情</span>
            </span>
        )
        return (

            <Card title={title} className='product-detail'>
                <List className='product-list'>
                    <Item>
                        <span className='left'>商品名称</span>
                        <span> {name}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品描述</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品价格</span>
                        <span> {price}</span>
                    </Item>
                    <Item>
                        <span className='left'>所属分类</span>
                        <span>{cName1} {cName2 ? '-->' + cName2 : ''}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品图片</span>
                        <span>
                            {
                                imgs.map(img => (
                                    <img src={BASE_IMG_URL + img} key={img} alt="" className='product-img' />
                                ))
                            }

                            <img src="" alt="" className='product-img' />
                        </span>
                    </Item>
                    <Item>
                        <span className='left'>详情</span>
                        <span dangerouslySetInnerHTML={{ __html: detail }}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
