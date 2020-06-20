import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'

import './product.less'  //在父组件中引入的样式子组件也能看得到

export default class Product extends Component {
    render() {
        return (

            <Switch>
                {/* /admin到从外层/product匹配到ProductHome，
                在它内部匹配不到下面的addupdate,detail，/product/addupdate是无法层层匹配得到的
                应该用精准匹配，不能用逐层匹配 */}
                {/* 在文档react-router中的exact */}
                <Route path='/product' component={ProductHome} exact></Route>   {/*路径完全匹配*/}
                <Route path='/product/addupdate' component={ProductAddUpdate}></Route>
                <Route path='/product/detail' component={ProductDetail}></Route>
                {/* 如果没有匹配到对应的路由转到 /product */}
                <Redirect to='/product' />
            </Switch>

        )
    }
}
