import { rpxToPx } from '../../utils/util';

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
    slider_width: 0,
    zero_width: 0,
    one_unit_width: 0,
  },

  lifetimes: {
    attached() {
      const selector = this.createSelectorQuery();
      selector.select('#slider').boundingClientRect();
      selector.exec((res) => {
        if (res && res[0]) {
          // 获取节点宽度和高度
          const { width } = res[0];
          this.data.slider_width = width;
          this.data.zero_width = rpxToPx(46);
          this.data.one_unit_width = (this.data.slider_width - this.data.zero_width) / ((this.data.max - this.data.min) / this.data.step);
        }
      });
    },
  },

  methods: {
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
      const percent = parseInt(`${deltaX / this.data.one_unit_width}`, 10);
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
