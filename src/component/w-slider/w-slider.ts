// 获取设备的系统信息
const systemInfo = wx.getSystemInfoSync();

// 获取屏幕宽度（单位：px）
const { screenWidth } = systemInfo;

// 计算 1rpx 对应的 px 值
const rpxToPxRatio = screenWidth / 750;

let W_SLIDER_WIDTH = 0;
let W_ZERO_WIDTH = 0;
let W_ONE_PERCENT_WIDTH = 0;

Component({
  properties: {
    min: {
      type: Number,
      value: 0,
    },
    max: {
      type: Number,
      value: 100,
    },
    step: {
      type: Number,
      value: 1,
    },
    isShowValue: {
      type: Boolean,
      value: false,
    },
    sliderValue: {
      type: Number,
      value: 0,
    },
  },
  data: {
    startX: 0,
    endX: 0,
    startSliderValue: 0,
  },

  lifetimes: {
    attached() {
      const selector = this.createSelectorQuery();
      selector.select('#slider').boundingClientRect();
      selector.exec((res) => {
        if (res && res[0]) {
          // 获取节点宽度和高度
          const { width } = res[0];
          W_SLIDER_WIDTH = width;
          W_ZERO_WIDTH = this.rpxToPx(46);
          W_ONE_PERCENT_WIDTH = (W_SLIDER_WIDTH - W_ZERO_WIDTH) / ((this.data.max - this.data.min) / this.data.step);
        }
      });
    },
  },

  methods: {
    // 将 rpx 转换为 px
    rpxToPx(rpx: number) {
      return rpx * rpxToPxRatio;
    },

    onTouchStart(e: WechatMiniprogram.TouchEvent) {
      this.setData({
        startSliderValue: this.data.sliderValue,
        startX: e.touches[0].clientX,
      });
    },

    onTouchMove(e: WechatMiniprogram.TouchEvent) {
      const { startX } = this.data;
      // 计算运动距离
      const deltaX = e.touches[0].clientX - startX;
      // 计算移动百分比
      // 总移动距离 (deltaX / (长度- 0% 的长度) / 每次间隔) = 移动百分比
      const percent = parseInt(`${deltaX / W_ONE_PERCENT_WIDTH}`, 10);
      let value = percent * this.data.step + this.data.startSliderValue;
      if (value > this.data.max) {
        value = this.data.max;
      }

      if (value < this.data.min) {
        value = this.data.min;
      }
      this.setData({
        sliderValue: value,
        endX: e.touches[0].clientX,
      });
    },

    onTouchEnd() {
      const { endX } = this.data;
      this.setData({
        startX: endX,
      });
    },
  },
});
