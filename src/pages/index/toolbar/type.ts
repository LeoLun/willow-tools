export enum ItemKey {
  ColorKey = 0,
  OpacityKey = 1,
  IntervalKey = 2,
  TextSizeKey = 3,
  TextKey = 4,
}

export interface Item {
  name: string,
  key: ItemKey,
}

export interface IData {
  itemList: Item[],
  currentItem: ItemKey,
  currentColorName: string
}

export interface IProperty {
  [key: string]: WechatMiniprogram.Component.AllProperty;
  colorName: StringConstructor
}

export interface IMethod {
  [key: string]: (...args: any[]) => any;
  onItemClick: (res: WechatMiniprogram.BaseEvent<WechatMiniprogram.IAnyObject, { key: ItemKey }>) => void
}
