/* eslint-disable import/prefer-default-export */
// 将 rpx 转换为 px
export function rpxToPx(rpx: number) {
  // 获取设备的系统信息
  const systemInfo = wx.getSystemInfoSync();
  // 获取屏幕宽度（单位：px）
  const { screenWidth } = systemInfo;
  // 计算 1rpx 对应的 px 值
  const rpxToPxRatio = screenWidth / 750;
  return rpx * rpxToPxRatio;
}
