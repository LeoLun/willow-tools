// pages/index/toolbar/toolbar.ts
import {
  IData, IProperty, IMethod, ItemKey,
} from './type';

Component<IData, IProperty, IMethod>({
  properties: {
    colorName: String,
    opacityValue: Number,
    watermark: String,
    textSize: Number,
    columnInterval: Number,
    rowInterval: Number,
  },
  data: {
    itemList: [
      {
        name: '颜色',
        key: ItemKey.ColorKey,
      },
      {
        name: '透明度',
        key: ItemKey.OpacityKey,
      },
      {
        name: '间隔',
        key: ItemKey.IntervalKey,
      },
      {
        name: '大小',
        key: ItemKey.TextSizeKey,
      },
      {
        name: '文字',
        key: ItemKey.TextKey,
      },
    ],
    currentItem: ItemKey.ColorKey,
    currentColorName: '',
    currentOpacityValue: 0,
    currentWatermark: '',
    currentTextSize: 1,
    currentColumnInterval: 1,
    currentRowInterval: 1,
  },
  lifetimes: {
    attached() {
      this.setData({
        currentColorName: this.data.colorName,
        currentOpacityValue: this.data.opacityValue,
        currentWatermark: this.data.watermark,
        currentTextSize: this.data.textSize,
        currentColumnInterval: this.data.columnInterval,
        currentRowInterval: this.data.rowInterval,
      });
    },
  },
  observers: {
    currentColorName() {
      if (this.data.currentColorName !== this.data.colorName) {
        this.setData({
          colorName: this.data.currentColorName,
        }, () => {
          this.triggerEvent('changecolor', {
            colorName: this.data.currentColorName,
          });
        });
      }
    },

    currentOpacityValue() {
      if (this.data.currentOpacityValue !== this.data.opacityValue) {
        this.setData({
          opacityValue: this.data.currentOpacityValue,
        }, () => {
          this.triggerEvent('changeopacity', {
            opacity: this.data.currentOpacityValue,
          });
        });
      }
    },

    currentWatermark() {
      if (this.data.currentWatermark !== this.data.watermark) {
        this.setData({
          watermark: this.data.currentWatermark,
        }, () => {
          this.triggerEvent('changewatermark', {
            watermark: this.data.currentWatermark,
          });
        });
      }
    },

    currentTextSize() {
      if (this.data.currentTextSize !== this.data.textSize) {
        this.setData({
          textSize: this.data.currentTextSize,
        }, () => {
          this.triggerEvent('changetextsize', {
            textSize: this.data.currentTextSize,
          });
        });
      }
    },

    currentColumnInterval() {
      if (this.data.currentColumnInterval !== this.data.columnInterval) {
        this.setData({
          columnInterval: this.data.currentColumnInterval,
        }, () => {
          this.triggerEvent('changecolumninterval', {
            columnInterval: this.data.currentColumnInterval,
          });
        });
      }
    },

    currentRowInterval() {
      if (this.data.currentRowInterval !== this.data.rowInterval) {
        this.setData({
          rowInterval: this.data.currentRowInterval,
        }, () => {
          this.triggerEvent('changerowinterval', {
            rowInterval: this.data.currentRowInterval,
          });
        });
      }
    },
  },
  methods: {
    onItemClick(res: WechatMiniprogram.BaseEvent<WechatMiniprogram.IAnyObject, { key: ItemKey }>) {
      const clickItemKey = res.currentTarget.dataset.key;
      if (clickItemKey !== this.data.currentItem) {
        this.data.currentItem = clickItemKey;
      }
      this.setData({
        currentItem: this.data.currentItem,
      });
    },
  },
});
