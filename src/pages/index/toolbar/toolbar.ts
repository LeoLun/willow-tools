// pages/index/toolbar/toolbar.ts
import {
  IData, IProperty, IMethod, ItemKey,
} from './type';

Component<IData, IProperty, IMethod>({
  properties: {
    colorName: String,
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
  },
  lifetimes: {
    attached() {
      this.setData({
        currentColorName: this.data.colorName,
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
