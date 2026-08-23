// Exportação/cópia de cards. Reaproveita o mesmo mecanismo do ResultScreen
// (html-to-image) e recorta os cantos arredondados no canvas final para que
// nunca sobre "quina" quadrada atrás do card.

const PIXEL_RATIO = 3;

function roundedClip(ctx: CanvasRenderingContext2D, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(w - radius, 0);
  ctx.quadraticCurveTo(w, 0, w, radius);
  ctx.lineTo(w, h - radius);
  ctx.quadraticCurveTo(w, h, w - radius, h);
  ctx.lineTo(radius, h);
  ctx.quadraticCurveTo(0, h, 0, h - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.clip();
}

export async function renderCardToBlob(node: HTMLElement): Promise<Blob | null> {
  const { toCanvas } = await import('html-to-image');
  // offsetWidth/Height ignoram transform de ancestrais (escala de tela),
  // garantindo que a imagem copiada saia sempre no tamanho real do card.
  const source = await toCanvas(node, {
    pixelRatio: PIXEL_RATIO,
    cacheBust: true,
    backgroundColor: 'transparent',
    width: node.offsetWidth,
    height: node.offsetHeight,
    style: { transform: 'none', transformOrigin: 'top left', margin: '0' },
  });

  const cssRadius = parseFloat(getComputedStyle(node).borderTopLeftRadius || '0') || 0;
  const out = document.createElement('canvas');
  out.width = source.width;
  out.height = source.height;
  const ctx = out.getContext('2d');
  if (!ctx) return null;

  const scale = source.width / Math.max(1, node.offsetWidth);
  roundedClip(ctx, out.width, out.height, cssRadius * scale);
  ctx.drawImage(source, 0, 0);

  return new Promise((resolve) => out.toBlob((b) => resolve(b), 'image/png'));
}


export type CardExportResult = 'copied' | 'shared' | 'downloaded' | 'error';

export async function copyCardToClipboard(
  node: HTMLElement | null,
  fileName = 'nakor-card.png',
): Promise<CardExportResult> {
  if (!node) return 'error';
  try {
    const blob = await renderCardToBlob(node);
    if (!blob) return 'error';

    const file = new File([blob], fileName, { type: 'image/png' });

    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        return 'copied';
      } catch {
        /* segue para share/download */
      }
    }

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file] });
      return 'shared';
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    return 'downloaded';
  } catch {
    return 'error';
  }
}
