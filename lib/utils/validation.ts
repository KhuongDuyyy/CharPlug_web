export function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidVietnamesePhone(value: string) {
  const normalized = normalizePhone(value);
  return /^(84|0)(3|5|7|8|9)\d{8}$/.test(normalized);
}

export function isStrongPassword(value: string) {
  return (
    value.length >= 8 &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /\d/.test(value) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(value)
  );
}

export function getPasswordStrength(value: string) {
  if (!value) {
    return 0;
  }

  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[a-z]/.test(value)) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) score += 1;
  return score;
}
