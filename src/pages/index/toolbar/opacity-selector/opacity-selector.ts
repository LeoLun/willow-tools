/* eslint-disable @typescript-eslint/no-unused-vars */
let SLIDER_WIDTH = 0;
Component({
  data: {
    startX: 0,
    endX: 0,
    startSliderValue: 0,
    sliderValue: 0,
  },

  lifetimes: {
    attached() {
      const selector = this.createSelectorQuery();
      selector.select('#slider').boundingClientRect();
      selector.exec((res) => {
        console.log('res', res);
        if (res && res[0]) {
          // 获取节点宽度和高度
          const { width } = res[0];
          SLIDER_WIDTH = width;
        }
      });
    },
  },

  methods: {
    onTouchStart(e: WechatMiniprogram.TouchEvent) {
      this.setData({
        startX: e.touches[0].clientX,
      });
    },

    onTouchMove(e: WechatMiniprogram.TouchEvent) {
      // const { startX } = this.data;
      // 计算运动距离
      // const deltaX = e.touches[0].clientX - startX;
      // 计算移动百分比

      this.setData({
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
