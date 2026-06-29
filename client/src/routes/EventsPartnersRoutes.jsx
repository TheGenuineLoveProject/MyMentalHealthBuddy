import { Route, Redirect } from "wouter";

export default function EventsPartnersRoutes() {
  return (
    <>
      <Route path="/event">{() => <Redirect to="/events" />}</Route>
      <Route path="/updates">{() => <Redirect to="/news" />}</Route>
      <Route path="/partner">{() => <Redirect to="/partners" />}</Route>
    </>
  );
}
