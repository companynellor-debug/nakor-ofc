// Exportação/cópia de cards. Reaproveita o mesmo mecanismo do ResultScreen
// (html-to-image) e mantém fallback para download quando o clipboard falha.

export async function renderCardToBlob(node: HTMLElement): Promise<Blob | null> {
  const { toBlob } = await import('html-to-image');
  // offsetWidth/Height ignoram transform de ancestrais (escala de tela),
  // garantindo que a imagem copiada saia sempre no tamanho real do card.
  return toBlob(node, {
    pixelRatio: 3,
    cacheBust: true,
    backgroundColor: 'transparent',
    width: node.offsetWidth,
    height: node.offsetHeight,
    style: { transform: 'none', transformOrigin: 'top left', margin: '0' },
  });
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
