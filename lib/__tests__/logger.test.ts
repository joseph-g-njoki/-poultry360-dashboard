import { logger } from '../logger';

describe('Logger', () => {
  beforeEach(() => {
    logger.clearLogs();
  });

  it('logs info messages', () => {
    logger.info('Test info message');
    const logs = logger.getRecentLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('info');
    expect(logs[0].message).toBe('Test info message');
  });

  it('logs error messages with error object', () => {
    const testError = new Error('Test error');
    logger.error('Error occurred', testError);
    const logs = logger.getRecentLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('error');
    expect(logs[0].error).toBe(testError);
  });

  it('logs with context', () => {
    logger.info('Test with context', { userId: 123 });
    const logs = logger.getRecentLogs();
    expect(logs[0].context).toEqual({ userId: 123 });
  });

  it('maintains maximum log limit', () => {
    for (let i = 0; i < 150; i++) {
      logger.info(`Message ${i}`);
    }
    const logs = logger.getRecentLogs(200);
    expect(logs.length).toBeLessThanOrEqual(100);
  });

  it('clears logs', () => {
    logger.info('Test message');
    logger.clearLogs();
    const logs = logger.getRecentLogs();
    expect(logs.length).toBe(0);
  });
});