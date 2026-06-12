export const safeJsonLd = (obj: unknown): string =>
  JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(new RegExp(' ', 'g'), '\\u2028')
    .replace(new RegExp(' ', 'g'), '\\u2029')
