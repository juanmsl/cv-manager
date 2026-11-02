import { useState, type DragEvent } from 'react';

/**
 * Reordenar arrastrando desde el asa (⋮⋮). Devuelve las props para cada elemento.
 * Además de arrastrar, cada ficha ofrece botones "Subir/Bajar" para teclado.
 */
export function useReorder(onMove: (from: number, to: number) => void) {
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);

  const itemProps = (index: number) => ({
    onDragOver: (e: DragEvent) => {
      if (dragging === null) return;
      e.preventDefault();
      if (over !== index) setOver(index);
    },
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      if (dragging !== null && dragging !== index) onMove(dragging, index);
      setDragging(null);
      setOver(null);
    },
  });

  const gripProps = (index: number) => ({
    draggable: true,
    onDragStart: (e: DragEvent) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(index));
      setDragging(index);
    },
    onDragEnd: () => {
      setDragging(null);
      setOver(null);
    },
  });

  const cls = (index: number) =>
    (dragging === index ? ' is-dragging' : '') + (over === index && dragging !== index ? ' is-drop-target' : '');

  return { itemProps, gripProps, cls };
}
