import { useState } from 'react';
import { useUserProfile } from './hooks/useUserProfile';
import { HomeScreen } from './screens/HomeScreen';
import { ScanScreen } from './screens/ScanScreen';
import { ResultScreen } from './screens/ResultScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { theme } from './ui/theme';

type Route =
  | { name: 'home' }
  | { name: 'scan' }
  | { name: 'result'; barcode: string }
  | { name: 'profile' };

function App() {
  const { profile, toggleGoal } = useUserProfile();
  const [stack, setStack] = useState<Route[]>([{ name: 'home' }]);
  const route = stack[stack.length - 1];

  const push = (r: Route) => setStack((s) => [...s, r]);
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  const reset = (r: Route) => setStack([r]);

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '0 auto',
        minHeight: '100vh',
        background: theme.color.bg,
        color: theme.color.text,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Pretendard", "Malgun Gothic", sans-serif',
      }}
    >
      {route.name === 'home' && (
        <HomeScreen
          onScan={() => push({ name: 'scan' })}
          onOpenProduct={(barcode) => push({ name: 'result', barcode })}
          onOpenProfile={() => push({ name: 'profile' })}
        />
      )}

      {route.name === 'scan' && (
        <ScanScreen onBack={back} onDetect={(barcode) => reset({ name: 'result', barcode })} />
      )}

      {route.name === 'result' && (
        <ResultScreen
          barcode={route.barcode}
          profile={profile}
          onBack={back}
          onScanAgain={() => reset({ name: 'scan' })}
          onOpenProduct={(barcode) => push({ name: 'result', barcode })}
          onOpenProfile={() => push({ name: 'profile' })}
        />
      )}

      {route.name === 'profile' && (
        <ProfileScreen goals={profile.goals} onToggle={toggleGoal} onBack={back} />
      )}
    </div>
  );
}

export default App;
