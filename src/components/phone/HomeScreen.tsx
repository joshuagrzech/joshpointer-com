import React from "react";
import { motion } from "framer-motion";
import StatusBar from "@/components/phone/StatusBar";
import AppGrid from "@/components/phone/AppGrid";
import Widget from "@/components/phone/Widget";
import type { AppOpenProps } from "@/types";

const HomeScreen: React.FC<AppOpenProps> = ({ branding, handleAppClick, setBackgroundGradient }) => (
  <motion.div
    key="home"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <StatusBar />
    <Widget branding={branding} />
    <AppGrid handleAppClick={handleAppClick} setBackgroundGradient={setBackgroundGradient} />
  </motion.div>
);

export default HomeScreen;
