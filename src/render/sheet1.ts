import template from '../templates/sheet1.html?raw';

export function renderSheet1(root: HTMLElement): void {
  root.innerHTML = template;
}
