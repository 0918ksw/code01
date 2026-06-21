import { useCallback, useEffect, useState } from 'react';
import { getItem, setItem } from '../lib/storage';
import type { HealthGoal, UserProfile } from '../domain/types';

const STORAGE_KEY = 'foodcheck.profile.v1';
const DEFAULT_PROFILE: UserProfile = { goals: ['diet', 'blood_sugar'] };

/** 사용자 맞춤 프로필을 로컬에 저장/복원하는 훅이에요. */
export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    getItem(STORAGE_KEY).then((raw) => {
      if (!alive) return;
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as UserProfile;
          if (Array.isArray(parsed.goals)) setProfile(parsed);
        } catch {
          /* 손상된 값은 무시하고 기본값 사용 */
        }
      }
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const toggleGoal = useCallback((goal: HealthGoal) => {
    setProfile((prev) => {
      const has = prev.goals.includes(goal);
      const goals = has ? prev.goals.filter((g) => g !== goal) : [...prev.goals, goal];
      const next = { ...prev, goals };
      void setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { profile, toggleGoal, loaded };
}
