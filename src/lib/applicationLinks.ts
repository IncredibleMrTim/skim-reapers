export const APPLICATION_PATH = "/application"
export const VACANCY_QUERY_PARAM = "vacancy"

/**
 * Adds the vacancy's Sanity key to any button that points at the application
 * page, so the page can tell which role the visitor is applying for. Editors
 * just set the button's path to "/application" in the Studio — they never
 * need to know or type the key. Other buttons, and paths that already carry
 * a query string, pass through unchanged.
 */
export function withVacancyKey<TButton extends { path: string }>(
  buttons: TButton[],
  vacancyKey: string,
): TButton[] {
  return buttons.map((button) =>
    button.path === APPLICATION_PATH
      ? {
          ...button,
          path: `${APPLICATION_PATH}?${VACANCY_QUERY_PARAM}=${encodeURIComponent(vacancyKey)}`,
        }
      : button,
  )
}
