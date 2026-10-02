import { useEffect, useRef, useState, useCallback } from 'react';

interface AntiMalpracticeConfig {
  enabled: boolean;
  perQuestionTime: number; // seconds per question
  lockFullscreen: boolean;
}

interface MalpracticeEvent {
  type: string;
  timestamp: number;
  questionIndex: number;
}

interface AntiMalpracticeResult {
  violations: number;
  events: MalpracticeEvent[];
  warning: string | null;
  isLocked: boolean;
  perQuestionTimeLeft: number;
  resetPerQuestionTimer: () => void;
  reportViolation: (type: string) => void;
}

export function useAntiMalpractice(config: AntiMalpracticeConfig): AntiMalpracticeResult {
  const [violations, setViolations] = useState(0);
  const [events, setEvents] = useState<MalpracticeEvent[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [perQuestionTimeLeft, setPerQuestionTimeLeft] = useState(config.perQuestionTime);
  const currentQuestionRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reportViolation = useCallback((type: string) => {
    if (!config.enabled) return;
    setViolations(v => v + 1);
    setEvents(e => [...e, { type, timestamp: Date.now(), questionIndex: currentQuestionRef.current }]);
    setWarning(type);
    setTimeout(() => setWarning(null), 4000);
    if (violations + 1 >= 3) {
      setIsLocked(true);
    }
  }, [config.enabled, violations]);

  const resetPerQuestionTimer = useCallback(() => {
    setPerQuestionTimeLeft(config.perQuestionTime);
  }, [config.perQuestionTime]);

  // Per-question countdown
  useEffect(() => {
    if (!config.enabled) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setPerQuestionTimeLeft(t => {
        if (t <= 1) return 0;
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [config.enabled]);

  // Tab visibility / window blur detection
  useEffect(() => {
    if (!config.enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        reportViolation('You switched away from the quiz tab. This is not allowed.');
      }
    };

    const handleBlur = () => {
      reportViolation('The quiz window lost focus. Stay on the quiz page.');
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      reportViolation('Right-click is disabled during the quiz.');
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      reportViolation('Copying is disabled during the quiz.');
    };

    const handleKeydown = (e: KeyboardEvent) => {
      // Block common cheat shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'a' || e.key === 's' || e.key === 'u')) {
        e.preventDefault();
        reportViolation('Keyboard shortcuts are disabled during the quiz.');
      }
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) {
        e.preventDefault();
        reportViolation('Developer tools are disabled during the quiz.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [config.enabled, reportViolation]);

  return {
    violations,
    events,
    warning,
    isLocked,
    perQuestionTimeLeft,
    resetPerQuestionTimer,
    reportViolation,
  };
}

// Helper to determine if a class needs enhanced anti-malpractice
export function isJuniorClass(classLevel: string): boolean {
  return classLevel === 'Primary 1' || classLevel === 'Primary 2' || classLevel === 'Primary 3';
}

// Per-question time limits by class (in seconds)
export function getPerQuestionTime(classLevel: string, quizType: string): number {
  if (quizType === 'mental_math') {
    return isJuniorClass(classLevel) ? 120 : 180;
  }
  // Curriculum quiz - junior classes get less time per question
  if (isJuniorClass(classLevel)) {
    return 60; // 60 seconds per question for P1-P3
  }
  return 90; // 90 seconds per question for P4-P6 (no per-question enforcement, just overall timer)
}

// Total quiz time in seconds
export function getTotalQuizTime(classLevel: string, quizType: string): number {
  if (quizType === 'mental_math') {
    return isJuniorClass(classLevel) ? 3600 : 7200; // 1 hour for juniors, 2 hours for seniors
  }
  return isJuniorClass(classLevel) ? 2400 : 3600; // 40 min for juniors, 60 min for seniors
}
