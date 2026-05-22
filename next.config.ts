import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Wrap route navigations in a browser View Transition so the tab
    // switch can crossfade — see the `tab` transition rules in
    // app/globals.css and `transitionTypes` on the tabs in AppShell.
    viewTransition: true,
  },
};

export default nextConfig;
