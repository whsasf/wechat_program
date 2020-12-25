import React, { Component}from 'react'
import { View, Text,ScrollView } from '@tarojs/components'
import './banner.scss'

export default class Banner extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ArticleViewId: '',
            VideoViewId: '',
            pvViewId: '',
            expandNacShow: false,
            types: props.types,
            activeTypeIndex: props.activeTypeIndex,
            scrollHeight: props.scrollHeight
        }
    }

    componentDidMount() {
        //console.log(this.state.types,this.state.scrollHeight)
    }

    componentWillReceiveProps(nextProps) { 
        //console.log(nextProps)
        this.setState({
          activeTypeIndex: nextProps.activeTypeIndex,
          types: nextProps.types,
        })
    }
    render() {
        return (
                <View className='navBox' style={{ overflowX: 'auto', overflowY: 'hidden', position: 'sticky', top: '0px' }}>
                { this.state.expandNacShow? (
                <ScrollView
                  className='expandNav'
                  scrollY
                  style={{ height: this.state.scrollHeight + 10 + 'px' }}
                >
                  <View className='top'>
                    <Text class='Cross'
                      onClick={() => {
                        this.setState({
                          expandNacShow: false
                        })
                    }}
                    ></Text>
                    <Text class='Title'>选择标签</Text>
                  </View>
                  <View className='wrap'>
                  {
                    this.state.types.map((item,index) => (
                      <View className='navOne'
                        key={index}
                        onClick={() => {
                          this.setState({
                            expandNacShow: false,
                          }, () => {
                              if (index !== this.state.activeTypeIndex) {
                                this.setState({
                                    activeTypeIndex: index
                                }, () => {
                                        if (this.props.type === 'a') {
                                            this.setState({
                                                ArticleViewId: 'a' + index
                                            })
                                        } else if (this.props.type === 'v') { 
                                            this.setState({
                                                VideoViewId: 'v' + index
                                            })
                                        }  else if (this.props.type === 'p') { 
                                          this.setState({
                                              pvViewId: 'p' + index
                                          })
                                      }
                                        this.props.mySetState({activeTypeIndex: index}) 
                                        //this.props.fetchDataWithFlag(index);
                                })
                              }
                          })
                      }}
                      > 
                        <View className={`ttext ${index === this.state.activeTypeIndex ? 'special' : 'normal'}`}>{item}</View>
                      </View>
                  ))
                    }
                  </View>
                </ScrollView>): null
                    }
                    
                <ScrollView
                  scrollX
                  scrollWithAnimation
                  className='nav'
                  scrollIntoView={this.props.type === 'a'?this.state.ArticleViewId:this.props.type === 'v'?this.state.VideoViewId:this.state.pvViewId}
                >
                {this.state.types.map((item, index) => (
                    <View
                      key={item.name}
                      id={this.props.type === 'a'?'a'+index:this.props.type === 'v'?'v'+index:'p'+index}
                      className='item'
                      onClick={() => {
                          //console.log('activeTypeIndex,index',activeTypeIndex,index)
                          if (this.state.activeTypeIndex !== index) {
                              //this.scrollTop = 0;
                              this.setState({
                                activeTypeIndex: index
                              }, () => { 
                                if (this.props.type === 'a') {
                                    this.setState({
                                        ArticleViewId: 'a' + index
                                    })
                                } else if (this.props.type === 'v') { 
                                    this.setState({
                                        VideoViewId: 'v' + index
                                    })
                                  } 
                                  else if (this.props.type === 'p') { 
                                    this.setState({
                                      pvViewId: 'p' + index
                                    })
                                }
                                    this.props.mySetState({ activeTypeIndex: index});
                                    //this.props.fetchDataWithFlag(index);   
                              })
                            
                          }
                        }}
                    >
                        <View className='item-content'>
                            <View className={`item-text ${index === this.state.activeTypeIndex ? 'item-active' : ''}`}>
                                {item}
                            </View>
                        </View>
                    </View>
                ))}
                </ScrollView>
                <View className='nav-shadow-base'
                  onClick={() => {
                    this.setState({
                      expandNacShow: true
                    })
                  }}
                />
                <View className='nav-shadow'
                  onClick={() => {
                  this.setState({
                    expandNacShow: true
                  })
                }}
                />
            </View>
        )
    }
}