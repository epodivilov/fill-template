/**
 * Fill template with variables
 * @param {string} string
 * @param {Record<string,string>} values
 */
export function fillTemplate(string, values = {}) {
  const result = string.replace(/\[[^\].]+\]/g, (match) => {
    if (match != null) {
      const [_, key] = match.match(/{(.+)}/) || [];

      if (!key || values[key] == null) {
        return "";
      }

      return match.slice(1, -1).replace(`{${key}}`, values[key]);
    }

    return match;
  });

  return result.replace(/{([^}.]+)}/g, (match) => {
    if (match != null) {
      const [_, key] = match.match(/{(.+)}/) || [];

      if (!key || values[key] == null) {
        return "";
      }

      return match.replace(`{${key}}`, values[key]);
    }

    return match;
  }); // заменить переменные без групп
}
