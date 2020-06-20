import React, { Component } from 'react'
import { Card, Form, Input, Cascader, Button, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddOrUpdateProduct } from '../../api'  //根据父ID获取一级或二级分类列表
import PicturesWall from './pictures-wall'
import RichTextEditor from './richtexteditor'
import memoryUtils from '../../utils/memoryUtils';


const Item = Form.Item
const { TextArea } = Input



//product的添加和更新子路由组件
export default class ProductAddUpdate extends Component {
    state = {
        options: []
    };

    constructor(props) {
        super(props)
        //创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }
    initOptions = async (categorys) => {
        //根据categorys生成options数组,categorys是一个数组里面的元素是一个个对象
        const options = categorys.map(c => ({//为了返回的是一个对象，用小括号
            value: c._id,
            label: c.name,
            isLeaf: false,//不是叶子
        }))
        //如果是一个二级分类商品的更新
        const { isUpdate, product } = this
        const { pCategoryId } = product
        if (isUpdate && pCategoryId !== '0') {
            //获取对应的二级分类别表
            const subCategorys = await this.getCategorys(pCategoryId)
            //生成二级列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,//是叶子
            }))
            //找到当前商品对应的一级option对象
            const targetOption = options.find(option => option.value === pCategoryId)
            //关联对应的上一级option上
            targetOption.children = childOptions
        }

        // 更新options状态
        this.setState({ options })
    }
    //获取一级分类列表或者二级分类列表,并显示
    //async函数的返回值是一个新的promise对象，promis的结果和值由async的结果来决定
    //所以下面在想得到this.getCategorys(targetOption.value)的值要用async
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId) //{status:0,data:categorys}，categorys是一个数组
        if (result.status === 0) {
            const categorys = result.data
            //如果是一级分类列表
            if (parentId === '0') {
                this.initOptions(categorys)
            } else {//二级列表
                return categorys    //返回二级列表==>当前async函数返回的promise就会成功且value为categorys
            }

        }
    }

    //自定义的价格验证
    validatePrice = (rule, value) => {
        if (!value) {
            return Promise.reject('请输入商品价格,且必须为数字');
        } else if (value * 1 < 0) {
            return Promise.reject('商品价格必须大于零');
        } else {
            return Promise.resolve('验证通过');
        }
    }
    //用于加载下一级列表的回调函数
    loadData = async selectedOptions => {
        //得到选择的option对象
        //selectedOptions是Cascader中自带的函数
        const targetOption = selectedOptions[0];//可用于选多个元素，数组里面就一个元素这里写零即可
        //显示loading
        targetOption.loading = true;

        //根据选中的分类，请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        //隐藏loading
        targetOption.loading = false;
        //二级分类列表有数据
        if (subCategorys && subCategorys.length > 0) {
            //生成一个二级列表的options
            const cOptions = subCategorys.map(c => ({//为了返回的是一个对象，用小括号
                value: c._id,
                label: c.name,
                isLeaf: true,//是叶子
            }))
            //关联到当前option上
            targetOption.children = cOptions
        } else {//当前选中的分类没有二级分类，说明他是叶子
            targetOption.isLeaf = true
        }
        //更新options状态
        this.setState({
            options: [...this.state.options],//重新解构生成一个数组
        });
        // 模拟请求异步获取二级列表数据，并更新
    }
    submit = async (values) => {
        //进行表单验证，如果通过了，才发送请求
        console.log('dd', values);
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()

        //1收集数据,并封装成product对象
        const { name, desc, price, categoryIds } = values
        let pCategoryId, categoryId
        if (categoryIds.length === 1) {
            pCategoryId = '0'
            categoryId = categoryIds[0]
        } else {
            pCategoryId = categoryIds[0]
            categoryId = categoryIds[1]
        }
        const product = { name, desc, price, imgs, detail, pCategoryId, categoryId }
        if (this.isUpdate) {
            product._id = this.product._id
        }

        //2调用接口请求函数去添加/更新
        const result = await reqAddOrUpdateProduct(product)
        //3根据结果提示
        if (result.status === 0) {
            message.success(`${this.isUpdate ? '更新' : '添加'}商品成功`)
            this.props.history.goBack()
        } else {
            message.error(`${this.isUpdate ? '更新' : '添加'}商品失败`)
        }
    }
    componentDidMount() {
        //初始时获取一级分类列表
        this.getCategorys('0')
    }
    componentWillMount() {
        //取出携带的state，可能是点击修改跳转过来的也可能是添加跳转过来的
        const product = memoryUtils.product//如果是添加没值，否则有值
        //强制转换为布尔类型，保存是否是更新的标识
        this.isUpdate = !!product._id
        //保存商品（如果没有，保存的是{}）
        this.product = product || {}
    }
    //在卸载之前清除保存的数据
    componentWillUnmount() {
        memoryUtils.product = {}
    }
    render() {
        const { isUpdate, product } = this   //取出isUpdate确定是添加还是修改
        const { pCategoryId, categoryId, imgs, detail } = product
        //用来接收级联分类的Id的数组
        const categoryIds = []
        if (isUpdate) {
            // 
            if (pCategoryId === '0') {
                categoryIds.push(categoryId)
            } else {
                //商品是一个二级分类的商品，向数组中添加两个id
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }

        const formItemLayout =
        {
            labelCol: { span: 2 },//左侧的label的宽度，总共24格，用于form的大小设置
            wrapperCol: { span: 8 },
        }

        const title = (
            <span>
                <LinkButton onClick={() => { this.props.history.goBack() }} style={{ marginRight: 15, fontSize: 20 }}>
                    <ArrowLeftOutlined />

                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )

        return (
            <Card title={title}>
                <Form
                    {...formItemLayout}
                    // 用于确定大小样式，一行是24格
                    ref={this.formRef}
                    initialValues={{
                        required: true,
                        name: product.name,
                        price: product.price,
                        desc: product.desc,
                        //这些初始值从product中读取，有可能是点击修改传递过来的
                        categoryIds: categoryIds  //先向其中添值，在修改initOptions
                    }}
                    onFinish={this.submit}
                >
                    {/* Item中的label用于确定 */}
                    <Item label="商品名称" name='name'
                        rules={[{ required: true, message: '必须输入商品名称' }]}>
                        <Input placeholder='请输入商品名称' />
                    </Item>
                    <Item label="商品描述" name='desc'
                        rules={[{ required: true, message: '必须输入商品描述' }]}>
                        <TextArea rows={4} placeholder="请输入商品描述" autoSize={{ minRows: 2, maxRows: 6 }} />
                    </Item>
                    <Item label="商品价格" name='price'
                        rules={[
                            //由于商品价格较为复杂所以用自定义的验证判断
                            {
                                required: true,
                                validator: this.validatePrice
                            }
                        ]}>
                        <Input type='number' placeholder='请输入商品价格' addonAfter="元" />
                    </Item>
                    <Item label="商品分类" name='categoryIds'>
                        <Cascader
                            placeholder='请指定商品分类'
                            options={this.state.options}  //需要显示的列表数据数组
                            loadData={this.loadData}   //当选择某个列表项，加载下一级列表的监听回调

                        />
                    </Item>
                    <Item label="商品图片">
                        <PicturesWall ref={this.pw} imgs={imgs} />
                    </Item>
                    <Item label="商品详情" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                        <RichTextEditor ref={this.editor} detail={detail} />
                    </Item>
                    <Item >
                        <Button type='primary' htmlType="submit">提交</Button>
                    </Item>

                </Form>
            </Card>
        )
    }
}


/*

1.子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
2.父组件调用子组件的方法：在父组件中通过ref得到子组件标签对象（也就是组件对象），调用其方法
*/