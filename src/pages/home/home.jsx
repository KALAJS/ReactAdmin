import React, { Component } from 'react'
import {
    Card,
    Statistic,
    DatePicker,
    Timeline,

} from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import moment from 'moment'
import Line from './line'
import Bar from './bar'
import './home.less'
const dateFormat = 'YYYY/MM/DD'
const { RangePicker } = DatePicker
export default class Home extends Component {
    state = {
        isVisited: true,
        key: 'tab1'
    }
    handleChange = (isVisited) => {
        if (isVisited) {
            const key = 'tab1'
            this.setState({ isVisited, key })
        } else {
            const key = 'tab2'
            this.setState({ isVisited, key })
        }

    }

    componentWillMount() {


        this.contentList = {
            tab1: <Line />,
            tab2: <Bar />,
        };
    }
    render() {
        const { isVisited, key } = this.state

        return (
            <div className='home'>
                <Card className="home-card"
                    title="商品总量"
                    extra={<QuestionCircleOutlined />}
                    style={{ width: 250 }}
                    headStyle={{ color: 'rgba(0,0,0,.45)' }}>
                    <Statistic suffix="个" value={112893}
                        style={{ fontWeight: 'bolder' }} />
                    <Statistic

                        value={11.28}
                        precision={2}
                        valueStyle={{ fontSize: 15 }}
                        prefix={'周同比'}
                        suffix={<div>%< ArrowUpOutlined style={{ color: '#3f8600' }} /> </div>}

                    />
                    <Statistic

                        value={9.3}
                        precision={2}
                        valueStyle={{ fontSize: 15 }}
                        prefix={'日同比'}
                        suffix={<div>%<ArrowDownOutlined style={{ color: '#cf1322' }} /></div>}

                    />
                </Card>
                <Line />
                <Card
                    className="home-content"
                    title={<div className="home-menu">
                        <span className={isVisited ? "home-menu-active home-menu-visited" :
                            'home-menu-visited'}
                            onClick={() => this.handleChange(true)}>访问量</span>
                        <span className={isVisited ? "" : 'home-menu-active'}
                            onClick={() => this.handleChange(false)}>销售量</span>
                    </div>}
                    extra={<RangePicker
                        defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                        format={dateFormat}
                    />}
                >
                    <Card
                        className="home-table-left"
                        title={isVisited ? '访问量趋势' : '销售量趋势'}
                        extra={<ReloadOutlined />}
                        bodyStyle={{ padding: 0, height: 300 }}
                    >
                        {this.contentList[key]}
                    </Card>
                    <Card title='任务' extra={<ReloadOutlined />}
                        className="home-table-right">
                        <Timeline>
                            <Timeline.Item color="green">新版本迭代会</Timeline.Item>
                            <Timeline.Item color="green">完成网站设计初版</Timeline.Item>
                            <Timeline.Item color="red">
                                <p>联调接口</p>
                                <p>功能验收</p>
                            </Timeline.Item>
                            <Timeline.Item>
                                <p>登录功能设计</p>
                                <p>权限验证</p>
                                <p>页面排版</p>
                            </Timeline.Item>
                        </Timeline>
                    </Card>

                </Card>
            </div>
        )
    }
}