import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
import { HomePage } from "./components/HomePage";
import { JobSearchPage } from "./components/JobSearchPage";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "login" | "signup" | "jobsearch">("home");

  return (
    <>
      {currentPage === "signup" ? (
        <SignUpPage onSwitchToLogin={() => setCurrentPage("login")} />
      ) : currentPage === "login" ? (
        <LoginPage 
          onSwitchToSignUp={() => setCurrentPage("signup")}
          onLogin={() => setCurrentPage("jobsearch")}
        />
      ) : currentPage === "jobsearch" ? (
        <JobSearchPage />
      ) : (
        <HomePage 
          onLoginClick={() => setCurrentPage("login")}
          onSignUpClick={() => setCurrentPage("signup")}
        />
      )}
      <Toaster />
    </>
  );
}