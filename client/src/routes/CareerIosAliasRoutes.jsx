import { Route, Redirect } from "wouter";

export default function CareerIosAliasRoutes({ ConfigRoute }) {
  return (
    <>
      <Route path="/career">{() => <Redirect to="/careers" />}</Route>
      <Route path="/job">{() => <Redirect to="/careers" />}</Route>
      <Route path="/jobs">{() => <Redirect to="/careers" />}</Route>
      <Route path="/ios">{() => <ConfigRoute route="/features" />}</Route>
    </>
  );
}
