import React from "react";

const BottomNav = ({ activeScreen, navigateTo }) => {
  const navItems = [
    { id: "dashboard", icon: "🏠", label: "Home" },
    { id: "insights", icon: "📊", label: "Stats" },
    { id: "add", icon: "+", label: "", isAddButton: true },
    { id: "tips", icon: "💡", label: "Tips" },
    { id: "more", icon: "⋯", label: "More" },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 flex justify-around items-center px-5">
      {navItems.map((item) => {
        if (item.isAddButton) {
          return (
            <div
              key={item.id}
              className="w-14 h-14 bg-blue-900 rounded-full flex items-center justify-center text-white text-2xl cursor-pointer hover:scale-110 transition-transform"
              onClick={() => navigateTo("addTransaction")}
            >
              {item.icon}
            </div>
          );
        }

        return (
          <div
            key={item.id}
            className={`flex flex-col items-center cursor-pointer transition-colors ${
              activeScreen === item.id ? "text-blue-900" : "text-gray-400"
            }`}
            onClick={() => navigateTo(item.id)}
          >
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-xs">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default BottomNav;