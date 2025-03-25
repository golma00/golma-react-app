import React from "react";
export const MenuAuthContext = React.createContext();

export const useMenuAuth = () => {
  const [menuProps] = React.useContext(MenuAuthContext);

  return {menuProps};
}