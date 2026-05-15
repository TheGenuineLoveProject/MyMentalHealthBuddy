/**
 * Phase 24 — useBoundaryState
 * SSR-safe React hook exposing boundaries + check + reset.
 */

import { useCallback, useMemo, useState } from "react";
import {
  BOUNDARY_SPECS,
  checkBoundaries,
  listBoundaries,
  type BoundarySpec,
  type BoundaryViolation,
} from "./BoundaryEngine";

export interface UseBoundaryStateReturn {
  readonly boundaries: ReadonlyArray<BoundarySpec>;
  readonly violations: ReadonlyArray<BoundaryViolation>;
  check(text: string): ReadonlyArray<BoundaryViolation>;
  reset(): void;
}

export function useBoundaryState(): UseBoundaryStateReturn {
  const [violations, setViolations] = useState<ReadonlyArray<BoundaryViolation>>([]);

  const boundaries = useMemo(() => listBoundaries(), []);

  const check = useCallback((text: string) => {
    const result = checkBoundaries(text);
    setViolations(result);
    return result;
  }, []);

  const reset = useCallback(() => {
    setViolations([]);
  }, []);

  // Use the spec map to satisfy lint that we still depend on the registry.
  void BOUNDARY_SPECS;

  return { boundaries, violations, check, reset };
}
