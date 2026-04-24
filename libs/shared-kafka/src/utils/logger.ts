import pino from 'pino';

const base = pino({
  transport: { target: 'pino-pretty' },
});

const logger = {
  info: (msg: string, meta?: any) => base.info(meta || {}, msg),
  warn: (msg: string, meta?: any) => base.warn(meta || {}, msg),
  error: (msg: string, meta?: any) => base.error(meta || {}, msg),
  debug: (msg: string, meta?: any) => base.debug(meta || {}, msg),
};

export default logger;