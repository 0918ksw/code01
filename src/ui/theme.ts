// 화면 전반에서 쓰는 색/간격 토큰이에요. (TDS 색감과 어울리게 구성)
export const theme = {
  color: {
    bg: '#ffffff',
    surface: '#f6f7f9',
    border: '#e9ecef',
    text: '#191f28',
    subtext: '#6b7684',
    primary: '#3182f6',
    good: '#15a06e',
    caution: '#f59f00',
    warning: '#e03131',
    dark: '#191f28',
  },
  radius: { sm: 8, md: 12, lg: 16, xl: 20 },
  space: (n: number) => n * 4,
} as const;

export const gradeColor: Record<'A' | 'B' | 'C' | 'D', string> = {
  A: '#15a06e',
  B: '#3182f6',
  C: '#f59f00',
  D: '#e03131',
};

export const severityColor = {
  info: theme.color.subtext,
  caution: theme.color.caution,
  warning: theme.color.warning,
} as const;

export const toneColor = {
  good: theme.color.good,
  neutral: theme.color.subtext,
  bad: theme.color.warning,
} as const;
