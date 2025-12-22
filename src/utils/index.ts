export * from './is';
export * from './naiveTools';

export function convertJSONStringToNumbers(obj: any): { data: any; errors: string[] } {
  // 深拷贝对象避免修改原对象
  const result = JSON.parse(JSON.stringify(obj));
  const errors: string[] = [];

  // 验证函数
  function validateField(key: string, value: any, path: string = ''): boolean {
    // 映射表
    const keyNames: Record<string, string> = {
      // 路径映射
      ocrPose: '证本姿态检测',
      ocrBlank: '空白本检测',
      ocrBeforeLaser: '激光前检测',
      ocrBeforeUv: '喷墨前检测',
      ocrFinished: '成品检测',
      // 字段映射
      usExposureTime: '曝光时间',
      x: 'X轴',
      y: 'Y轴',
      width: '宽',
      height: '高',
      l1Brightness: '光源1亮度',
      l2Brightness: '光源2亮度',
      uid: '设备UID',
      group: '组号',
      qualityControl: '质量控制',
      platform: '平台',
      l1ChannelNo: '光源1通道号',
      l2ChannelNo: '光源2通道号',
    };
    // 获取显示名称
    let displayPath = '';
    for (const [enPath, cnPath] of Object.entries(keyNames)) {
      if (path.includes(enPath)) {
        displayPath = cnPath;
        break;
      }
    }
    const displayKey = keyNames[key] || key;
    const fullPath = displayPath ? `${displayPath}.${displayKey}` : displayKey;
    // 验证逻辑（使用原始key进行判断）
    if (['x', 'y', 'width', 'height'].includes(key)) {
      const intValue = Number(value);
      if (Number.isNaN(intValue) || intValue < 0 || intValue > 30000 || value === '') {
        errors.push(`${fullPath}: 值 ${value} 超出范围 0-30000`);
        return false;
      }
      if (typeof value === 'string' && value.includes('.')) {
        errors.push(`${fullPath}: 不能存在小数位数`);
        return false;
      }
      return true;
    }
    if (key === 'usExposureTime' || key.includes('ExposureTime')) {
      const numValue = Number.parseFloat(value);
      if (Number.isNaN(numValue) || numValue < 62 || numValue > 9999764) {
        errors.push(`${fullPath}: 值 ${value} 超出范围 62-9999764`);
        return false;
      }
      if (typeof value === 'string' && value.includes('.')) {
        errors.push(`${fullPath}: 不能存在小数位数`);
        return false;
        /* const decimalPart = value.split('.')[1];
        if (decimalPart && decimalPart.length > 4) {
          errors.push(`${fullPath}: 小数位数不能超过4位`);
          return false;
        } */
      }
      return true;
    }
    if (key === 'l1Brightness' || key === 'l2Brightness') {
      const intValue = Number.parseInt(value, 10);
      if (Number.isNaN(intValue) || intValue < -1 || intValue > 255) {
        errors.push(`${fullPath}: 值 ${value} 超出范围 -1-255`);
        return false;
      }
      return true;
    }
    return true;
  }

  // 递归遍历并转换
  function traverse(node: any, path: string = '') {
    if (Array.isArray(node)) {
      node.forEach((item, index) => {
        const itemPath = path ? `${path}[${index}]` : `[${index}]`;
        if (typeof item === 'object' && item !== null) {
          traverse(item, itemPath);
        } else if (typeof item === 'string') {
          // 先验证
          validateField('', item, itemPath);
          // 尝试转换为数字
          if (/^-?\d+$/.test(item)) {
            node[index] = Number.parseInt(item, 10);
          } else if (/^-?\d+\.\d+$/.test(item)) {
            node[index] = Number.parseFloat(item);
          } else if (item === 'true' || item === 'false') {
            node[index] = item === 'true';
          }
        }
      });
    } else if (typeof node === 'object' && node !== null) {
      Object.keys(node).forEach((key) => {
        const value = node[key];
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof value === 'string') {
          // 先验证
          validateField(key, value, path);
          // 排除一些需要保持为字符串的字段
          const excludeKeys = ['uid', 'cid', 'name', 'deviceIndex', 'l1Port', 'l2Port', 'COM1', 'COM2'];
          const excludePatterns = [/^COM/, /^M\d/, /\.\d+\.\d+\.\d+/]; // IP地址模式
          const shouldExclude = excludeKeys.includes(key) || excludePatterns.some((pattern: any) => pattern.test(value));
          if (!shouldExclude) {
            if (/^-?\d+$/.test(value)) {
              // 整数
              node[key] = Number.parseInt(value, 10);
            } else if (/^-?\d+\.\d+$/.test(value)) {
              // 浮点数
              node[key] = Number.parseFloat(value);
            } else if (value === 'true' || value === 'false') {
              // 布尔值
              node[key] = value === 'true';
            }
          }
        } else if (typeof value === 'object' && value !== null) {
          traverse(value, currentPath);
        }
      });
    }
  }
  traverse(result);
  return { data: result, errors };
}

export function ensureInRange(value: any, max: any) {
  // 验证max
  const maxNum = Number(max);
  if (Number.isNaN(maxNum) || maxNum < 1 || !Number.isInteger(maxNum)) {
    return false;
  }
  // 验证value是否为数字（包括数字字符串）
  const num = Number(value);
  if (Number.isNaN(num)) {
    return false;
  }
  // 验证是否为整数
  if (!Number.isInteger(num)) {
    return false;
  }
  // 验证范围
  if (num < 1 || num > maxNum) {
    return false;
  }

  return true;
}
