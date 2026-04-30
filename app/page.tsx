"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// --- NEW GLOBAL UI & PHYSICS ENGINES ---
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import FabricBackground from "@/components/ui/FabricBackground";

// --- YOUR EXISTING UI HELPERS ---
import ScrollProgress from "@/components/ui/ScrollProgress";
import ScrollBar from "@/components/ui/ScrollBar";
import { BackgroundStage } from "@/components/ui/Cinematic";

// --- ALL 14 SECTIONS ---
import Hero from "@/components/sections/Hero";
import RaymondGlance from "@/components/sections/RaymondGlance";
import MacroDisconnect from "@/components/sections/MacroDisconnect";
import StructuralFlaw from "@/components/sections/StructuralFlaw";
import BlindSpot from "@/components/sections/BlindSpot";
import DormantAsset from "@/components/sections/DormantAsset";
import Catalyst from "@/components/sections/Catalyst";
import NewArchitecture from "@/components/sections/NewArchitecture";
import ValueExchange from "@/components/sections/ValueExchange";
import ModelShift from "@/components/sections/ModelShift";
import Defensibility from "@/components/sections/Defensibility";
import MarketImpact from "@/components/sections/MarketImpact";
import UnfairAdvantage from "@/components/sections/UnfairAdvantage";
import Closing from "@/components/sections/Closing";
import SmoothScroll from "@/components/ui/SmoothScroll";
import StitchedRail from "@/components/ui/StitchedRail";
import NeedleCursor from "@/components/ui/NeedleCursor";
import ClothBackground from "@/components/ui/ClothBackground";
import Preloader from "@/components/ui/Preloader";

export default function Page() {
  useEffect(() => {
    // Register GSAP globally on client-side load
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  return (
    <>
      <Preloader />
      <SmoothScroll />
      <ClothBackground />
      <StitchedRail />
      <NeedleCursor />

      <main className="relative">
        <Hero />
        <RaymondGlance />
        <MacroDisconnect />
        <StructuralFlaw />
        <BlindSpot />
        <DormantAsset />
        <Catalyst />
        <NewArchitecture />
        <ValueExchange />
        <ModelShift />
        <Defensibility />
        <MarketImpact />
        <UnfairAdvantage />
        <Closing />
      </main>
    </SmoothScroll>
  );
}