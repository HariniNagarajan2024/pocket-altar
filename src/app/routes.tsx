import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { MagicalLoader } from "./components/MagicalLoader";
import { AppShell } from "./components/layout/AppShell";
import Splash from "./screens/Splash";

const Onboarding = lazy(() => import("./screens/Onboarding"));
const Homepage = lazy(() => import("./screens/Homepage"));
const SpellDetail = lazy(() => import("./screens/SpellDetail"));
const RitualMode = lazy(() => import("./screens/RitualMode"));
const SigilGeneration = lazy(() => import("./screens/SigilGeneration"));
const SpellCompletion = lazy(() => import("./screens/SpellCompletion"));
const CastedSpells = lazy(() => import("./screens/CastedSpells"));
const Profile = lazy(() => import("./screens/Profile"));
const DailyRituals = lazy(() => import("./screens/DailyRituals"));
const Settings = lazy(() => import("./screens/Settings"));
const Login = lazy(() => import("./screens/auth/Login"));
const SignUp = lazy(() => import("./screens/auth/SignUp"));
const ForgotPassword = lazy(() => import("./screens/auth/ForgotPassword"));
const Wallpapers = lazy(() => import("./screens/Wallpapers"));
const RitualsCatalog = lazy(() => import("./screens/RitualsCatalog"));

function LazyScreen({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<MagicalLoader fullScreen />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <LazyScreen>
        <Splash />
      </LazyScreen>
    ),
  },
  {
    path: "/login",
    element: (
      <LazyScreen>
        <Login />
      </LazyScreen>
    ),
  },
  {
    path: "/signup",
    element: (
      <LazyScreen>
        <SignUp />
      </LazyScreen>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <LazyScreen>
        <ForgotPassword />
      </LazyScreen>
    ),
  },
  {
    path: "/onboarding",
    element: (
      <LazyScreen>
        <Onboarding />
      </LazyScreen>
    ),
  },
  {
    path: "/ritual/:id",
    element: (
      <LazyScreen>
        <RitualMode />
      </LazyScreen>
    ),
  },
  {
    path: "/sigil",
    element: (
      <LazyScreen>
        <SigilGeneration />
      </LazyScreen>
    ),
  },
  {
    path: "/completion",
    element: (
      <LazyScreen>
        <SpellCompletion />
      </LazyScreen>
    ),
  },
  {
    Component: AppShell,
    children: [
      {
        path: "/home",
        element: (
          <LazyScreen>
            <Homepage />
          </LazyScreen>
        ),
      },
      {
        path: "/rituals",
        element: (
          <LazyScreen>
            <RitualsCatalog />
          </LazyScreen>
        ),
      },
      {
        path: "/spell/:id",
        element: (
          <LazyScreen>
            <SpellDetail />
          </LazyScreen>
        ),
      },
      {
        path: "/archive",
        element: (
          <LazyScreen>
            <CastedSpells />
          </LazyScreen>
        ),
      },
      {
        path: "/wallpapers",
        element: (
          <LazyScreen>
            <Wallpapers />
          </LazyScreen>
        ),
      },
      {
        path: "/profile",
        element: (
          <LazyScreen>
            <Profile />
          </LazyScreen>
        ),
      },
      {
        path: "/daily",
        element: (
          <LazyScreen>
            <DailyRituals />
          </LazyScreen>
        ),
      },
      {
        path: "/settings",
        element: (
          <LazyScreen>
            <Settings />
          </LazyScreen>
        ),
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
