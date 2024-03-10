import { IData, IProperty, IMethod } from './type';
import { COLOR_LIST } from '../../../../utils/util';

Component<IData, IProperty, IMethod>({
  properties: {
    colorName: String,
  },
  data: {
    colorList: [],
  },
  lifetimes: {
    attached() {
      this.init();
    },
  },
  methods: {
    init() {
      const colorKeys = Object.keys(COLOR_LIST);
      this.data.colorList = [];
      colorKeys.forEach((key) => {
        this.data.colorList.push({
          color: COLOR_LIST[key].showColor || COLOR_LIST[key].color,
          name: key,
        });
      });
      this.setData(
        {
          colorList: this.data.colorList,
        },
      );
    },
    onColorClick(res: WechatMiniprogram.BaseEvent<WechatMiniprogram.IAnyObject, { color: string }>) {
      const { color } = res.currentTarget.dataset;
      if (color !== this.data.colorName) {
        this.setData({
          colorName: color,
        });
      }
    },
  },
});
