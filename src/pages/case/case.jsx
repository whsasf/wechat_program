import Taro from '@tarojs/taro'
import {Base64} from 'js-base64';
import React,{ Component} from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import GLOBAL from '../../service/global'
import { DATA_BASE_URL } from '../../constants/urls'
import './case.scss'
import CaiEgg from '../common/cEgg'

export default class Case extends Component {

  constructor(props) {
    super(props)
    this.state = {
      scrollHeight: 1000,
      casesList: []
    }
  }

  componentWillMount () { }

  componentDidMount = async () => {
    Taro.showLoading({ title: '加载中' })
    const height = await GLOBAL.calculateHeight({ hasTab: true })
    Taro.request({
      url: `${DATA_BASE_URL}examples`,
      method: 'post',
      data: {
        'project': '微信小程序',
        'code': Base64.encode(`5fd03173824670c4b4315b62.${Date.parse(new Date()).toString()}`).split('').reverse().join('')
      },
    }).then(res => {
      Taro.hideLoading()
      //console.log('res',res)
      if (res.statusCode === 200) {
        this.setState({
          scrollHeight: height,
          casesList: res.data.examples
        })

        
      }

    })
};

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  // 案例点击
  onCaseClick = params => {
    if (params.id) {
      const xurl = `/pages/case/caseDetail/caseDetail?title=${params.title}&param=${JSON.stringify(params.coreData)}`
      //console.log('xurl',xurl)
      Taro.navigateTo({ url:xurl})
    } else {
      Taro.navigateTo({ url: 'pages/case/case' })
    }
  };
  
  render() {
    return (
      <View className='case'>
      <ScrollView  style={{ height: this.state.scrollHeight + 10 +  'px' }} scrollY>
        <View className='flex-column userlist'>
          {
            this.state.casesList.length >0 ? (
              this.state.casesList.map(user => (
                <View
                  key={user.id}
                  className='case-user'
                  onClick={() => {
                    this.onCaseClick({ 'id': user.id, 'title': user.title,'coreData': user.routeParams });
                  }}
                >
                  <View className='pandw'>
                    <Image className='avatar' src={user.tbpic} mode='widthFix' />
                  </View>
                  <View className='all'>
                      <Text className='username'>{user.title}</Text>
                      <View className='button'>
                        <Text className='text'>查看详情</Text>
                      </View>
                  </View>
                  <View className='sales'>
                    <Text className='salesp2'>{user.routeParams['销售额：'].split('元')[0]}</Text>
                    <Text className='salesp3'>元/月销售额</Text>
                  </View>
                </View>
              ))): null
          }
         
          </View>
          <CaiEgg></CaiEgg>
        </ScrollView>
      </View>
    )
  }
}
