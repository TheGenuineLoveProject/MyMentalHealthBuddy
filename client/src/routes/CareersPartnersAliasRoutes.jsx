import { Route, Redirect } from "wouter";

export default function CareersPartnersAliasRoutes({ ConfigRoute }) {
  return (
    <>
      <Route path="/event">{() => <Redirect to="/events" />}</Route>
      <Route path="/updates">{() => <Redirect to="/news" />}</Route>
      <Route path="/partner">{() => <Redirect to="/partners" />}</Route>
      <Route path="/affiliate">{() => <Redirect to="/partners" />}</Route>
      <Route path="/affiliates">{() => <Redirect to="/partners" />}</Route>
      <Route path="/career">{() => <Redirect to="/careers" />}</Route>
      <Route path="/job">{() => <Redirect to="/careers" />}</Route>
      <Route path="/jobs">{() => <Redirect to="/careers" />}</Route>
      <Route path="/ios">{() => <ConfigRoute route="/features" />}</Route>
    </>
  );
}
