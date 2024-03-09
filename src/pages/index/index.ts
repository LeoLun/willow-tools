/* eslint-disable no-console */
/* eslint-disable no-multi-assign */
/* eslint-disable no-plusplus */
const baseImagePath = '../../assets/base.jpg';

let currentImagePath = '';

Page({
  data: {
    colorName: 'white',
    opacity: 1,
  },

  onLoad() {
    currentImagePath = baseImagePath;
    this.addMark(currentImagePath);
  },

  onChangePath(res: WechatMiniprogram.CustomEvent<{ path: string }>) {
    currentImagePath = res.detail.path;
    this.addMark(currentImagePath);
  },

  onChangeColor(res: WechatMiniprogram.CustomEvent<{ colorName: string }>) {
    console.log(res.detail.colorName);
    this.addMark(currentImagePath);
  },

  async setSize(path: string): Promise<{ width: number; height: number; }> {
    console.log('path', path);
    // 获取图片大小
    const res = await wx.getImageInfo({ src: path });
    const { width, height } = res;
    console.log('width', width);
    console.log('height', height);
    // 计算缩放比例
    // 若宽度大于展示区宽度，则计算宽度缩放比

    // 若高度大于展示区高度，则计算高度缩放比

    // 采用最高缩放比

    // 设置 canvas 大小
    return { width, height };
  },

  async addMark(path: string) {
    await this.setSize(path);
    const query = wx.createSelectorQuery();
    query.select('#myCanvas')
      .fields({ node: true, size: true })
      .exec((res: any) => {
        // Canvas 对象
        const canvas = res[0].node;

        console.log('canvas', canvas);
        // 渲染上下文
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        // Canvas 画布的实际绘制宽高
        const { width } = res[0];
        const { height } = res[0];

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
          ctx.drawImage(image, 0, 0, width, image.height * (width / 1184));
          console.log('ctx', ctx);
          this.add(ctx, canvas);
        };

        image.src = path;
      });
  },

  add(ctx: any, canvas: any) {
    const textSize = 20;
    ctx.rotate((45 * Math.PI) / 180);
    let color = '255,255,255';
    if (this.data.colorName === 'white') {
      color = '255,255,255';
    }
    if (this.data.colorName === 'black') {
      color = '0,0,0';
    }
    if (this.data.colorName === 'blue') {
      color = '0,82,217';
    }
    if (this.data.colorName === 'red') {
      color = '213,73,65';
    }
    if (this.data.colorName === 'orange') {
      color = '227,115,24';
    }
    if (this.data.colorName === 'green') {
      color = '43,164,113';
    }
    ctx.fillStyle = `rgba(${color},${this.data.opacity})`;
    ctx.font = `bold ${textSize}px -apple-system,"Helvetica Neue",Helvetica,Arial,"PingFang SC","Hiragino Sans GB","WenQuanYi Micro Hei",sans-serif`;
    const value = '水印';
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
