import Taro from '@tarojs/taro'
import {Base64} from 'js-base64'
import React, { Component}from 'react'
import { View, Text, ScrollView,Image,Video } from '@tarojs/components'
import { DATA_BASE_URL } from '../../../constants/urls'
import GLOBAL from '../../../service/global'
import VideoCard from './VideoCard'
import './VideoDetail.scss'
import Share from '../../common/share'

export default class VideoDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            recommandVideoList: [],
            scrollHeight: 0,
            info: {}
        }
    }

    componentWillMount = async () => {
        Taro.showShareMenu({
            withShareTicket: true
          })
    }

    componentDidMount = async () => {
        const height = await GLOBAL.calculateHeight({ hasTab: false })
        let info_t = Taro.getCurrentInstance().router.params.info
        if (info_t) { 
            info_t = JSON.parse(info_t.replace(/iFFgaQammO5Gclpw1111xxxxQEFT663fo4uKIT2T/g, '?').replace(/iFFgaQammO5Gclpw1111yyyyQEFT663fo4uKIT2T/g, '=').replace(/iFFgaQammO5Gclpw1111zzzzQEFT663fo4uKIT2T/g, '&'))
            //console.log(info_t)
            this.setState({
                scrollHeight: height,
                info: info_t
            }, async () => { 
                Taro.setNavigationBarTitle({
                    title: this.state.info.video_title
                });
                const temp2 = await this.fetchData2(this.state.info._id)
                    //console.log('temp2',temp2)
                    this.setState({
                        recommandVideoList: temp2
                    })
            })
        }
        // share 的情形
        const xid = Taro.getCurrentInstance().router.params.id
        if (xid) { 
            const info_tt = await this.fetchData(xid)
            this.setState({
                scrollHeight: height,
                info: info_tt[0]
            }, async () => { 
                const temp2 = await this.fetchData2(this.state.info._id)
                    this.setState({
                        recommandVideoList: temp2
                    });
                Taro.setNavigationBarTitle({
                    title: this.state.info.video_title
                });
            })
        }
        
       
    };

    onShareTimeline(){
        return{
            title: this.state.info.video_title,
            imageUrl: this.state.info.video_imageUrl
        }
    }

    onShareAppMessage() {
        //console.log(`/pages/video/components/VideoDetail?id=${this.state.info._id}`)
        return {
            title: this.state.info.video_title,
            path: `/pages/video/components/VideoDetail?id=${this.state.info._id}`,
        };
    };
    onerror = (err) => {
        console.log('onerror',err)
    };
    fetchData = async  (id) => {
        return  await Taro.request({
            url: `${DATA_BASE_URL}videos`,
            method: 'post',
            data: {
                'project': '微信小程序',
                'page': 1,
                'page_size': 10,
                'titleFilter': '',
                'idFilter': id,
                'fields': '_id,video_imageUrl,author_avatar,video_vid,author_name,duration,issueTime,video_title,video_tvId,video_source_url',
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
            url: `${DATA_BASE_URL}videoRelated`,
            method: 'post',
            data: {
                'project': '微信小程序',
                'video_id': id,
                'fields': '_id,video_imageUrl,author_avatar,video_vid,author_name,duration,issueTime,video_title,video_tvId,video_source_url',
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
        return (
            <View className={`Video-Detail ${this.props.className}`} >
                    <ScrollView style={{ height: this.state.scrollHeight + 'px' }} scrollY scrollWithAnimation>
                        {JSON.stringify(this.state.info) !== '{}'?(
                            <View className='flex-column videoall'>
                                <Video
                                  className='video'
                                  src={this.state.info.video_source_url}
                                  title={this.state.info.video_title}
                                  controls
                                  showMuteBtn
                                  autoplay
                                  objectFit='cover'
                                  direction='90'
                                  duration={this.state.info.duration ||0}
                                  poster={`https:${this.state.info.video_imageUrl}`}
                                  initialTime='0'
                                  id={this.state.info._id}
                                  loop={false}
                                  muted={false}
                                  onError={this.onerror}
                                >
                                </Video>
                            <View className='videoinfo'>
                                <View  className='authorinfo'>
                                    <Image  className='author_avatar' src={this.state.info.author_avatar}></Image>
                                    <Text  className='author_name' >{this.state.info.author_name}</Text>
                                </View>
                                <Text className='time'>{`时间: ${this.state.info.issueTime}`}</Text>
                            </View>
                            <View className='videoname'>
                                {this.state.info.video_title}
                            </View>
                            </View>
                        ) : null}
                        { this.state.recommandVideoList.length >0 ? (
                        <View className='recommend'>
                            <View className='recommend-text'>相关推荐</View>
                            {this.state.recommandVideoList.map(data => (
                                <VideoCard data={data} key={data._id} />
                            ))}
                        </View>) : null}
                </ScrollView>
                <Share info={this.state.info} type='v'></Share>
            </View>
        );
    }
}