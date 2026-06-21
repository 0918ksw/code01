import { theme } from '../ui/theme';

interface Props {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export function AppHeader({ title, onBack, right }: Props) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: theme.space(2),
        padding: `${theme.space(3)}px ${theme.space(4)}px`,
        background: theme.color.bg,
        borderBottom: `1px solid ${theme.color.border}`,
      }}
    >
      {onBack && (
        <button
          onClick={onBack}
          aria-label="뒤로"
          style={{ border: 'none', background: 'none', fontSize: 22, cursor: 'pointer', padding: 0, color: theme.color.text }}
        >
          ‹
        </button>
      )}
      <span style={{ fontSize: 17, fontWeight: 700, color: theme.color.text, flex: 1 }}>{title}</span>
      {right}
    </div>
  );
}
