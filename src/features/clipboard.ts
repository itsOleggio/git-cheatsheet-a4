import type { CommandLookup } from '../render/sections';

const TOAST_MS = 1400;

interface CopyTargets {
  grid: HTMLElement;
  log: SVGSVGElement;
  fullMessage: HTMLElement;
  toast: HTMLElement;
  lookup: CommandLookup;
}

function writeText(text: string, onCopied: () => void, onFailed: () => void): void {
  try {
    navigator.clipboard.writeText(text).then(onCopied, onFailed);
  } catch {
    onFailed();
  }
}

function selectContents(node: Node): void {
  const range = document.createRange();
  range.selectNodeContents(node);
  const selection = getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

/** Текст полного сообщения без подписи и комментариев-пояснений. */
function fullMessageText(message: HTMLElement): string {
  return [...message.childNodes]
    .filter(
      (node) =>
        !(
          node instanceof Element &&
          (node.classList.contains('lbl') || node.classList.contains('cm'))
        ),
    )
    .map((node) => node.textContent)
    .join('')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const isActivationKey = (event: KeyboardEvent): boolean =>
  event.key === 'Enter' || event.key === ' ';

export function initCopy({ grid, log, fullMessage, toast, lookup }: CopyTargets): void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const show = (message: string): void => {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(timer);
    timer = setTimeout(() => {
      toast.hidden = true;
    }, TOAST_MS);
  };

  const copy = (text: string): void => {
    const firstLine = text.split('\n')[0] ?? '';
    writeText(
      text,
      () => show(`Скопировано: ${firstLine}`),
      () => show(firstLine),
    );
  };

  grid.addEventListener('click', (event) => {
    const found = lookup(event.target);
    if (!found) return;
    const text = found.command.command;
    writeText(
      text,
      () => show(`Скопировано: ${text}`),
      () => {
        const code = found.button.querySelector('code');
        if (code) selectContents(code);
        show('Выделено — нажми Ctrl+C');
      },
    );
  });

  document.querySelectorAll<HTMLElement>('.ntab .ex').forEach((cell) => {
    cell.title = 'Скопировать git switch -c';
    cell.addEventListener('click', () => copy(`git switch -c ${cell.textContent}`));
  });

  const rowCopyText = (target: EventTarget | null): string | undefined => {
    if (!(target instanceof Element)) return undefined;
    const row = target.closest('.row');
    return row instanceof SVGElement ? row.dataset.copy : undefined;
  };
  log.addEventListener('click', (event) => {
    const text = rowCopyText(event.target);
    if (text !== undefined) copy(text);
  });
  log.addEventListener('keydown', (event) => {
    const text = rowCopyText(event.target);
    if (text !== undefined && isActivationKey(event)) {
      event.preventDefault();
      copy(text);
    }
  });

  document.querySelectorAll<HTMLElement>('.ex-list .e.ok').forEach((example) => {
    const copyExample = (): void => copy(example.querySelector('span')?.textContent ?? '');
    example.addEventListener('click', copyExample);
    example.addEventListener('keydown', (event) => {
      if (isActivationKey(event)) {
        event.preventDefault();
        copyExample();
      }
    });
  });

  fullMessage.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      fullMessage.click();
    }
  });
  fullMessage.addEventListener('click', () => copy(fullMessageText(fullMessage)));
}
