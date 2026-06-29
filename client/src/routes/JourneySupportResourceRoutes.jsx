import { Route, Redirect } from "wouter";

export default function JourneySupportResourceRoutes() {
  return (
    <>
      <Route path="/my-journey">{() => <Redirect to="/dashboard" />}</Route>
      <Route path="/guidance">{() => <Redirect to="/support" />}</Route>
      <Route path="/healing-tools">{() => <Redirect to="/practices" />}</Route>
      <Route path="/media">{() => <Redirect to="/learn" />}</Route>
      <Route path="/downloads">{() => <Redirect to="/resources" />}</Route>
      <Route path="/apps">{() => <Redirect to="/tools" />}</Route>
      <Route path="/appointment">{() => <Redirect to="/booking" />}</Route>
      <Route path="/appointments">{() => <Redirect to="/booking" />}</Route>
    </>
  );
}
