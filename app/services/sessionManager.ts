let sessionTimer: NodeJS.Timeout | null = null;

export function createSession(
  duration: number = 5 * 60 * 1000,
  callback: () => void
): void {
  clearSession();

  sessionTimer = setTimeout(() => {
    if (typeof callback === "function") {
      callback();
    }
  }, duration);
}

export function clearSession(): void {
  if (sessionTimer) {
    clearTimeout(sessionTimer);
    sessionTimer = null;
  }
}
