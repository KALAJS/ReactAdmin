import React, { PureComponent } from 'react'
import { Form, Input, Tree } from 'antd'
import propTypes from 'prop-types'
import menuList from '../../components/config/menuConfig'

const Item = Form.Item

export default class AuthForm extends PureComponent {
    static propTypes = {
        role: propTypes.object

    }
    constructor(props) {
        super(props)
        const { menus } = this.props.role
        //根据传入角色的menu生成初始状态
        this.state = {
            checkedKeys: menus
        }
    }
    //为父组件提交获取最新menus数据的fang'fa
    getMenus = () => this.state.checkedKeys

    onCheck = (checkedKeys) => {
        this.setState({
            checkedKeys
        })
    }
    componentWillMount() {
        this.treeAll = [{
            title: '平台权限',
            key: 'all',
            children: menuList

        }]
    }
    //根据新传入的role来更新checkedKeys状态,
    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps()', nextProps)
        const menus = nextProps.role.menus
        this.setState({//因为componentWillReceiveProps是更新的过程，所以没有走两遍render
            checkedKeys: menus
        })
        // this.state.checkedKeys = menus只有再更新的过程中，这个才能用
    }
    render() {
        const { role } = this.props
        const { checkedKeys } = this.state
        const formItemLayout =
        {
            labelCol: { span: 4 },//左侧的label的宽度，总共24格，用于form的大小设置
            wrapperCol: { span: 15 },
        }

        return (

            <div
            >

                <Item label='角色名称'  {...formItemLayout}>
                    <Input value={role.name} disabled />
                </Item>

                <Tree
                    checkable
                    defaultExpandAll
                    // defaultCheckedKeys={role.menus}
                    checkedKeys={checkedKeys}
                    treeData={this.treeAll}
                    onCheck={this.onCheck}
                />
            </div>
        )
    }
}