/* eslint-disable import/prefer-default-export */
interface IColorList {
  [key: string]: {
    name: string,
    color: string,
    rgb: string,
    showColor?: string
  }
}

// 颜色列表，需要添加颜色直接在该对象中添加对应颜色
export const COLOR_LIST: IColorList = {
  white: {
    name: 'white',
    color: '#FFFFFF',
    rgb: '255,255,255',
  },
  black: {
    name: 'black',
    color: '#000000',
    rgb: '0,0,0',
    showColor: '#424242', // 由于黑色背景显示不清晰，所以黑色特别显示另外一个颜色
  },
  blue: {
    name: 'blue',
    color: '#0052D9',
    rgb: '0,82,217',
  },
  red: {
    name: 'red',
    color: '#D54941',
    rgb: '213,73,65',
  },
  orange: {
    name: 'orange',
    color: '#E37318',
    rgb: '227,115,24',
  },
  green: {
    name: 'green',
    color: '#2BA471',
    rgb: '43,164,113',
  },
};

export function debounce<T extends (
  ...args: any[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function throttle<T extends (
  ...args: any[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const remainingTime = wait - (now - lastCallTime);
    if (remainingTime <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      func(...args);
      lastCallTime = now;
    } else if (!timeout) {
      timeout = setTimeout(() => {
        func(...args);
        lastCallTime = Date.now();
        timeout = null;
      }, remainingTime);
    }
  };
}
