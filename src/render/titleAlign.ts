const MOBILE_MAX_WIDTH = 760;
const GRAPH_MAIN_Y = 60;
const GRAPH_HEIGHT = 150;

interface TitleAlignTargets {
  title: HTMLElement;
  middleLine: HTMLElement;
  graph: SVGSVGElement;
}

/** Ставит среднюю строку заголовка на одну линию с веткой main. */
export function initTitleAlign({ title, middleLine, graph }: TitleAlignTargets): void {
  const align = (): void => {
    title.style.top = '0px';
    if (innerWidth <= MOBILE_MAX_WIDTH) return;
    const graphRect = graph.getBoundingClientRect();
    const lineRect = middleLine.getBoundingClientRect();
    const mainY = graphRect.top + (graphRect.height * GRAPH_MAIN_Y) / GRAPH_HEIGHT;
    const middleY = lineRect.top + lineRect.height / 2;
    title.style.top = `${mainY - middleY}px`;
  };

  addEventListener('resize', align);
  void document.fonts.ready.then(align);
  align();
}
