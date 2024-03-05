// TODO: need rewrite

export default function getInputPlaceholder(
  isValidating: boolean,
  error: unknown,
  forbidden: boolean,
  defaultValue?: string
) {
  if (isValidating) {
    return 'Завантаження...';
  }

  if (error) {
    return 'Помилка завантаження';
  }

  if (forbidden) {
    return 'Недоступно';
  }
  return defaultValue ?? '';
}
