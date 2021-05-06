export function readTemplate(query: string): string {
  return document.querySelector(query).innerHTML;
}
