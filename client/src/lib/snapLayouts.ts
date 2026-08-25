import type React from "react";

export interface SnapZone {
  /** left edge as fraction of workspace width (0..1) */
  x: number;
  /** top edge as fraction of workspace height (0..1) */
  y: number;
  /** width as fraction (0..1) */
  w: number;
  /** height as fraction (0..1) */
  h: number;
}

export interface SnapTemplate {
  id: string;
  name: string;
  cols: number;
  rows: number;
  zones: SnapZone[];
}

export const SNAP_TEMPLATES: SnapTemplate[] = [
  {
    id: "full",
    name: "Full Screen",
    cols: 1,
    rows: 1,
    zones: [{ x: 0, y: 0, w: 1, h: 1 }],
  },
  {
    id: "halves",
    name: "2 Apps",
    cols: 2,
    rows: 1,
    zones: [
      { x: 0, y: 0, w: 0.5, h: 1 },
      { x: 0.5, y: 0, w: 0.5, h: 1 },
    ],
  },
  {
    id: "thirds",
    name: "3 Apps in Row",
    cols: 3,
    rows: 1,
    zones: [
      { x: 0, y: 0, w: 1 / 3, h: 1 },
      { x: 1 / 3, y: 0, w: 1 / 3, h: 1 },
      { x: 2 / 3, y: 0, w: 1 / 3, h: 1 },
    ],
  },
  {
    id: "split-1-2",
    name: "1 Big + 2 Stacked",
    cols: 2,
    rows: 2,
    zones: [
      { x: 0, y: 0, w: 0.5, h: 1 },
      { x: 0.5, y: 0, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
    ],
  },
  {
    id: "grid-4",
    name: "4 Apps Grid",
    cols: 2,
    rows: 2,
    zones: [
      { x: 0, y: 0, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0, w: 0.5, h: 0.5 },
      { x: 0, y: 0.5, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
    ],
  },
];

export function getTemplate(id: string | null | undefined): SnapTemplate | undefined {
  if (!id) return undefined;
  return SNAP_TEMPLATES.find((t) => t.id === id);
}

/**
 * Convert a fractional zone into pixel rect inside a given area.
 * Outer margin keeps windows off the desktop edges; gutter separates neighbours.
 */
export function zoneToRect(
  zone: SnapZone,
  area: { w: number; h: number },
  margin = 10,
  gutter = 14
): { x: number; y: number; w: number; h: number } {
  const x1 = zone.x * area.w + (zone.x === 0 ? margin : gutter / 2);
  const y1 = zone.y * area.h + (zone.y === 0 ? margin : gutter / 2);
  const right = (zone.x + zone.w) * area.w - (zone.x + zone.w === 1 ? margin : gutter / 2);
  const bottom = (zone.y + zone.h) * area.h - (zone.y + zone.h === 1 ? margin : gutter / 2);
  return { x: x1, y: y1, w: Math.max(120, right - x1), h: Math.max(100, bottom - y1) };
}

/** CSS grid placement for rendering a zone inside a template preview card. */
export function zoneGridStyle(
  zone: SnapZone,
  cols: number,
  rows: number
): React.CSSProperties {
  const colStart = Math.round(zone.x * cols) + 1;
  const colSpan = Math.max(1, Math.round(zone.w * cols));
  const rowStart = Math.round(zone.y * rows) + 1;
  const rowSpan = Math.max(1, Math.round(zone.h * rows));
  return {
    gridColumn: `${colStart} / span ${colSpan}`,
    gridRow: `${rowStart} / span ${rowSpan}`,
  };
}
