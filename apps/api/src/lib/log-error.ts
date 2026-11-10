// Never log raw messages or SQL details: they may contain emails, tokens, or
// query values. Stack frames retain diagnostic context without the message.
export function safeError(error: unknown): {
  errorName: string;
  stack?: string;
} {
  if (!(error instanceof Error)) return { errorName: 'UnknownError' };
  return {
    errorName: error.name,
    stack: error.stack?.split('\n').slice(1).join('\n'),
  };
}
