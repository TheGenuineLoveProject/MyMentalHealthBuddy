// Mock passport implementation to fix build errors
export const passport = {
    use: (strategy) => { },
    serializeUser: (fn) => { },
    deserializeUser: (fn) => { },
    authenticate: (strategy, options) => {
        return (req, res, next) => {
            next();
        };
    },
    initialize: () => (req, res, next) => next(),
    session: () => (req, res, next) => next()
};
export class Strategy {
    constructor(fn) { }
}
export const LocalStrategy = Strategy;
export default passport;
