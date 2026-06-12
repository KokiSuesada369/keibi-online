const LS = String.fromCharCode(0x2028)
const PS = String.fromCharCode(0x2029)

export const safeJsonLd = (obj: unknown): string =>
  JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(new RegExp(LS, 'g'), '\\u2028')
    .replace(new RegExp(PS, 'g'), '\\u2029')
