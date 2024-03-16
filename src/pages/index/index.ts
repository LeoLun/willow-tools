/* eslint-disable no-console */
/* eslint-disable no-multi-assign */
/* eslint-disable no-plusplus */
import { COLOR_LIST, throttle } from '../../utils/util';

const baseImagePath = '../../assets/base.jpg';

let currentImagePath = '';
let CONTENT_WIDTH = 0;
let CONTENT_HEIGHT = 0;

const QUALITY = 80;

Page({
  data: {
    canvasWidth: '100%',
    canvasHeigth: '350px',
    canvasScale: 1,
    colorName: COLOR_LIST.red.name,
    opacityValue: 50,
    watermark: '仅用于XX使用',
    textSize: 1,
    columnInterval: 5,
    rowInterval: 5,
  },

  onLoad() {
    this.init();
  },

  async init() {
    currentImagePath = baseImagePath;
    const { width, height } = await this.getContentSizeById('content');
    CONTENT_WIDTH = width;
    CONTENT_HEIGHT = height;
    this.renderCanvas(currentImagePath);
    this.redraw = throttle(this.renderCanvas, 100);
  },

  redraw(path: string) {
    console.log('path', path);
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

  async onChangePath(res: WechatMiniprogram.CustomEvent<{ path: string }>) {
    wx.showLoading({
      title: '处理中',
    });
    currentImagePath = res.detail.path;
    await this.renderCanvas(currentImagePath);
    wx.hideLoading();
  },

  onChangeColor() {
    this.renderCanvas(currentImagePath);
  },

  onChangeOpacity() {
    this.redraw(currentImagePath);
  },

  onChangeWatermark() {
    this.redraw(currentImagePath);
  },

  onChangeTextSize() {
    this.redraw(currentImagePath);
  },

  onChangeColumnInterval() {
    this.redraw(currentImagePath);
  },

  onChangeRowInterval() {
    this.redraw(currentImagePath);
  },

  async computeCanvasSize(path: string): Promise<{ width: number; height: number; scale: number }> {
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
    // 设置 canvas 大小
    // return { width: width * scale, height: height * scale };
    return { width, height, scale };
  },

  async setCanvasSize(width: number, height: number, scale: number) {
    return new Promise<void>((resolve) => {
      this.setData({
        canvasWidth: `${width * scale}px`,
        canvasHeigth: `${height * scale}px`,
        canvasScale: scale,
      }, () => {
        resolve();
      });
    });
  },

  async renderCanvas(path: string): Promise<void> {
    const { width, height, scale } = await this.computeCanvasSize(path);
    await this.setCanvasSize(width, height, scale);

    return new Promise((resolve) => {
      const query = wx.createSelectorQuery();
      query.select('#myCanvas')
        .fields({ node: true, size: true })
        .exec((res: any) => {
          // Canvas 对象
          const canvas = res[0].node;
          // 渲染上下文
          const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
          // 初始化画布大小
          canvas.width = width;
          canvas.height = height;

          // 图片对象
          const image = canvas.createImage();
          // 图片加载完成回调
          image.onload = () => {
            // 将图片绘制到 canvas 上
            ctx.drawImage(image, 0, 0, width, height);
            this.addWatermark(ctx, canvas);
            resolve();
          };

          image.src = path;
        });
    });
  },

  addWatermark(ctx: any, canvas: any) {
    const textSize = this.data.textSize * Math.max(15, (Math.min(canvas.width, canvas.height)) / 25);
    ctx.rotate((45 * Math.PI) / 180);
    let color = COLOR_LIST.red.rgb;
    const colorItem = COLOR_LIST[this.data.colorName];
    if (colorItem) {
      color = colorItem.rgb;
    }
    ctx.fillStyle = `rgba(${color},${this.data.opacityValue / 100})`;
    ctx.font = `bold ${textSize}px -apple-system,"Helvetica Neue",Helvetica,Arial,"PingFang SC","Hiragino Sans GB","WenQuanYi Micro Hei",sans-serif`;
    const value = this.data.watermark;
    // 上下
    const space = this.data.columnInterval;
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
    // 左右
    const margin = (ctx.measureText('啊')).width * this.data.rowInterval;
    const x = Math.ceil(step / (width + margin));
    const y = Math.ceil((step / (space * textSize)) / 2);
    for (i = k = 0, ref = x; (ref >= 0 ? k <= ref : k >= ref); i = ref >= 0 ? ++k : --k) {
      for (j = l = ref1 = -y, ref2 = y; (ref1 <= ref2 ? l <= ref2 : l >= ref2); j = ref1 <= ref2 ? ++l : --l) {
        ctx.fillText(value, (width + margin) * i, space * textSize * j);
      }
    }
  },

  async onDownloadImage() {
    // 获取图片大小
    const res = await wx.getImageInfo({ src: currentImagePath });
    const { width, height } = res;
    wx.showLoading({
      title: '处理中',
    });

    wx.createSelectorQuery()
      .select('#myCanvas') // 在 WXML 中填入的 id
      .fields({ node: true, size: true })
      .exec(async (matches: any) => {
        try {
          const canvas = matches[0].node;

          const { tempFilePath } = await wx.canvasToTempFilePath({
            canvas,
            destHeight: height,
            destWidth: width,
            fileType: 'jpg',
          });

          const { tempFilePath: compressImagePath } = await wx.compressImage({
            src: tempFilePath, // 图片路径
            quality: QUALITY,
          });

          await wx.saveImageToPhotosAlbum({
            filePath: compressImagePath,
          });

          wx.hideLoading();
          wx.showToast({
            title: '图片已保存到相册',
            icon: 'success',
          });
        } catch {
          wx.hideLoading();
          wx.showToast({
            title: '保存失败',
            icon: 'error',
          });
        }
      });
  },
});
