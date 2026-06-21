import type { CSSProperties, PropsWithChildren, ReactNode } from 'react';
import { theme } from './theme';

export function Card({ children, style }: PropsWithChildren<{ style?: CSSProperties }>) {
  return (
    <div
      style={{
        background: theme.color.bg,
        border: `1px solid ${theme.color.border}`,
        borderRadius: theme.radius.lg,
        padding: theme.space(4),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children, action }: PropsWithChildren<{ action?: ReactNode }>) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: `${theme.space(5)}px ${theme.space(1)}px ${theme.space(2)}px`,
      }}
    >
      <h2 style={{ fontSize: 17, fontWeight: 700, color: theme.color.text, margin: 0 }}>{children}</h2>
      {action}
    </div>
  );
}

interface PrimaryButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'solid' | 'weak';
  style?: CSSProperties;
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  variant = 'solid',
  style,
}: PropsWithChildren<PrimaryButtonProps>) {
  const solid = variant === 'solid';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: `${theme.space(4)}px`,
        borderRadius: theme.radius.md,
        border: 'none',
        fontSize: 16,
        fontWeight: 700,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        background: solid ? theme.color.primary : theme.color.surface,
        color: solid ? '#fff' : theme.color.text,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Pill({ children, color }: PropsWithChildren<{ color: string }>) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        color: '#fff',
        background: color,
      }}
    >
      {children}
    </span>
  );
}
