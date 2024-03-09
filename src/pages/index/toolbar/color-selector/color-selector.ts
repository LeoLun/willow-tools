import { IData, IProperty, IMethod } from './type';

Component<IData, IProperty, IMethod>({
  properties: {
    colorName: String,
  },
  data: {
    colorList: [
      {
        name: 'white',
        color: '#FFFFFF',
      },
      {
        name: 'black',
        color: '#424242',
      },
      {
        name: 'blue',
        color: '#0052D9',
      },
      {
        name: 'red',
        color: '#D54941',
      },
      {
        name: 'orange',
        color: '#E37318',
      },
      {
        name: 'green',
        color: '#2BA471',
      },
    ],
  },
  methods: {
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
