import React, { Component } from 'react'
import {Base64} from 'js-base64'
import Taro from '@tarojs/taro'
import { View, Text,ScrollView} from '@tarojs/components'
import { DATA_BASE_URL } from '../../constants/urls'
import GLOBAL from '../../service/global'
import VideoCard from './components/VideoCard'
import './video.scss'
import Banner from '../common/banner'
import CaiEgg from '../common/cEgg'

export default class Project extends Component {

  constructor(props) {
    super(props)
    this.state = {
      scrollHeight : 1000,
      pageList: [],
      videoLists: [],
      isBottomList: [],
      types: ['白领', '学生', '宝妈', '待业者','程序员','赚钱思维','自媒体','农村','微商','淘宝客' ],
      activeTypeIndex: 0,
    }
  }

  componentWillMount () { }

  componentDidMount = async() => { 
    //const rate = await GLOBAL.rate();
    //const statusBarHeight = await GLOBAL.statusBarHeight();
    const height = await GLOBAL.calculateHeight({ hasTab: true })
    let videoLists = Array(this.state.types.length).fill([])
    let pageList = Array(this.state.types.length).fill(1)
    let isBottomList = Array(this.state.types.length).fill(false)

    this.setState({
      scrollHeight: height,
      videoLists: videoLists,
      pageList: pageList,
      isBottomList: isBottomList
    }, () => {
      // 加载前10个视频
      this.fetchTags()
    });

  }

  componentWillUnmount() { }
  
  loadMore = () => { 
    const { pageList } = this.state
    pageList[this.state.activeTypeIndex] = this.state.pageList[this.state.activeTypeIndex] + 1
    this.setState({
      pageList:  [...pageList]
    });
    if (!this.state.isBottomList[this.state.activeTypeIndex]) {
      this.fetchDataVideo(this.state.types[this.state.activeTypeIndex]);
    }
  }

  fetchTags = () => { 
    Taro.request({
      url: `${DATA_BASE_URL}tags`,
      method: 'post',
      data: {
        'project': '微信小程序',
        'isFilm': 1,
        'code': Base64.encode(`5fd03173824670c4b4315b62.${Date.parse(new Date()).toString()}`).split('').reverse().join('')
      },
    })
      .then(res => {
        //console.log('res',res)
        if (res.statusCode === 200) {
          let types = this.state.types
          if (res.data.data.length > 0) {
            types = res.data.data
          } 
          this.setState({
            types: types
          }, () => {
            this.fetchDataVideo(this.state.types[this.state.activeTypeIndex])
          })
        } else { 
          this.fetchDataVideo(this.state.types[this.state.activeTypeIndex])
        }
      })
      .catch(err => { 
        console.log(err)
        // 错误 就是用 默认tag列表
        this.fetchDataVideo(this.state.types[this.state.activeTypeIndex])
      })
  }

  fetchDataVideo = (type) => { 
    //console.log('video fecth')
    //Taro.showLoading({ title: '加载中' })
    //console.log('type,page',type,this.state.pageList,this.state.pageList[this.state.activeTypeIndex])
    if (this.state.pageList[this.state.activeTypeIndex] === 1) { 
      Taro.showLoading({ title: '加载中' })
    }
    Taro.request({
      url: `${DATA_BASE_URL}videos`,
      method: 'post',
      data: {
        'project': '微信小程序',
        'page': this.state.pageList[this.state.activeTypeIndex],
        'page_size': 10,
        'titleFilter': '',
        'idFilter': '',
        'tagFilter': type,
        'fields': '_id,video_imageUrl,author_avatar,author_name,duration,issueTime,video_title,video_source_url',
        'code': Base64.encode(`5fd03173824670c4b4315b62.${Date.parse(new Date()).toString()}`).split('').reverse().join('')
      },
    }).then(res => {
      Taro.hideLoading()
      //console.log('res2',res)
      if (res.statusCode === 200) {
        const videosNow = res.data.data

        if (videosNow && videosNow.length === 0) { 
          const { isBottomList } = this.state
          isBottomList[this.state.activeTypeIndex] = true
          this.setState({
            isBottomList: [...isBottomList]
          })
        }
        
        const { videoLists } = this.state
        videoLists[this.state.activeTypeIndex] = [...videoLists[this.state.activeTypeIndex], ...videosNow]
        this.setState({
          videoLists: [...videoLists]
        })
      }

    })
  }

  mySetState = (xdict) => {
    //console.log('xdict',xdict)
    this.setState(xdict, () => { 
      // 只有 第一次 切换才加载数据，否则，只能通过 loadmore 才行
      if (this.state.videoLists[this.state.activeTypeIndex].length === 0) { 
        this.fetchDataVideo(this.state.types[this.state.activeTypeIndex])
      }
    })
  }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='Videos'>
        <Banner type='p'  mySetState={this.mySetState} scrollHeight={this.state.scrollHeight} types={this.state.types} activeTypeIndex={this.state.activeTypeIndex} ></Banner>
        {this.state.videoLists.length > 0 ? (
          <ScrollView
            className='scrollview'
            scrollY
            style={{ height: this.state.scrollHeight + 'px' }}
            scrollWithAnimation
            lowerThreshold={this.state.lowerThreshold}
            onScrollToLower={this.loadMore}
          >
            {this.state.videoLists[this.state.activeTypeIndex].map(video =>
              <VideoCard data={video} type='p' key={video._id} />
            )
            }
            <CaiEgg></CaiEgg>
          </ScrollView>) : null}
      </View>
    )
  }
}
