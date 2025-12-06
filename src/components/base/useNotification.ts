import type { NotificationPlacement } from 'ant-design-vue';
import { notification } from 'ant-design-vue';
import { useAppStore } from '@/store';
// 创建通知实例
const [api, contextHolder] = notification.useNotification();

// 定义通知函数
export function openNotify(placement: NotificationPlacement, msg: any, success?: boolean) {
  const appStore = useAppStore(); // 获取 Pinia Store
  const t = appStore.t; // 从 Pinia Store 中获取 t 函数
  if (success) {
    api.success({
      message: t('notify.title.6byl3ok0hfk0'),
      description: `${msg}`,
      placement,
      class: 'notificationE-custom-class',
    });
  } else {
    api.error({
      message: t('notify.title.6byl3ok0qtc0'),
      description: `${msg}`,
      placement,
      class: 'notificationE-custom-class',
    });
  }
}

// 导出 contextHolder，以便在模板中使用
export { contextHolder };
