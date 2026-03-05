/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { StoreProvider } from "@/context/StoreContext";
import { Layout } from "@/components/Layout";
import { InstallPrompt } from "@/components/InstallPrompt";
import MoodPage from "@/pages/MoodPage";
import WorkPage from "@/pages/WorkPage";
import EventsPage from "@/pages/EventsPage";
import HealthPage from "@/pages/HealthPage";
import ProfilePage from "@/pages/ProfilePage";
import DiaryPage from "@/pages/DiaryPage";
import SavingsPage from "@/pages/SavingsPage";
import OnboardingPage from "@/pages/OnboardingPage";

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <InstallPrompt>
              <Layout />
            </InstallPrompt>
          }>
            <Route index element={<Navigate to="/mood" replace />} />
            <Route path="mood" element={<MoodPage />} />
            <Route path="work" element={<WorkPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="health" element={<HealthPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="diary" element={<DiaryPage />} />
            <Route path="savings" element={<SavingsPage />} />
            <Route path="onboarding" element={<OnboardingPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
