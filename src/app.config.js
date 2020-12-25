export default {
  pages: [
    'pages/method/method',
    'pages/method/components/NewsDetail',
    'pages/video/video',
    'pages/video/projector',
    'pages/video/components/VideoDetail',
    'pages/case/case',
    'pages/case/caseDetail/caseDetail',
    'pages/appDownload/appd',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '赚钱攻略',
    navigationBarTextStyle: 'black'
  },
  resizable: true,
  tabBar: {
    color: "#626567",
    selectedColor:"#2A8CE5",
    backgroundColor: "#FBFBFB",
    borderStyle: "black",
    list: [{
      pagePath: "pages/method/method",
      text: "赚钱资讯",
      iconPath: "./asset/images/news.png",
      selectedIconPath: "./asset/images/news2.png"
    },{
      pagePath: "pages/video/video",
      text: "赚钱视频",
      iconPath: "./asset/images/video.png",
      selectedIconPath: "./asset/images/video2.png"
      },{
        pagePath: "pages/video/projector",
        text: "放映厅",
        iconPath: "./asset/images/projector.png",
        selectedIconPath: "./asset/images/projector2.png"
      },
    {
      pagePath: "pages/case/case",
      text: "成功案例",
      iconPath: "./asset/images/trophy.png",
      selectedIconPath: "./asset/images/trophy2.png"
    }]
  }
}
