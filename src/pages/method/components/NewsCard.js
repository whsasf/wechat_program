import Taro from '@tarojs/taro';
import React, { Component} from 'react'
import { View, Text, Image } from '@tarojs/components';
import './NewsCard.scss'

export default class NewsCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cover: ''
        }
    }
    render() {
        const defaultCover = 'https://dbb-web-static.oss-cn-shenzhen.aliyuncs.com/baidu/news/cover.png';
        const { data = { date: '' } } = this.props;
        const dataarr = (data.date || '').split('-').map(v => v.padStart(2, '0'));
        return (
            <View
              className='News-NewsCard flex-row'
              onClick={() => {
                    const xurl = `/pages/method/components/NewsDetail?id=${data._id}`
                    Taro.navigateTo({ url: xurl});
                }}
            >
                
                {data.cover ? (
                    <Image
                      className='cover'
                      src={this.state.cover || data.cover || defaultCover}
                      lazyLoad
                      mode='aspectFill'
                      onError={() => {
                            this.setState({
                                cover: defaultCover,
                            });
                        }}
                    />
                ) : null}
                <View className='flex-column-between flex1 card-right'>
                    <Text className='title'>{data.title}</Text>
                    <View className='user flex-row-start-center'>
                        <Text className='username'>{data.author || '上海店宝宝'}</Text>
                        <Text className='date'>
                            {dataarr.length === 3 ? `${dataarr[0]}年${dataarr[1]}月${dataarr[2]}日` : ''}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}
