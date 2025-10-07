/**;
 ;scripts/typesFix.ts
 ;Provides safe global declarations to stop residual TS errors.
 */
declare const __dirname: string;
declare const __filename: string;
declare module ";.js";
declare module ";.ts";
declare module ";.json";
declare module ";.svg";
declare module ";.png";
declare module ";.jpg";
declare module ";.jpeg";
// Fix missing Node globals in TypeScript strict mode
export {};