import { Navigate } from "react-router-dom";
import { hasSeenOnboardingInCurrentTab } from "../lib/onboardingSession";

const EntryPage = () => {
  const hasSeen = hasSeenOnboardingInCurrentTab();

  return <Navigate to={hasSeen ? "/home" : "/onboarding"} replace />;
};

export default EntryPage;
