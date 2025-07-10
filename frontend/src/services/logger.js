export const logger = {
  info: (...args) => {
    console.info(...args);
  },

  warn: (...args) => {
    console.warn(...args);
  },

  error: (...args) => {
    console.error(...args);
  },

  debug: (...args) => {
    if (import.meta.env.MODE !== "production") {
      console.debug(...args);
    }
  },
};
