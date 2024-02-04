export const name = v => typeof v === "string" && v.length > 0 && v.length < 32;
export const phone = v => typeof v === "string" && /^\+?([0-9]+){6,15}$/s.test(v);
export const email = v => typeof v === "string" && /^([\w\._-]+){1,255}@([\w\._-]+){1,63}\.(\w+){1,63}$/s.test(v);
export const password = v => typeof v === "string" && /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{12,128}$/s.test(v);
