"use client";

import { useState } from "react";
import TunnelBackground from "@/components/TunnelBackground";
import Loader from "@/components/Loader";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [loaderUnmounted, setLoaderUnmounted] = useState(false);

  const handleComplete = () => {
    setLoadingComplete(true);
    // Unmount loader completely after the 1.8s flash animation finishes
    setTimeout(() => {
      setLoaderUnmounted(true);
    }, 2000);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <TunnelBackground />
      {!loaderUnmounted && <Loader onComplete={handleComplete} />}
      <Hero show={loadingComplete} />
      {loadingComplete && <Footer />}
      <ThemeToggle />
    </div>
  );
}
