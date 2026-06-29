import { Route } from "wouter";

export default function ConfigUtilityRoutes({ ConfigRoute, MindfulnessCanonical }) {
  return (
    <>
      <Route path="/billing">{() => <ConfigRoute route="/billing" />}</Route>
      <Route path="/overview">{() => <ConfigRoute route="/overview" />}</Route>
      <Route path="/breathing">{() => <ConfigRoute route="/breathing" />}</Route>
      <Route path="/grounding">{() => <ConfigRoute route="/grounding" />}</Route>
      <Route path="/meditation">{() => <ConfigRoute route="/meditation" />}</Route>
      <Route path="/mindfulness" component={MindfulnessCanonical} />
    </>
  );
}
