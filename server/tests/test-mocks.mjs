import { vi } from "vitest";

export const insert = vi.fn();
export const select = vi.fn();
export const update = vi.fn();
export const deleteOp = vi.fn();

export function resetMocks() {
  insert.mockReset();
  select.mockReset();
  update.mockReset();
  deleteOp.mockReset();
}
