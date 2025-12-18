import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import { Route, Routes, useLocation } from "react-router-dom";
import Result from "./pages/Result";
import { Toaster, toast } from "react-hot-toast";
import ResetPassword from "./components/ResetPassword";
import Login from "./components/Login";
import LoadingScreen from "./components/LoadingScreen";
import PrivateRoute from "./pages/PrivateRoute";
import { trackVisitor } from "./utils/trackVisitors";

let backendWarmupStarted = false;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    trackVisitor();
  }, []);


  useEffect(() => {
    if (backendWarmupStarted) return;
    backendWarmupStarted = true;

    if (sessionStorage.getItem("backend_warmed")) return;

    const toastId = toast.loading("Starting backend...");
    let resolved = false;

    const slowTimer = setTimeout(() => {
      if (!resolved) {
        toast.loading(
          "Backend is starting (cold start, may take ~1 min)...",
          { id: toastId }
        );
      }
    }, 8000);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/health`, {
      method: "GET",
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) throw new Error();

        resolved = true;
        clearTimeout(slowTimer);

        sessionStorage.setItem("backend_warmed", "true");

        toast.success("Backend connected 🚀", {
          id: toastId,
          duration: 3000,
        });
      })
      .catch(() => {
        if (resolved) return;

        resolved = true;
        clearTimeout(slowTimer);

        toast.error("Backend is offline. Please reload.", {
          id: toastId,
          duration: 5000,
        });
      });

    return () => clearTimeout(slowTimer);
  }, []);


  useEffect(() => {
    if (location.pathname === "/" && !sessionStorage.getItem("hasLoaded")) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("hasLoaded", "true");
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [location.pathname]);

  return (
    <>
      <Toaster position="top-center" />

      {isLoading &&
        location.pathname === "/" &&
        !sessionStorage.getItem("hasLoaded") && <LoadingScreen />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/generate"
          element={
            <PrivateRoute>
              <Result />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
