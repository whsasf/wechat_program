import Taro from '@tarojs/taro';

// 获取状态栏高度
let info;
const getInfo = async () => {
    if (info !== undefined) return info;
    const ret = await Taro.getSystemInfo({});
    info = ret;
    //console.log('ret', ret);
    return ret;
};

const getSafeBottom = async () => {
    const safe = ((await getInfo()).safeArea || {}).bottom || 0;
    return safe ? info.screenHeight - safe : 0;
};

getSafeBottom();

export default {
    getInfo, // 状态栏高度
    getSafeBottom, // 获取安全距离
    calculateHeight: async ({ staticHeight = 0, hasTab = false }) => {
        //计算高度
        const { screenHeight, statusBarHeight } = await getInfo();
        const safeBottom = await getSafeBottom();
        const rate = screenHeight / 750;
        const xheight = screenHeight - safeBottom - statusBarHeight - rate * (staticHeight  + (hasTab ? 100 : 0))
        return xheight
    },
    rate: async () => {
        // 计算比率
        const { screenHeight } = await getInfo();
        return screenHeight / 750;
    },
    statusBarHeight: async () => {
        return (await getInfo()).statusBarHeight;
    },
};
