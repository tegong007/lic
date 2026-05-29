// timerUtils.ts
import { onUnmounted, ref } from 'vue';

type TimerCallback = (...args: any[]) => Promise<void> | void;

function useCustomTimer(): {
  start: (callback: TimerCallback, interval: number) => void;
  stop: () => void;
} {
  const timerRef = ref<number | null>(null);
  const isRunning = ref(false);
  let startId = 0;

  const stopTimer = () => {
    if (timerRef.value !== null) {
      window.clearTimeout(timerRef.value);
      timerRef.value = null;
      isRunning.value = false;
    }
  };

  const startTimer = (callback: TimerCallback, interval: number) => {
    if (typeof callback !== 'function') {
      console.error('The callback must be a function.');
      return;
    }
    if (interval <= 0) {
      console.error('Interval must be greater than 0.');
      return;
    }

    if (timerRef.value !== null) {
      stopTimer(); // 清除之前的定时器
    }

    const thisStartId = ++startId;
    isRunning.value = true;

    const run = async () => {
      // 如果中途调用了新的 start()，当前 run 的 ID 已过期，直接退出
      if (thisStartId !== startId) return;
      if (!isRunning.value) return;
      try {
        await callback(); // 等回调完成
      } catch (error) {
        console.error('Timer callback error:', error);
      }
      // 等回调完成后再次检查 ID —— stop() + 新的 start() 可能已发生
      if (thisStartId !== startId) return;
      if (isRunning.value) {
        timerRef.value = window.setTimeout(run, interval * 1000);
      }
    };

    timerRef.value = window.setTimeout(run, interval * 1000);
  };

  // 组件卸载时清除定时器
  onUnmounted(stopTimer);

  return { start: startTimer, stop: stopTimer };
}

export default useCustomTimer;
