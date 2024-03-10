// pages/index/topbar/topbar.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    async chooseImage() {
      try {
        const res = await wx.chooseMedia({
          count: 1, // 默认9张
          mediaType: ['image'], // 可以选择的媒体类型，这里只选择图片
          sourceType: ['album', 'camera'], // 可以选择图片来源，相册或相机
          sizeType: ['compressed'], // 可以选择图片大小，压缩图或者原图
        });

        this.triggerEvent('changepath', {
          path: res.tempFiles[0].tempFilePath,
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('err', err);
      }
    },
  },
});
