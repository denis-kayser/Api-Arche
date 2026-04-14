export const toSlug = (text: string): string =>
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');