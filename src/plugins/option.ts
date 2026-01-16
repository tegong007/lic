export interface OptionType {
  value: string | number | null;
  label: string;
}
// 团组类型
export const teamOptions: OptionType[] = [
  { value: 0, label: '否' },
  { value: 1, label: '是' },
];
// 派遣单位
export const dispatchUnitOptions: OptionType[] = [
  { value: 1, label: '中国电力公司' },
  { value: 2, label: '教育局' },
  { value: 3, label: '中国交通公司' },
];
// 数据来源
export const dataSourceOptions: OptionType[] = [
  { value: 1, label: '外交部' },
  { value: 2, label: '移民局' },
];
// 加急类型
export const urgencyOptions: OptionType[] = [
  { value: 0, label: '普通' },
  { value: 1, label: '加急' },
];
// 批次状态类型
export const TaskStatusOptions: OptionType[] = [
  { value: null, label: '全部' },
  { value: 0, label: '生产中' },
  // { value: 1, label: '暂停' },
  { value: 2, label: '待生产' },
  { value: 3, label: '挂起' },
  { value: 4, label: '生产成功' },
  { value: 5, label: '生产结束' },
];
// 证本状态
export const docStatusOptions: OptionType[] = [
  { value: -1, label: '全部' },
  { value: 0, label: '生产中' },
  { value: 1, label: '待生产' },
  { value: 2, label: '挂起' },
  { value: 3, label: '生产成功' },
  { value: 4, label: '生产失败' },
];
// 证本类型
export const docTypesOptions: OptionType[] = [
  { value: 'S', label: '公务护照' },
  { value: 'P', label: '普通护照' },
  { value: 'D', label: '外交护照' },
  { value: 'G', label: '因公普通护照' },
  { value: 'C', label: '领事护照' },
];
// 证件类型
export const idTypesOptions: OptionType[] = [
  { value: 0, label: '其他' },
  { value: 1, label: '身份证' },
  { value: 2, label: '军官证' },
];
// 加注类型
export const cnObsvTypeOptions: OptionType[] = [
  { value: 0, label: '对外身份' },
  { value: 1, label: '补发' },
  { value: 2, label: '换发' },
  { value: 3, label: '姓名' },
  { value: 4, label: '曾用名' },
  { value: 5, label: '任命' },
  { value: 6, label: '个案护照' },
  { value: 7, label: '曾持护照' },
];
// 生产模式
export const produceModeOptions: OptionType[] = [
  { value: '1', label: '多种护照类型' },
  { value: '2', label: '只打普通护照' },
  { value: '3', label: '只打公务护照' },
  { value: '4', label: '只打外交护照' },
  { value: '5', label: '只打因公普通护照' },
  { value: '6', label: '只打领事护照' },
];

// 一个函数，通过名称获取数组
export function getOptionsByName(name: any | keyof typeof Option): OptionType[] | undefined {
  const options: any = { produceModeOptions, dispatchUnitOptions, dataSourceOptions, urgencyOptions, teamOptions, TaskStatusOptions, docStatusOptions, docTypesOptions, idTypesOptions, cnObsvTypeOptions };
  return options[name];
}

// 实现一个方法，根据给定的 value 输出对应的 label
export function findLabelByValue(name: any, value: any): string | undefined {
  if (typeof value === 'object') {
    let temp = '';
    value.forEach((element: any, index: number) => {
      temp = temp + findLabelByValue(name, element);
      if (index < value.length - 1) temp = `${temp}+`;
    });
    return temp;
  } else {
    const optionsArray = getOptionsByName(name);
    if (!optionsArray) return undefined;
    const option = optionsArray.find((item: any) => item.value === value);
    return option ? option.label : undefined;
  }
}
