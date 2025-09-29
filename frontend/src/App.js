import React, { useState } from "react";
import { motion } from "framer-motion";
import BottomNav from "./components/BottomNav";
import Welcome from "./screens/Welcome";
import Dashboard from "./screens/Dashboard";
import AddTransaction from "./screens/AddTransaction";
import Insights from "./screens/Insights";
import Tips from "./screens/Tips";
import More from "./screens/More";
import Government from "./screens/Government";
import APITest from "./components/APITest";
import BudgetScreen from "./screens/Budget";

function App() {
  const [activeScreen, setActiveScreen] = useState("welcome");

  const navigateTo = (screen) => setActiveScreen(screen);

  return (
    <div 
      className="min-h-screen p-5"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}
    >
      {/* Prototype Header */}
      <div className="text-center text-white mb-5">
        <h1 className="text-3xl font-bold mb-2">PocketPlan</h1>
        <p className="text-sm opacity-90">Smart Money Management</p>
      </div>

      {/* Phone Frame */}
      <div className="max-w-[390px] h-[844px] bg-white rounded-[30px] shadow-2xl p-5 mx-auto relative overflow-hidden">
        <motion.div
          key={activeScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {activeScreen === "apitest" && <APITest />}
          {activeScreen === "welcome" && <Welcome navigateTo={navigateTo} />}
          {activeScreen === "dashboard" && <Dashboard navigateTo={navigateTo} />}
          {activeScreen === "addTransaction" && <AddTransaction navigateTo={navigateTo} />}
          {activeScreen === "insights" && <Insights navigateTo={navigateTo} />}
          {activeScreen === "tips" && <Tips navigateTo={navigateTo} />}
          {activeScreen === "more" && <More navigateTo={navigateTo} />}
          {activeScreen === "government" && <Government navigateTo={navigateTo} />}
          {activeScreen === "budgets" && <BudgetScreen navigateTo={navigateTo} />}
        </motion.div>

        {activeScreen !== "welcome" && (
          <BottomNav activeScreen={activeScreen} navigateTo={navigateTo} />
        )}
      </div>
    </div>
  );
}

export default App;