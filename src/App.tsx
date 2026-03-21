/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { StoreProvider, useStore } from "@/context/StoreContext";
import { useEffect } from "react";
import { format } from "date-fns";
import { Layout } from "@/components/Layout";
import { MooderiaGatekeeper } from "@/components/MooderiaGatekeeper";
import MapPage from "@/pages/MapPage";
import MoodPage from "@/pages/MoodPage";
import WorkPage from "@/pages/WorkPage";
import EventsPage from "@/pages/EventsPage";
import HealthPage from "@/pages/HealthPage";
import ProfilePage from "@/pages/ProfilePage";
import DiaryPage from "@/pages/DiaryPage";
import SavingsPage from "@/pages/SavingsPage";
import OnboardingPage from "@/pages/OnboardingPage";
import ArchivePage from "@/pages/ArchivePage";
import CitizenHome from "@/pages/CitizenHome";
import GlobalPage from "@/pages/GlobalPage";
import MarketPage from "@/pages/MarketPage";
import ShareReceiverPage from "@/pages/ShareReceiverPage";
import SchoolPage from "@/pages/SchoolPage";

function UsageTracker() {
  const { dispatch } = useStore();
  
  useEffect(() => {
    const interval = setInterval(() => {
      const today = format(new Date(), 'yyyy-MM-dd');
      dispatch({ type: "UPDATE_DAILY_USAGE", payload: { date: today, seconds: 10 } });
    }, 10000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
}

export default function App() {
  return (
    <StoreProvider>
      <UsageTracker />
      <BrowserRouter>
        <Routes>
          <Route path="/share" element={<ShareReceiverPage />} />
          <Route path="/" element={
            <MooderiaGatekeeper>
              <Layout />
            </MooderiaGatekeeper>
          }>
            <Route index element={<MapPage />} />
            <Route path="mood" element={<MoodPage />} />
            <Route path="work" element={<WorkPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="health" element={<HealthPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="diary" element={<DiaryPage />} />
            <Route path="savings" element={<SavingsPage />} />
            <Route path="archive" element={<ArchivePage />} />
            <Route path="market" element={<MarketPage />} />
            <Route path="school" element={<SchoolPage />} />
            <Route path="home" element={<CitizenHome />} />
            <Route path="global" element={<GlobalPage />} />
            <Route path="onboarding" element={<OnboardingPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
