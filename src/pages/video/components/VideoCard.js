import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components';
import './VideoCard.scss'
import play from '../../../asset/images/play.png'

export default class VideoCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        const defaultCover = 'https://dbb-web-static.oss-cn-shenzhen.aliyuncs.com/baidu/news/cover.png';
        const { data = { issueTime: '' } } = this.props;
        //const dataarr = (data.issueTime || '').split('-').map(v => v.padStart(2, '0'));
        return (
            <View className='Video-Card'
                onClick={() => {
                const xurl = `/pages/video/components/VideoDetail?info=${JSON.stringify(data).replace(/\?/g,'iFFgaQammO5Gclpw1111xxxxQEFT663fo4uKIT2T').replace(/=/g,'iFFgaQammO5Gclpw1111yyyyQEFT663fo4uKIT2T').replace(/&/g,'iFFgaQammO5Gclpw1111zzzzQEFT663fo4uKIT2T')}`
                Taro.navigateTo({ url: xurl});
                }}
            >   
                <Text className='video-title'>{data.video_title}</Text>
                <View className='mainPart' style={{ 'backgroundImage': `url('https:${data.video_imageUrl?data.video_imageUrl:defaultCover}')`,'backgroundSize': 'cover' , backgroundRepeat: 'no-repeat'}}>
                    <Image className='playButton' src={play} mode='aspectFit'></Image>
                </View>
                <View className='videoinfo'>
                    <View  className='authorinfo'>
                        <Image className='author_avatar' src={data.author_avatar}></Image>
                        <Text  className='author_name' >{data.author_name}</Text>
                    </View>
                    <Text className='long'>{data.duration}</Text>
                    <Text className='time'>{`发布于: ${data.issueTime}`}</Text>
                </View>
        </View>
        )
    }
}
