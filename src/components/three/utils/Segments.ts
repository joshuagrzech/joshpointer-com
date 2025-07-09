// utils/Segments.ts
import * as THREE from 'three';

/** A single "straight" segment. */
export interface Segment {
  start: THREE.Vector3;
  end: THREE.Vector3;
  showStartSphere: boolean; // if there's a corner at the start
}

/**
 * Convert BFS path points => bigger segments, each purely in one direction.
 * A "corner" is where direction changes. We'll put `showStartSphere=true` if it's a corner.
 */
export function pathPointsToSegments(points: THREE.Vector3[]): Segment[] {
  if (points.length < 2) return [];

  const segments: Segment[] = [];

  // We'll track the current "start" of a straight run, and direction
  let runStart = points[0].clone();
  let prevDir = directionOf(points[0], points[1]);
  // The first segment's start is NOT a corner
  let showSphere = false;

  for (let i = 1; i < points.length; i++) {
    const curDir = i < points.length - 1 ? directionOf(points[i], points[i + 1]) : prevDir; // fallback for the last segment

    // If the direction changes from prevDir => corner
    if (!sameDirection(prevDir, curDir)) {
      // finalize the segment from runStart -> points[i]
      segments.push({
        start: runStart.clone(),
        end: points[i].clone(),
        showStartSphere: showSphere, // corner is at this segment's start
      });
      // new run starts at points[i]
      runStart = points[i].clone();
      showSphere = true; // next segment start is a corner
    }

    prevDir = curDir;
  }

  // finalize the last run
  segments.push({
    start: runStart.clone(),
    end: points[points.length - 1].clone(),
    showStartSphere: showSphere,
  });

  return segments;
}

function directionOf(a: THREE.Vector3, b: THREE.Vector3): [number, number] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  // We only have horizontal or vertical moves, so dx or dy is non-zero
  return Math.abs(dx) > Math.abs(dy) ? [dx > 0 ? 1 : -1, 0] : [0, dy > 0 ? 1 : -1];
}

/** Returns true if two directions are identical (e.g., [1,0] vs [1,0]) */
function sameDirection(d1: [number, number], d2: [number, number]): boolean {
  return d1[0] === d2[0] && d1[1] === d2[1];
}
