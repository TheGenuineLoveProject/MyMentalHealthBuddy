import React from "react";
import { Route } from "react-router-dom";

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
      <Route path="/community" element={<CommunityHub />} />
      <Route path="/community/feed" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
      <Route path="/community/circle" element={<ProtectedRoute><CommunityCircle /></ProtectedRoute>} />
      <Route path="/community/discussion/:id" element={<ProtectedRoute><DiscussionPage /></ProtectedRoute>} />
      <Route path="/community/events" element={<ProtectedRoute><ConfigRoute route="/community/events" /></ProtectedRoute>} />
      <Route path="/community/stories" element={<ProtectedRoute><ConfigRoute route="/community/stories" /></ProtectedRoute>} />
      <Route path="/community/mentors" element={<ProtectedRoute><ConfigRoute route="/community/mentors" /></ProtectedRoute>} />
      <Route path="/community/challenges" element={<ProtectedRoute><ConfigRoute route="/community/challenges" /></ProtectedRoute>} />
      <Route path="/community-guidelines" element={<CommunityGuidelines />} />
    </>
  );
}
