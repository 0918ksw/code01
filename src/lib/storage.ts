import { Storage } from '@apps-in-toss/web-framework';

// 앱인토스 Storage 를 우선 쓰고, 토스 앱 밖(일반 브라우저 개발 환경)에서는
// localStorage 로 자연스럽게 대체돼요.

export async function getItem(key: string): Promise<string | null> {
  try {
    return await Storage.getItem(key);
  } catch {
    try {
      return globalThis.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  try {
    await Storage.setItem(key, value);
  } catch {
    try {
      globalThis.localStorage?.setItem(key, value);
    } catch {
      /* 저장 실패는 조용히 무시 (메모리 상태는 유지됨) */
    }
  }
}
