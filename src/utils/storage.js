const STORAGE_KEYS = {
  USER: 'pirate_user',
  LEVEL: 'pirate_level',
  SCORE: 'pirate_score'
};

export const saveUser = (userData) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
};

export const getUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
};

export const saveProgress = (level, score) => {
  localStorage.setItem(STORAGE_KEYS.LEVEL, level);
  localStorage.setItem(STORAGE_KEYS.SCORE, score);
};

export const getProgress = () => {
  return {
    level: parseInt(localStorage.getItem(STORAGE_KEYS.LEVEL)) || 1,
    score: parseInt(localStorage.getItem(STORAGE_KEYS.SCORE)) || 0
  };
};

export const clearProgress = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.LEVEL);
  localStorage.removeItem(STORAGE_KEYS.SCORE);
};
