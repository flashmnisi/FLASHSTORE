import pino from 'pino';

const base = pino({
  transport: { target: 'pino-pretty' },
});

const logger = {
  info: (meta: any, msg?: string) => base.info(meta || {}, msg),
  warn: (meta: any, msg?: string) => base.warn(meta || {}, msg),
  error: (meta: any, msg?: string) => base.error(meta || {}, msg),
  debug: (meta: any, msg?: string) => base.debug(meta || {}, msg),
};

export default logger;