import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro'
import React, { Component} from 'react'
import GLOBAL from '../../../service/global'
import './caseDetail.scss'

export default class CaseDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            coreData: null,
            scrollHeight: null
        }
    }
    componentWillMount() { 
        const title = Taro.getCurrentInstance().router.params.title
        const coreData_t = Taro.getCurrentInstance().router.params.param
        if (coreData_t) {
            this.setState({
                coreData:  JSON.parse(coreData_t)
            }, () => {
                Taro.setNavigationBarTitle({
                    title: `案例: ${title}`
                });
             })
        }
        //console.log('coreData_t',coreData_t)
    }
    componentDidMount = async () => {
        const height = await GLOBAL.calculateHeight({ hasTab: true })
        //console.log('height',height)
        this.setState({
            scrollHeight: height
          })
    }
    
    render() {
        const d_length = Object.keys(this.state.coreData).length
        const scrollHeight = this.state.scrollHeight
        return (
            <View className='container' style={{ height: scrollHeight + 'px' }}>
                <View className='box'>
                    {Object.keys(this.state.coreData).map((item, key) => (
                        <View
                          className={`flex-row-start-center item ${
                                d_length - 1 === key ? 'item-no-border' : ''
                            }`}
                          key={item}
                        >
                            <Text className='item-title'>{item}</Text>
                            <Text className='subtitle'>{this.state.coreData[item]}</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    }
}
