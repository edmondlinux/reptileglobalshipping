"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/layout/navbar";
import "../lib/i18n";

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold">Welcome to RapidWave Logistics</h1>
        <p className="mt-4">Fast & Reliable Shipping Solutions</p>
      </div>
    </>
  );
}