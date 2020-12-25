import React, { Component } from 'react'
import {Base64} from 'js-base64';
import Taro from '@tarojs/taro'
import { View, Text,ScrollView } from '@tarojs/components'
import { DATA_BASE_URL } from '../../constants/urls'
import NewsCard from './components/NewsCard'
import GLOBAL from '../../service/global'
import './method.scss'
import Banner from '../common/banner'
import CaiEgg from '../common/cEgg'

export default class Method extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scrollHeight : 1000,
      lowerThreshold: 200,
      types: ['白领', '学生', '宝妈', '待业者', '程序员', '赚钱思维', '自媒体', '农村', '微商', '淘宝客'],
      pageList: [],
      articleLists: [],
      isBottomList: [],
      activeTypeIndex: 0,
    }
  }

  componentWillMount() { }
  
  componentDidMount = async () => {
    //const rate = await GLOBAL.rate();
    //const statusBarHeight = await GLOBAL.statusBarHeight();
    //console.log('statusBarHeight',statusBarHeight)
    const height = await GLOBAL.calculateHeight({ hasTab: true })
    let articleLists = Array(this.state.types.length).fill([])
    let pageList = Array(this.state.types.length).fill(1)
    let isBottomList = Array(this.state.types.length).fill(false)

    this.setState({
      scrollHeight: height,
      articleLists: articleLists,
      pageList: pageList,
      isBottomList: isBottomList
      //rate: rate,
      //statusBarHeight: statusBarHeight
    }, () => {
      // 下载tag列表 并 加载第一个tag的前十篇文章
        this.fetchTags()
    });
   }

  componentWillUnmount() { }
  
  fetchTags = () => { 
    Taro.request({
      url: `${DATA_BASE_URL}tags`,
      method: 'post',
      data: {
        'project': '微信小程序',
        'code': Base64.encode(`5fd03173824670c4b4315b62.${Date.parse(new Date()).toString()}`).split('').reverse().join('')
      },
    })
      .then(res => {
        //Taro.showLoading({ title: '加载中' })
        if (res.statusCode === 200) {
          let types = this.state.types
          if (res.data.data.length > 0) {
            types = res.data.data
          } 
          this.setState({
            types: types
          }, () => {
            this.fetchDataArticle(this.state.types[this.state.activeTypeIndex])
          })
        } else { 
          this.fetchDataArticle(this.state.types[this.state.activeTypeIndex])
        }
      })
      .catch(err => { 
        console.log(err)
        // 错误 就是用 默认tag列表
        this.fetchDataArticle(this.state.types[this.state.activeTypeIndex])
      })
  }
  fetchDataArticle = (tag) => { 
    //console.log('article fecth')
    //Taro.showLoading({ title: '加载中' })
    //console.log('type,page',tag,this.state.pageList,this.state.pageList[this.state.activeTypeIndex])
    if (this.state.pageList[this.state.activeTypeIndex] === 1) { 
      Taro.showLoading({ title: '加载中' })
    }
    Taro.request({
      url: `${DATA_BASE_URL}articles`,
      method: 'post',
      data: {
        'project': '微信小程序',
        'page': this.state.pageList[this.state.activeTypeIndex],
        'page_size': 10,
        'titleFilter': '',
        'idFilter': '',
        'tagFilter': tag,
        'fields': '_id,title,date,author,cover',
        'code': Base64.encode(`5fd03173824670c4b4315b62.${Date.parse(new Date()).toString()}`).split('').reverse().join('')
      },
    }).then(res => {
      Taro.hideLoading()
      //console.log('res',res)
      if (res.statusCode === 200) {
        const articlesNow = res.data.data
        if (articlesNow && articlesNow.length === 0) { 
          const { isBottomList } = this.state
          isBottomList[this.state.activeTypeIndex] = true
          this.setState({
            isBottomList: [...isBottomList]
          })
        }
        const { articleLists } = this.state
        articleLists[this.state.activeTypeIndex] = [...articleLists[this.state.activeTypeIndex], ...articlesNow]
        this.setState({
          articleLists: [...articleLists]
        })
        //console.log('this.state.articleList',this.state.articleList)
      }

    })
  }

  loadMore = () => { 
    const { pageList } = this.state
    pageList[this.state.activeTypeIndex] = this.state.pageList[this.state.activeTypeIndex] + 1
    this.setState({
      pageList:  [...pageList]
    });
    if (!this.state.isBottomList[this.state.activeTypeIndex]) {
      this.fetchDataArticle(this.state.types[this.state.activeTypeIndex]);
    }
  }

  mySetState = (xdict) => {
    //console.log('xdict',xdict)
    this.setState(xdict, () => { 
      // 只有 第一次 切换才加载数据，否则，只能通过 loadmore 才行
      if (this.state.articleLists[this.state.activeTypeIndex].length === 0) { 
        this.fetchDataArticle(this.state.types[this.state.activeTypeIndex])
      }
    })
  }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='News'>
        <Banner type='a'  mySetState={this.mySetState} scrollHeight={this.state.scrollHeight} types={this.state.types} activeTypeIndex={this.state.activeTypeIndex} ></Banner>
        {this.state.articleLists.length > 0? (
        <ScrollView
          className='scrollview'
          scrollY
          style={{ height: this.state.scrollHeight + 'px' }}
          scrollWithAnimation
          lowerThreshold={this.state.isBottomList[this.state.activeTypeIndex]?0:this.state.lowerThreshold}
          onScrollToLower={this.loadMore}
        >
        {this.state.articleLists[this.state.activeTypeIndex].map(info => (
                <NewsCard data={info} key={info._id}  />
            ))}
          <CaiEgg></CaiEgg>
        </ScrollView>):null}
      </View>
    )
  }
}