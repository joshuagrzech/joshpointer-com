// GridPathfind.ts
import * as THREE from 'three';
import { Polygon2D } from './ShapeUtils';

/**
 * Builds a discrete grid over the bounding box. Each cell is either free or blocked.
 * - gridSize determines the cell dimension in real coords
 * - fill=true => inside cells are free, outside cells blocked
 * - fill=false => outside cells are free, inside cells blocked
 * - margin defines the outer boundary for surround mode
 */
export function buildGrid(
  poly: Polygon2D,
  gridSize = 0.5,
  fill: boolean,
  margin = 2
): {
  cells: number[][]; // 0=free, 1=blocked
  width: number;
  height: number;
  origin: THREE.Vector2; // bottom-left corner
  gridSize: number;
} {
  // Validate and compute bounding box
  const innerMinX = poly.min.x;
  const innerMinY = poly.min.y;
  const innerMaxX = poly.max.x;
  const innerMaxY = poly.max.y;

  if (
    isNaN(innerMinX) ||
    isNaN(innerMinY) ||
    isNaN(innerMaxX) ||
    isNaN(innerMaxY) ||
    innerMinX >= innerMaxX ||
    innerMinY >= innerMaxY
  ) {
    throw new Error('Invalid polygon bounding box. Check your shape definition.');
  }

  // Outer boundary based on margin
  const outerMinX = innerMinX - margin;
  const outerMinY = innerMinY - margin;
  const outerMaxX = innerMaxX + margin;
  const outerMaxY = innerMaxY + margin;

  const width = Math.max(1, Math.ceil((outerMaxX - outerMinX) / gridSize));
  const height = Math.max(1, Math.ceil((outerMaxY - outerMinY) / gridSize));

  // Log bounding box and grid size for debugging
  console.log('Grid dimensions:', { width, height });
  console.log('Bounding box:', { outerMinX, outerMinY, outerMaxX, outerMaxY });

  const cells = new Array(height).fill(null).map(() => new Array(width).fill(0));

  // Mark cells based on fill/surround logic
  for (let gy = 0; gy < height; gy++) {
    for (let gx = 0; gx < width; gx++) {
      const xCoord = outerMinX + (gx + 0.5) * gridSize;
      const yCoord = outerMinY + (gy + 0.5) * gridSize;

      const insideShape = poly.inside(new THREE.Vector2(xCoord, yCoord));
      const insideOuterBoundary =
        xCoord >= outerMinX && xCoord <= outerMaxX && yCoord >= outerMinY && yCoord <= outerMaxY;

      let isFree = false;
      if (fill) {
        // In fill mode, only cells inside the shape are free
        isFree = insideShape;
      } else {
        // In surround mode, cells between the shape and outer boundary are free
        isFree = !insideShape && insideOuterBoundary;
      }

      cells[gy][gx] = isFree ? 0 : 1; // 0 = free, 1 = blocked
    }
  }

  return {
    cells,
    width,
    height,
    origin: new THREE.Vector2(outerMinX, outerMinY),
    gridSize,
  };
}
export function bfsPath(
  cells: number[][],
  width: number,
  height: number,
  start: [number, number],
  end: [number, number]
): Array<[number, number]> {
  const queue: Array<[number, number, Array<[number, number]>]> = [];
  const visited = new Set<string>();

  queue.push([start[0], start[1], [[start[0], start[1]]]]);
  visited.add(`${start[0]},${start[1]}`);

  const moves = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length > 0) {
    const [cx, cy, path] = queue.shift()!;
    if (cx === end[0] && cy === end[1]) {
      return path;
    }
    for (const [mx, my] of moves) {
      const nx = cx + mx;
      const ny = cy + my;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      if (cells[ny][nx] === 1) continue; // blocked
      const key = `${nx},${ny}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push([nx, ny, [...path, [nx, ny]]]);
      }
    }
  }

  return [];
}

/** Converts BFS cell path => list of 2D or 3D points */
export function gridPathToPoints(
  path: Array<[number, number]>,
  origin: THREE.Vector2,
  gridSize: number
): THREE.Vector3[] {
  return path.map(([gx, gy]) => {
    const x = origin.x + (gx + 0.5) * gridSize;
    const y = origin.y + (gy + 0.5) * gridSize;
    return new THREE.Vector3(x, y, 0);
  });
}
