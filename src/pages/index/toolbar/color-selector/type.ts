export interface ColorItem {
  name: string,
  color: string,
}

export interface IData {
  colorList: ColorItem[],
}

export interface IProperty {
  [key: string]: WechatMiniprogram.Component.AllProperty;
  colorName: StringConstructor,
}

export interface IMethod {
  [key: string]: (...args: any[]) => any;
  onColorClick: (res: WechatMiniprogram.BaseEvent<WechatMiniprogram.IAnyObject, { color: string }>) => void
}
