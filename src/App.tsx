import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import EntryPage from "./pages/EntryPage";
import HomePage from "./pages/HomePage";
import OnboardingPage from "./pages/OnboardingPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Routes>
    </Layout>
  );
}

export default App;