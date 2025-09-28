// Mock passport implementation to fix build errors
export const passport = {
  use: (strategy: any) => {},
  serializeUser: (fn: any) => {},
  deserializeUser: (fn: any) => {},
  authenticate: (strategy: string, options?: any) => {
    return (req: any, res: any, next: any) => {
      next();
    };
  },
  initialize: () => (req: any, res: any, next: any) => next(),
  session: () => (req: any, res: any, next: any) => next()
};

export class Strategy {
  constructor(fn: any) {}
}

export const LocalStrategy = Strategy;

export default passport;