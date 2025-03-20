import React from "react";
export const TabNavigateContext = React.createContext();

export const useTabNavigate = () => {
  const [tabs, addTab, removeTab, setCurrentTab, findMenuByPath, menuData] = React.useContext(TabNavigateContext);

  return {tabs, addTab, removeTab, setCurrentTab, findMenuByPath, menuData};
}