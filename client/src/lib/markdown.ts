export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens, but keep alphanumeric and unicode characters (like Chinese)
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '') || 'heading';
};
