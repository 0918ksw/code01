import { useEffect, useState } from 'react';
import { useBarcodeScanner } from '../hooks/useBarcodeScanner';
import { AppHeader } from '../components/AppHeader';
import { theme } from '../ui/theme';
import { PrimaryButton } from '../ui/primitives';

interface Props {
  onBack: () => void;
  onDetect: (barcode: string) => void;
}

export function ScanScreen({ onBack, onDetect }: Props) {
  const { videoRef, status, error, start } = useBarcodeScanner({ onDetect });
  const [manual, setManual] = useState('');

  useEffect(() => {
    void start();
    // start 는 useCallback 으로 안정적이라 마운트 시 1회만 실행돼요.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitManual = () => {
    const code = manual.replace(/\D/g, '');
    if (code.length >= 8) onDetect(code);
  };

  return (
    <div>
      <AppHeader title="바코드 스캔" onBack={onBack} />

      <div style={{ position: 'relative', background: '#000', aspectRatio: '3 / 4', overflow: 'hidden' }}>
        <video
          ref={videoRef}
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* 스캔 가이드 프레임 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: '78%',
              height: 140,
              border: '3px solid rgba(255,255,255,0.9)',
              borderRadius: 16,
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.35)',
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {status === 'scanning' && '바코드를 사각형 안에 맞춰주세요'}
          {status === 'starting' && '카메라를 준비하고 있어요…'}
          {(status === 'denied' || status === 'error') && (error ?? '카메라를 사용할 수 없어요')}
        </div>
      </div>

      <div style={{ padding: theme.space(5) }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: theme.color.text, marginBottom: theme.space(2) }}>
          바코드 번호로 찾기
        </div>
        <div style={{ display: 'flex', gap: theme.space(2) }}>
          <input
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            inputMode="numeric"
            placeholder="예: 8801056011234"
            onKeyDown={(e) => e.key === 'Enter' && submitManual()}
            style={{
              flex: 1,
              padding: theme.space(3.5),
              borderRadius: theme.radius.md,
              border: `1px solid ${theme.color.border}`,
              fontSize: 15,
              outline: 'none',
            }}
          />
          <div style={{ width: 96 }}>
            <PrimaryButton onClick={submitManual} disabled={manual.replace(/\D/g, '').length < 8}>
              찾기
            </PrimaryButton>
          </div>
        </div>
        {(status === 'denied' || status === 'error') && (
          <div style={{ marginTop: theme.space(3) }}>
            <PrimaryButton variant="weak" onClick={() => void start()}>
              카메라 다시 시도
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}
