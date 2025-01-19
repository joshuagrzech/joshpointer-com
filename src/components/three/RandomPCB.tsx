// RandomPCB.tsx
import React, { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import PCBTrace from './PCBTrace';
import { getShapePathPoints, loadPolygon2D, Polygon2D } from './ShapeUtils';
import { buildGrid, bfsPath, gridPathToPoints } from './GridPathfind';

interface RandomPCBProps {
  count?: number; // Number of simultaneous traces
  shape?: string; // "rectangle", "circle", or an SVG path
  mode?: 'fill' | 'surround';
  gridSize?: number; // default = 0.5
  margin?: number; // Outer boundary for surround mode
  pathFollowProbability?: number; // Percentage of traces that follow the shape path
}

interface TraceData {
  id: string;
  points: THREE.Vector3[]; // BFS path
  color: THREE.Color;
  isActive: boolean;
  index: number;
}

const RandomPCB: React.FC<RandomPCBProps> = ({
  count = 5,
  shape = 'rectangle',
  mode = 'fill',
  gridSize = 0.5,
  margin = 2,
  pathFollowProbability = 0.5,
}) => {
  const [polygon, setPolygon] = useState<Polygon2D | null>(null);
  const [traces, setTraces] = useState<TraceData[]>([]);

  // Load the shape polygon
  useEffect(() => {
    (async () => {
      const poly = await loadPolygon2D(shape);
      setPolygon(poly);
    })();
  }, [shape]);

  // Once we have polygon, build a grid
  const [grid, setGrid] = useState<ReturnType<typeof buildGrid> | null>(null);

  useEffect(() => {
    if (!polygon) return;
    const fillMode = mode === 'fill';
    const g = buildGrid(polygon, gridSize, fillMode, margin);
    setGrid(g);
  }, [polygon, mode, gridSize, margin]);

  // Helper: pick random free cell for start or end
  const pickRandomFreeCell = useCallback((): [number, number] | null => {
    if (!grid) return null;

    const { cells, width, height } = grid;
    let tries = 0;
    while (tries < 50) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      if (cells[y][x] === 0) {
        return [x, y];
      }
      tries++;
    }
    return null;
  }, [grid]);

  const createTrace = useCallback(
    async (index: number): Promise<TraceData | null> => {
      const followExactPath = Math.random() < (pathFollowProbability ?? 0);

      if (followExactPath && polygon) {
        // Follow the exact shape path
        const pathPoints = await getShapePathPoints(shape);
        if (!pathPoints || pathPoints.length < 2) {
          console.warn('Invalid shape path points. Path length:', pathPoints?.length);
          return null;
        }

        return {
          id: Math.random().toString(36).slice(2, 9),
          points: pathPoints,
          color: new THREE.Color(`hsl(${Math.random() * 360}, 100%, 50%)`),
          isActive: true,
          index,
        };
      } else if (grid) {
        // Use grid-based pathfinding
        const startCell = pickRandomFreeCell();
        const endCell = pickRandomFreeCell();
        if (!startCell || !endCell) {
          console.warn('Invalid grid cells for pathfinding');
          return null;
        }

        const path = bfsPath(grid.cells, grid.width, grid.height, startCell, endCell);
        if (!path || path.length < 2) {
          console.warn('Invalid BFS path. Path length:', path?.length);
          return null;
        }

        const points = gridPathToPoints(path, grid.origin, grid.gridSize);
        if (!points || points.length < 2) {
          console.warn('Invalid converted BFS path points. Path length:', points?.length);
          return null;
        }

        const color = new THREE.Color(`hsl(${Math.random() * 360}, 100%, 50%)`);

        return {
          id: Math.random().toString(36).slice(2, 9),
          points,
          color,
          isActive: true,
          index,
        };
      }

      console.warn('createTrace failed to create a trace');
      return null;
    },
    [grid, polygon, shape, pathFollowProbability, pickRandomFreeCell]
  );

  // Replace a trace after completion
  const handleTraceComplete = useCallback(
    (id: string) => {
      const updateTrace = async () => {
        setTraces((prev) => {
          const idx = prev.findIndex((t) => t.id === id);
          if (idx === -1) return prev;

          createTrace(prev[idx].index).then((newTrace) => {
            if (newTrace) {
              setTraces((current) => {
                const copy = [...current];
                copy[idx] = newTrace;
                return copy;
              });
            }
          });

          return prev;
        });
      };

      updateTrace();
    },
    [createTrace]
  );

  // Initialize traces
  useEffect(() => {
    if (!grid) return;

    const initializeTraces = async () => {
      const arr: TraceData[] = [];
      for (let i = 0; i < count; i++) {
        const t = await createTrace(i);
        if (t && t.points) {
          arr.push(t);
          console.log(`Created trace ${i}:`, t.points.length, 'points');
        }
      }
      console.log(`Generated ${arr.length} traces`);
      setTraces(arr);
    };

    initializeTraces();
  }, [grid, count, createTrace]);

  return (
    <group>
      {traces.map((trace) => {
        if (!trace.points || trace.points.length < 2) {
          console.error('Invalid points array for trace', trace);
          return null;
        }

        return (
          <PCBTrace
            key={trace.id}
            points={trace.points}
            color={trace.color}
            isAnimating={trace.isActive}
            onComplete={() => handleTraceComplete(trace.id)}
          />
        );
      })}
    </group>
  );
};

export default RandomPCB;
