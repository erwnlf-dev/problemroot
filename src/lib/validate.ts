/** Input validation utility. */
export function validateInput(value: string, maxLength = 1000): string {
  return value.trim().slice(0, maxLength).replace(/<[^>]*>/g, '');
}
