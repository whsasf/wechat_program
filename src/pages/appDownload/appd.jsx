import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View,Image,Button } from '@tarojs/components'
import GLOBAL from '../../service/global'
import './appd.scss'

export default class Appd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scrollHeight : 1000
    }
  }
  copyndRemind = () => { 
    Taro.setClipboardData({
      data: 'https://www.dianbaobao.com/download.html',
      success: function (res) {
        Taro.showToast({
          title: '链接复制成功',
          icon: 'success',
          duration: 1500
        })
      }
    })
  }


  componentDidMount= async ()=> { 
    //Taro.showLoading({ title: '加载中' })
    const height = await GLOBAL.calculateHeight({ hasTab: true })
    this.setState({
      scrollHeight: height
    });
  }

  handleMessage() { }
  
  render () {
    return (
      <View className='appd' style={{height: this.state.scrollHeight + 'px'}}>
        <View className='headpic'>
          <View className='hl'></View>
          <View className='hr'>成就新网商</View>
        </View>
        <View className='slogon'>
        <View className='h1'> 燃情十年整装再出发</View>
        <View className='p1'> 店宝宝隆重发布5大新版本</View>
        <View className='p1'> 更加精准匹配您的需求</View>
        </View>
        
        <View className='copy'>
         
          <Button className='btn' onclick={this.copyndRemind}>复制链接</Button>
          <View className='copyword'>复制链接在浏览器中打开</View>
          <View className='copyword'>或扫描下方二维码</View>
          <View className='copyword'>可直接下载店宝宝APP</View>
          <Image className='w2'></Image>
        </View>
      </View>
    )
  }
}