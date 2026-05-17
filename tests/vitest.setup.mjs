import { afterAll } from "vitest";

/*
  HX-OS TEST GOVERNANCE

  This setup file intentionally does NOT boot the Express app.

  Reason:
  - Pure unit tests must remain isolated.
  - Starting the server inside Vitest creates port collisions
    with the active Replit runtime.
  - Integration/server tests must explicitly opt-in and boot
    their own isolated runtime independently.
*/

afterAll(async () => {
  // reserved for future teardown hooks
});
