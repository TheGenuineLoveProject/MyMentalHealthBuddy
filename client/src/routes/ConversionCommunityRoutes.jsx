import { Route, Redirect } from "wouter";

export default function ConversionCommunityRoutes({ ConfigRoute }) {
  return (
    <>
      <Route path="/pricing">{() => <ConfigRoute route="/pricing" />}</Route>
      <Route path="/video">{() => <ConfigRoute route="/learn" />}</Route>
      <Route path="/free">{() => <ConfigRoute route="/pricing" />}</Route>
      <Route path="/trial">{() => <ConfigRoute route="/pricing" />}</Route>
      <Route path="/demo">{() => <ConfigRoute route="/features" />}</Route>
      <Route path="/group">{() => <Redirect to="/community" />}</Route>
      <Route path="/groups">{() => <Redirect to="/community" />}</Route>
    </>
  );
}
