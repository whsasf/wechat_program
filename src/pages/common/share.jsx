import Taro from '@tarojs/taro'
import React, { Component}from 'react'
import { View, Text,Button,Image } from '@tarojs/components'
import './share.scss'

export default class Share extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentWillMount = async () => {
        Taro.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
          })
    }

    onShareTimeline() {
        let oo = {}
        this.props.type === 'v'?
            oo = {
                title: this.props.info.video_title,
                imageUrl: this.props.info.video_imageUrl
            } :
            oo = {
                title: this.props.info.title,
                imageUrl: this.props.info.cover
            }
        //console.log('oo',oo)
        return oo
    }

    onShareAppMessage(type) {
        //console.log(`/pages/video/components/VideoDetail?id=${this.state.info._id}`)
        let oo = {}
        type === 'v'?
            oo = {
                title: this.props.info.video_title,
                path: `/pages/video/components/VideoDetail?id=${this.props.info._id}`,
            } :
            oo = {
                title: this.props.info.title,
                path: `/pages/method/components/NewsDetail?id=${this.props.info._id}`,
            }
            //console.log('oo',type,oo)
        return oo
    };

    render() {
        return (
            <View className='sharex' style={{ position: 'fixed', bottom: '0px', width: '100%' }}>
                <Button className='p1'
                  size='default'
                  openType='share'
                  type='default'
                  plain='true'
                  onClick={() => {
                        this.onShareAppMessage(this.props.type)
                    }}
                >
                    <Image className='bg1'></Image>
                    <Text>分享给好友</Text>
                </Button>
                <Button className='p2'
                  size='default'
                  type='default'
                  plain='true'
                  onClick={() => {
                        Taro.navigateTo({ url: '/pages/appDownload/appd' });
                    }}
                >
                    <Image className='bg2'></Image>
                    <Text>App内打开</Text>
                </Button>
            </View>
        )
    }
}