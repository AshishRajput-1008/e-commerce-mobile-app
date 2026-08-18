import { Redirect } from "expo-router";

// Entry point — routes straight into the tab navigator.
// Swap this for an auth-gate redirect (to "/(auth)/login") once you want
// to require sign-in before browsing.
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
