// libs/shared-logger/src/index.ts

/**
 * Total Pino bypass: Stubbing out pino with console logging 
 * to troubleshoot configuration and compilation conflicts.
 */
export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => {
    if (meta) console.log(msg, JSON.stringify(meta)); else console.log(msg);
  },

  warn: (msg: string, meta?: Record<string, unknown>) => {
    if (meta) console.warn(msg, JSON.stringify(meta)); else console.warn(msg);
  },

  error: (msg: string, meta?: Record<string, unknown>) => {
    if (meta) console.error(msg, JSON.stringify(meta)); else console.error(msg);
  },

  debug: (msg: string, meta?: Record<string, unknown>) => {
    if (meta) console.debug(msg, JSON.stringify(meta)); else console.debug(msg);
  },
};

export default logger;
