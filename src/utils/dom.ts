const SVG_NS = 'http://www.w3.org/2000/svg';

type SvgAttrs = Readonly<Record<string, string | number>>;

interface ElOptions {
  className?: string;
  text?: string;
  attrs?: Readonly<Record<string, string>>;
}

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: ElOptions = {},
  ...children: readonly (Node | string)[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (options.className !== undefined) element.className = options.className;
  for (const [name, value] of Object.entries(options.attrs ?? {})) {
    element.setAttribute(name, value);
  }
  if (options.text !== undefined) element.textContent = options.text;
  element.append(...children);
  return element;
}

export function svg<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: SvgAttrs = {},
  text?: string,
): SVGElementTagNameMap[K] {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attrs)) {
    element.setAttribute(name, String(value));
  }
  if (text !== undefined) element.textContent = text;
  return element;
}

export function byId<T extends Element>(id: string, type: abstract new (...args: never[]) => T): T {
  const element = document.getElementById(id);
  if (!(element instanceof type)) throw new Error(`Нет элемента #${id} нужного типа`);
  return element;
}
