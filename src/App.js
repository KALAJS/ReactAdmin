import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Login from './pages/login/login';
import Admin from './pages/admin/admin';

/*
应用的根组件
*/
export default class App extends Component {

  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path='/login' component={Login}></Route>
          {/* 下面是为了省掉一层路径，路由层层递进 */}
          <Route path='/' component={Admin}></Route>
        </Switch>

      </HashRouter>


    )
  }
}
