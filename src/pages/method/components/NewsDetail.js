import Taro from '@tarojs/taro'
import {Base64} from 'js-base64'
import React, { Component}from 'react'
import { View, Text, RichText, ScrollView } from '@tarojs/components'
import { DATA_BASE_URL } from '../../../constants/urls'
import GLOBAL from '../../../service/global'
import NewsCard from './NewsCard'
import './NewsDetail.scss'
import Share from '../../common/share'

export default class NewsDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            recommandArticleList: [],
            scrollHeight: 0,
            info: {}
        }
    }

    
    
    componentWillMount = async () => {
        Taro.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
          })
    }

    componentDidMount = async () => {
        const height = await GLOBAL.calculateHeight({ hasTab: false })
        const id_t = Taro.getCurrentInstance().router.params.id
        this.setState({
            scrollHeight: height
        }, async () => { 
            if (id_t) {
                const temp = await this.fetchData(id_t)
                //console.log('temp',temp)
                this.setState({
                    info: temp[0]
                }, async () => { 
                    Taro.setNavigationBarTitle({
                        title: `${this.state.info.title}`
                    });
                        const temp2 = await this.fetchData2(id_t)
                        //console.log('temp2',temp2)
                        this.setState({
                            recommandArticleList: temp2
                        })
                })
            }
        })
    };

    onShareTimeline(){
        return{
            title: this.state.info.title,
            imageUrl: this.state.info.cover
        }
    }

    onShareAppMessage ()  {
        //console.log('share')
        return {
            title: this.state.info.title,
            path: `/pages/method/components/NewsDetail?id=${this.state.info._id}`,
        };
    };

    fetchData = async  (id) => {
        return  await Taro.request({
            url: `${DATA_BASE_URL}articles`,
            method: 'post',
            data: {
                'project': '微信小程序',
                'page': 1,
                'page_size': 10,
                'titleFilter': '',
                'idFilter': id,
                'fields': '_id,title,date,content,cover',
                'code': Base64.encode(`5fd03173824670c4b4315b62.${Date.parse(new Date()).toString()}`).split('').reverse().join('')
              },
        }).then(res => {
          //console.log('res44',res)
            if (res.statusCode === 200) {
                return res.data.data
            } else { 
                return null
            }
        })
        .catch(err => { 
            console.log(err)
        })
    }

    fetchData2 = async  (id) => {
        return  await Taro.request({
            url: `${DATA_BASE_URL}articlRelated`,
            method: 'post',
            data: {
                'project': '微信小程序',
                'article_id': id,
                'fields': '_id,title,date,author,content,cover',
                'code': Base64.encode(`5fd03173824670c4b4315b62.${Date.parse(new Date()).toString()}`).split('').reverse().join('')
              },
        }).then(res => {
          //console.log('res44',res)
            if (res.statusCode === 200) {
                return res.data.data
            } else { 
                return null
            }
        })
        .catch(err => { 
            console.log(err)
        })
    }



    render() {
        // 获取文章详情
        //console.log('info',this.state.info)
        return (
            <View className={`News-Detail ${this.props.className}`} >
                    <ScrollView style={{ height: this.state.scrollHeight + 'px' }} scrollY scrollWithAnimation>
                        {JSON.stringify(this.state.info) !== '{}'?(
                            <View className='flex-column article'>
                                <View className='wrap'>
                                    <Text className='title'>{this.state.info.title}</Text>
                                    <Text className='time'>
                                        {this.state.info.date
                                            ? `时间: ${this.state.info.date
                                                .split('-')
                                                .map(v => v.padStart(2, '0'))
                                                .join('-')}`
                                            : ''}
                                    </Text>
                                </View>
                                <RichText
                                  className='txt'
                                  nodes={this.state.info.content
                                        .replace(/ /g, ' ')
                                        .replace(/<img(.+?)style.+?\/>/g, '<img' + '$1' + '/>')
                                        .replace(/<img/g, '<img width="100%"')
                                        .replace(
                                            /<blockquote/g,
                                            '<blockquote style="font-size:1.1rem;font-weight:600;color:#333333;line-height: 35px;text-align:center"'
                                        )
                                        .replace(
                                            /<p/g,
                                            '<p style="font-size:1.1rem;line-height: 35px;margin-top:5px;margin-bottom:10px;"'
                                        )
                                        .replace(/<h1/g, '<h1 style="line-height: 32px;"')
                                        .replace(/<h3/g, '<h3 style="font-size:1.2rem;line-height: 32px;"')
                                        .replace(/<h2/g, '<h2 style="margin: 10px 0;font-size:1rem;"')}
                                />
                            </View>
                        ) : null}
                        { this.state.recommandArticleList.length  >0 ? (
                        <View className='recommend'>
                            <View className='recommend-text'>相关推荐</View>
                            {this.state.recommandArticleList.map(info => (
                                <NewsCard data={info} key={info._id} />
                            ))}
                        </View>) : null}
                </ScrollView>
                <Share info={this.state.info} type='a'></Share>
            </View>
        );
    }
}