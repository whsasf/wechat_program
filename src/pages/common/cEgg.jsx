import React, { Component}from 'react'
import { View, Text } from '@tarojs/components'
import './cEgg.scss'

export default class CaiEgg extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <View className='egg'>
             <Text className='bottomInfo'>店宝宝-成就新网商</Text>
            </View>
        )
    }
}