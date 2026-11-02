// Lee el texto de un PDF con su posición y tamaño usando pdf.js.
// pdf.js se carga solo cuando se usa (no pesa en el arranque de la app) y
// corre en el hilo principal: el PDF de LinkedIn es pequeño.
import type { PdfLine } from './parse';

interface TextItem {
  str: string;
  transform: number[];
  width: number;
}

export async function extractLines(data: ArrayBuffer): Promise<PdfLine[]> {
  const pdfjs = await import('pdfjs-dist');
  // Registrar el "worker" en este mismo hilo evita depender de archivos externos.
  // @ts-expect-error módulo sin tipos
  const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs');
  (globalThis as unknown as { pdfjsWorker: unknown }).pdfjsWorker = worker;

  const doc = await pdfjs.getDocument({ data: new Uint8Array(data), isEvalSupported: false }).promise;
  const lines: PdfLine[] = [];

  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const { width, height } = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    const items = (content.items as TextItem[])
      .filter((it) => typeof it.str === 'string' && it.str.trim() !== '')
      .map((it) => ({
        str: it.str,
        x: it.transform[4],
        y: height - it.transform[5],
        size: Math.hypot(it.transform[0], it.transform[1]),
        w: it.width,
      }));

    // La barra lateral de LinkedIn ocupa aprox. el primer tercio de la página.
    const sideLimit = width * 0.3;
    for (const col of ['side', 'main'] as const) {
      const colItems = items
        .filter((it) => (col === 'side' ? it.x < sideLimit : it.x >= sideLimit))
        .sort((a, b) => a.y - b.y || a.x - b.x);
      let current: (PdfLine & { right: number }) | null = null;
      for (const it of colItems) {
        if (current && Math.abs(it.y - current.y) < Math.max(2, it.size * 0.35)) {
          const gap = it.x - current.right;
          current.text += (gap > it.size * 0.2 && !current.text.endsWith(' ') && !it.str.startsWith(' ') ? ' ' : '') + it.str;
          current.right = Math.max(current.right, it.x + it.w);
          current.size = Math.max(current.size, it.size);
        } else {
          if (current) lines.push(current);
          current = { text: it.str, x: it.x, y: it.y, size: it.size, page: p, col, right: it.x + it.w };
        }
      }
      if (current) lines.push(current);
    }
  }
  return lines.map(({ text, x, y, size, page, col }) => ({ text: text.replace(/\s+/g, ' ').trim(), x, y, size, page, col }));
}
