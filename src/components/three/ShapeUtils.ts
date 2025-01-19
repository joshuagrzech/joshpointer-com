// ShapeUtils.ts
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

/**
 * Represents a 2D shape with:
 *  - A bounding box (min, max)
 *  - An `inside(pt)` function
 */
export interface Polygon2D {
  min: THREE.Vector2;
  max: THREE.Vector2;
  inside: (pt: THREE.Vector2) => boolean;
}

/**
 * Loads a shape. The shape can be:
 *  - "rectangle"
 *  - "circle"
 *  - an SVG path string
 */
// ShapeUtils.ts
export async function loadPolygon2D(shape: string): Promise<Polygon2D> {
  if (shape === 'rectangle') {
    const height = 1; // Half-height since we're centered at origin
    const width = (9 / 19.5) * 2; // For 9:16 ratio, width should be larger
    const min = new THREE.Vector2(-width, -height);
    const max = new THREE.Vector2(width, height);
    return {
      min,
      max,
      inside: (pt: THREE.Vector2) =>
        pt.x >= min.x && pt.x <= max.x && pt.y >= min.y && pt.y <= max.y,
    };
  } else if (shape === 'circle') {
    const min = new THREE.Vector2(-1, -1);
    const max = new THREE.Vector2(1, 1);
    return {
      min,
      max,
      inside: (pt: THREE.Vector2) => pt.length() <= 1.0,
    };
  } else {
    const loader = new SVGLoader();
    const svgData = loader.parse(shape);

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    const shapePolygons: THREE.Vector2[][] = [];

    svgData.paths.forEach((path) => {
      const shapes = path.toShapes(true);
      shapes.forEach((subShape) => {
        const points = subShape.getPoints(100);
        shapePolygons.push(points.map((p) => new THREE.Vector2(p.x, p.y)));
        for (const p of points) {
          if (p.x < minX) minX = p.x;
          if (p.x > maxX) maxX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.y > maxY) maxY = p.y;
        }
      });
    });

    // If no valid shapes were parsed, provide a default fallback bounding box
    if (minX === Infinity || minY === Infinity || maxX === -Infinity || maxY === -Infinity) {
      console.warn('No valid paths found in SVG. Using default bounding box.');
      minX = -1;
      minY = -1;
      maxX = 1;
      maxY = 1;
    }

    const min = new THREE.Vector2(minX, minY);
    const max = new THREE.Vector2(maxX, maxY);

    const inside = (pt: THREE.Vector2) => {
      return shapePolygons.some((poly) => pointInPolygon(pt, poly));
    };

    return {
      min,
      max,
      inside,
    };
  }
}
/** Build a shape from a bounding box (x1,y1,x2,y2). */
export function createBoxShape(x1: number, y1: number, x2: number, y2: number): Polygon2D {
  const min = new THREE.Vector2(Math.min(x1, x2), Math.min(y1, y2));
  const max = new THREE.Vector2(Math.max(x1, x2), Math.max(y1, y2));

  return {
    min,
    max,
    inside: (pt: THREE.Vector2) => pt.x >= min.x && pt.x <= max.x && pt.y >= min.y && pt.y <= max.y,
  };
}

/**
 * Convert a DOM boundingClientRect to a shape (assuming a 1:1 coordinate system).
 * In a real app, you'd do a proper transform from screen coords => scene coords.
 */
export function shapeFromDOMRect(rect: DOMRect): Polygon2D {
  // We'll place the bounding box at (rect.x, rect.y) -> (rect.right, rect.bottom).
  // In actual usage, you'd probably do a screen-to-scene conversion if using a 3D canvas.
  return createBoxShape(rect.left, rect.top, rect.right, rect.bottom);
}

/**
 * Convert a Three.js mesh boundingBox into a shape in the XY plane.
 * For more advanced usage, you may need to project or transform the bounding box.
 */
export function shapeFromMeshBoundingBox(mesh: THREE.Mesh): Polygon2D | null {
  if (!mesh.geometry.boundingBox) {
    mesh.geometry.computeBoundingBox();
    if (!mesh.geometry.boundingBox) return null;
  }

  // boundingBox is in local coordinates, so transform to world coords if needed
  const box = mesh.geometry.boundingBox.clone();
  // apply mesh.worldMatrix if you want a world-space bounding box
  mesh.updateMatrixWorld(true);
  box.applyMatrix4(mesh.matrixWorld);

  const minX = box.min.x;
  const minY = box.min.y;
  const maxX = box.max.x;
  const maxY = box.max.y;

  // We'll just treat that as a rectangle in XY plane
  return createBoxShape(minX, minY, maxX, maxY);
}
/** Standard 2D point-in-polygon test (raycasting) */
function pointInPolygon(pt: THREE.Vector2, poly: THREE.Vector2[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x,
      yi = poly[i].y;
    const xj = poly[j].x,
      yj = poly[j].y;

    const intersect = yi > pt.y !== yj > pt.y && pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export async function getShapePathPoints(shape: string, segments = 64): Promise<THREE.Vector3[]> {
  if (shape === 'rectangle') {
    const height = 1; // Half-height
    const width = height * (9 / 16); // Calculate width based on 16:9 ratio
    return [
      new THREE.Vector3(-width, height, 0), // Top left
      new THREE.Vector3(width, height, 0), // Top right
      new THREE.Vector3(width, -height, 0), // Bottom right
      new THREE.Vector3(-width, -height, 0), // Bottom left
      new THREE.Vector3(-width, height, 0), // Close the loop
    ];
  } else if (shape === 'circle') {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0));
    }
    if (points.length < 2) {
      console.warn('Circle shape path has insufficient points');
      points.push(new THREE.Vector3(1, 0, 0));
    }
    points.push(points[0]); // Close the circle
    return points;
  } else {
    const loader = new SVGLoader();
    const svgData = loader.parse(shape);
    const points: THREE.Vector3[] = [];
    svgData.paths.forEach((path) => {
      const shapes = path.toShapes(true);
      shapes.forEach((subShape) => {
        subShape.getPoints(segments).forEach((p) => {
          points.push(new THREE.Vector3(p.x, p.y, 0));
        });
      });
    });

    if (points.length < 2) {
      console.warn('SVG shape path has insufficient points');
      points.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0));
    }

    return points;
  }
}
