/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { StoreProvider } from "@/context/StoreContext";
import { Layout } from "@/components/Layout";
import MoodPage from "@/pages/MoodPage";
import RoutinePage from "@/pages/RoutinePage";
import EventsPage from "@/pages/EventsPage";
import HealthPage from "@/pages/HealthPage";
import ProfilePage from "@/pages/ProfilePage";
import OnboardingPage from "@/pages/OnboardingPage";

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/mood" replace />} />
            <Route path="mood" element={<MoodPage />} />
            <Route path="routine" element={<RoutinePage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="health" element={<HealthPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="onboarding" element={<OnboardingPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
