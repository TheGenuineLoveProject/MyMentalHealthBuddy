import React from "react";
import { Route } from "wouter";

export default function CommunityRoutes({
  CommunityHub,
  CommunityPage,
  CommunityCircle,
  DiscussionPage,
  CommunityCheckin,
  CommunityGuidelines,
  ProtectedRoute,
  ConfigRoute,
}) {
  return (
    <>
      <Route path="/community"><CommunityHub /></Route>
      <Route path="/community/feed"><ProtectedRoute><CommunityPage /></ProtectedRoute></Route>
      <Route path="/community/circle"><ProtectedRoute><CommunityCircle /></ProtectedRoute></Route>
      <Route path="/community/discussion/:id"><ProtectedRoute><DiscussionPage /></ProtectedRoute></Route>
      <Route path="/community/events"><ProtectedRoute><ConfigRoute route="/community/events" /></ProtectedRoute></Route>
      <Route path="/community/stories"><ProtectedRoute><ConfigRoute route="/community/stories" /></ProtectedRoute></Route>
      <Route path="/community/mentors"><ProtectedRoute><ConfigRoute route="/community/mentors" /></ProtectedRoute></Route>
      <Route path="/community/challenges"><ProtectedRoute><ConfigRoute route="/community/challenges" /></ProtectedRoute></Route>
      <Route path="/community-guidelines"><CommunityGuidelines /></Route>
    </>
  );
}
