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

              <Route path="/challenges">{() => <Redirect to="/challenge" />}</Route>
              <Route path="/therapist">{() => <Redirect to="/therapy" />}</Route>
              <Route path="/donate">{() => <Redirect to="/pricing" />}</Route>
              <AliasRedirectRoutes />
              <Route path="/logs">{() => <Redirect to="/journal" />}</Route>
              <Route path="/tutorial">{() => <Redirect to="/guides" />}</Route>
              <Route path="/class">{() => <Redirect to="/courses" />}</Route>
              <Route path="/classes">{() => <Redirect to="/courses" />}</Route>
              <Route path="/selfcare">{() => <Redirect to="/self-care" />}</Route>
              <Route path="/selflove">{() => <Redirect to="/self-love" />}</Route>
              <Route path="/innerchild">{() => <Redirect to="/inner-child" />}</Route>
              <Route path="/quotes">{() => <Redirect to="/affirmations" />}</Route>
              <Route path="/heal">{() => <Redirect to="/healing" />}</Route>
              <Route path="/mentalhealth">{() => <Redirect to="/mental-health" />}</Route>
              <Route path="/ground">{() => <Redirect to="/grounding" />}</Route>
              <Route path="/routine">{() => <Redirect to="/routines" />}</Route>
              <Route path="/explore">{() => <Redirect to="/wellness-tools" />}</Route>
              <Route path="/discover">{() => <Redirect to="/wellness-tools" />}</Route>
              <Route path="/toolkit">{() => <Redirect to="/wellness-tools" />}</Route>
              <Route path="/breathe">{() => <Redirect to="/breathing" />}</Route>
              <Route path="/technique">{() => <Redirect to="/practices" />}</Route>
              <Route path="/techniques">{() => <Redirect to="/practices" />}</Route>
              <Route path="/selfworth">{() => <Redirect to="/self-worth" />}</Route>
              <Route path="/emotion">{() => <Redirect to="/emotions" />}</Route>
              <Route path="/topics">{() => <Redirect to="/talk-topics" />}</Route>
              <Route path="/talk">{() => <Redirect to="/talk-topics" />}</Route>
              <Route path="/conversations">{() => <Redirect to="/talk-topics" />}</Route>
              <Route path="/discussion">{() => <Redirect to="/talk-topics" />}</Route>
              <Route path="/find">{() => <Redirect to="/explore/search" />}</Route>
              <Route path="/search">{() => <Redirect to="/explore/search" />}</Route>
              <Route path="/guidance">{() => <Redirect to="/support" />}</Route>
              <Route path="/healing-tools">{() => <Redirect to="/practices" />}</Route>
              <Route path="/my-journey">{() => <Redirect to="/dashboard" />}</Route>
              <Route path="/media">{() => <Redirect to="/learn" />}</Route>
              <Route path="/downloads">{() => <Redirect to="/resources" />}</Route>
              <Route path="/user">{() => <Redirect to="/profile" />}</Route>
              <Route path="/apps">{() => <Redirect to="/tools" />}</Route>
              <Route path="/appointment">{() => <Redirect to="/booking" />}</Route>
              <Route path="/test">{() => <Redirect to="/demo" />}</Route>
              <Route path="/begin">{() => <Redirect to="/onboarding" />}</Route>
              <Route path="/join">{() => <Redirect to="/register" />}</Route>
              <Route path="/worksheets">{() => <Redirect to="/practices" />}</Route>
              <Route path="/meditations">{() => <Redirect to="/meditation" />}</Route>
              <Route path="/appointments">{() => <Redirect to="/booking" />}</Route>
              <Route path="/members">{() => <Redirect to="/community" />}</Route>
              <Route path="/member">{() => <Redirect to="/profile" />}</Route>
              <Route path="/log-in">{() => <Redirect to="/login" />}</Route>
              <Route path="/contact-us">{() => <Redirect to="/contact" />}</Route>
              <Route path="/about-us">{() => <Redirect to="/about" />}</Route>
              <Route path="/faqs">{() => <Redirect to="/faq" />}</Route>
              <Route path="/getting-started">{() => <Redirect to="/onboarding" />}</Route>
              <Route path="/how-it-works">{() => <Redirect to="/features" />}</Route>
              <Route path="/sitemap">{() => <Redirect to="/explore" />}</Route>
              <Route path="/my-profile">{() => <Redirect to="/profile" />}</Route>
              <Route path="/my-account">{() => <Redirect to="/profile" />}</Route>
              <Route path="/my-settings">{() => <Redirect to="/settings" />}</Route>
              <Route path="/preferences">{() => <Redirect to="/settings" />}</Route>
              <Route path="/logout">{() => <Redirect to="/login" />}</Route>
              <Route path="/signout">{() => <Redirect to="/login" />}</Route>
              <Route path="/sign-out">{() => <Redirect to="/login" />}</Route>
    </>
  );
}
