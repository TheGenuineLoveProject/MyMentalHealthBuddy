import { Route, Redirect } from "wouter";

export default function AliasRedirectRoutes() {
  return (
    <>
      <Route path="/subscribe">{() => <Redirect to="/pricing" />}</Route>
      <Route path="/article">{() => <Redirect to="/articles" />}</Route>
      <Route path="/posts">{() => <Redirect to="/blog" />}</Route>
      <Route path="/breathwork">{() => <Redirect to="/breathing" />}</Route>
      <Route path="/meditate">{() => <Redirect to="/meditation" />}</Route>
      <Route path="/affirmation">{() => <Redirect to="/affirmations" />}</Route>
      <Route path="/timer">{() => <Redirect to="/breathing" />}</Route>
      <Route path="/activity">{() => <Redirect to="/activities" />}</Route>
      <Route path="/prompt">{() => <Redirect to="/prompts" />}</Route>
      <Route path="/story">{() => <Redirect to="/journal" />}</Route>
      <Route path="/stories">{() => <Redirect to="/journal" />}</Route>
      <Route path="/track">{() => <Redirect to="/mood" />}</Route>
      <Route path="/tracker">{() => <Redirect to="/mood" />}</Route>
      <Route path="/tracking">{() => <Redirect to="/mood" />}</Route>
      <Route path="/log">{() => <Redirect to="/journal" />}</Route>
    </>
  );
}
