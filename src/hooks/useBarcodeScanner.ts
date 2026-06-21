import { useCallback, useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

export type ScannerStatus = 'idle' | 'starting' | 'scanning' | 'denied' | 'error';

interface UseBarcodeScannerOptions {
  onDetect: (barcode: string) => void;
}

/**
 * WebView/브라우저 카메라로 바코드를 실시간 인식하는 훅이에요.
 * 토스 앱의 WebView 안에서 카메라 권한을 받아 동작해요.
 * 같은 바코드가 연속으로 잡히는 것을 막기 위해 한 번 인식하면 멈춰요.
 */
export function useBarcodeScanner({ onDetect }: UseBarcodeScannerOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [status, setStatus] = useState<ScannerStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const stop = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setStatus('idle');
  }, []);

  const start = useCallback(async () => {
    if (!videoRef.current) return;
    setError(null);
    setStatus('starting');
    try {
      readerRef.current ??= new BrowserMultiFormatReader();
      const controls = await readerRef.current.decodeFromVideoDevice(
        undefined, // 기본(후면) 카메라
        videoRef.current,
        (result, _err, ctrl) => {
          if (result) {
            controlsRef.current = ctrl;
            ctrl.stop();
            controlsRef.current = null;
            setStatus('idle');
            onDetect(result.getText());
          }
        },
      );
      controlsRef.current = controls;
      setStatus('scanning');
    } catch (e) {
      const name = e instanceof Error ? e.name : '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setStatus('denied');
        setError('카메라 권한이 필요해요. 권한을 허용한 뒤 다시 시도해 주세요.');
      } else {
        setStatus('error');
        setError('카메라를 시작하지 못했어요. 바코드 번호를 직접 입력해 보세요.');
      }
    }
  }, [onDetect]);

  // 언마운트 시 카메라 정리
  useEffect(() => () => controlsRef.current?.stop(), []);

  return { videoRef, status, error, start, stop };
}
