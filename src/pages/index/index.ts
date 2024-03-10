/* eslint-disable no-console */
/* eslint-disable no-multi-assign */
/* eslint-disable no-plusplus */
import { COLOR_LIST } from '../../utils/util';

const baseImagePath = '../../assets/base.jpg';

let currentImagePath = '';
let CONTENT_WIDTH = 0;
let CONTENT_HEIGHT = 0;

Page({
  data: {
    canvasWidth: '100%',
    canvasHeigth: '350px',
    colorName: COLOR_LIST.red.name,
    opacity: 0.5,
    watermark: '仅租房使用',
  },

  onLoad() {
    this.init();
  },

  async init() {
    currentImagePath = baseImagePath;
    const { width, height } = await this.getContentSizeById('content');
    console.log('');
    CONTENT_WIDTH = width;
    CONTENT_HEIGHT = height;
    this.addMark(currentImagePath);
  },

  async getContentSizeById(id: string): Promise<{ width: number, height: number }> {
    return new Promise((resolve) => {
      // 获取节点大小
      const selector = this.createSelectorQuery();
      selector.select(`#${id}`).boundingClientRect();
      selector.exec((res) => {
        // 获取节点宽度和高度
        resolve({
          width: res[0].width,
          height: res[0].height,
        });
      });
    });
  },

  onChangePath(res: WechatMiniprogram.CustomEvent<{ path: string }>) {
    currentImagePath = res.detail.path;
    this.addMark(currentImagePath);
  },

  onChangeColor(res: WechatMiniprogram.CustomEvent<{ colorName: string }>) {
    console.log(res.detail.colorName);
    this.addMark(currentImagePath);
  },

  async computeCanvasSize(path: string): Promise<{ width: number; height: number; }> {
    // 获取图片大小
    const res = await wx.getImageInfo({ src: path });
    const { width, height } = res;
    // 计算缩放比例
    let widthScale = 1;
    let heightScale = 1;
    // 若宽度大于展示区宽度，则计算宽度缩放比
    if (width > CONTENT_WIDTH) {
      widthScale = CONTENT_WIDTH / width;
    }
    // 若高度大于展示区高度，则计算高度缩放比
    if (height > CONTENT_HEIGHT) {
      heightScale = CONTENT_HEIGHT / width;
    }
    // 采用最高缩放比
    const scale = Math.min(widthScale, heightScale);
    console.log('scale', width * scale, height * scale);

    // 设置 canvas 大小
    return { width: width * scale, height: height * scale };
  },

  async setCanvasSize(width: number, height: number) {
    return new Promise<void>((resolve) => {
      this.setData({
        canvasWidth: `${width}px`,
        canvasHeigth: `${height}px`,
      }, () => {
        resolve();
      });
    });
  },

  async addMark(path: string) {
    const { width, height } = await this.computeCanvasSize(path);
    await this.setCanvasSize(width, height);
    const query = wx.createSelectorQuery();
    query.select('#myCanvas')
      .fields({ node: true, size: true })
      .exec((res: any) => {
        // Canvas 对象
        const canvas = res[0].node;

        console.log('canvas', canvas);
        // 渲染上下文
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        // 初始化画布大小
        const dpr = wx.getWindowInfo().pixelRatio;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        // 图片对象
        const image = canvas.createImage();
        // 图片加载完成回调
        image.onload = () => {
          // 将图片绘制到 canvas 上
          ctx.drawImage(image, 0, 0, width, height);
          console.log('ctx', ctx);
          this.add(ctx, canvas);
        };

        image.src = path;
      });
  },

  add(ctx: any, canvas: any) {
    const textSize = 20;
    ctx.rotate((45 * Math.PI) / 180);
    let color = COLOR_LIST.red.rgb;
    const colorItem = COLOR_LIST[this.data.colorName];
    if (colorItem) {
      color = colorItem.rgb;
    }
    ctx.fillStyle = `rgba(${color},${this.data.opacity})`;
    ctx.font = `bold ${textSize}px -apple-system,"Helvetica Neue",Helvetica,Arial,"PingFang SC","Hiragino Sans GB","WenQuanYi Micro Hei",sans-serif`;
    const value = this.data.watermark;
    const space = 1;
    // 添加水印
    let i;
    let j;
    let k;
    let l;
    let ref;
    let ref1;
    let ref2;
    const { width } = ctx.measureText(value);
    const step = Math.sqrt((canvas.width ** 2) + (canvas.height ** 2));
    const margin = (ctx.measureText('啊')).width;
    const x = Math.ceil(step / (width + margin));
    const y = Math.ceil((step / (space * textSize)) / 2);
    for (i = k = 0, ref = x; (ref >= 0 ? k <= ref : k >= ref); i = ref >= 0 ? ++k : --k) {
      for (j = l = ref1 = -y, ref2 = y; (ref1 <= ref2 ? l <= ref2 : l >= ref2); j = ref1 <= ref2 ? ++l : --l) {
        ctx.fillText(value, (width + margin) * i, space * textSize * j);
      }
    }
  },
});
