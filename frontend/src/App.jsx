import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Result from "./pages/Result";
import { Toaster } from "react-hot-toast";
import ResetPassword from "./components/ResetPassword";
import Login from "./components/Login";
import LoadingScreen from "./components/LoadingScreen";

import PrivateRoute from "./pages/PrivateRoute";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

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

  if (
    isLoading &&
    location.pathname === "/" &&
    !sessionStorage.getItem("hasLoaded")
  ) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Toaster />
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
