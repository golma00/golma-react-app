import React from "react";
export const PageContext = React.createContext();

export const usePage = () => {
  const [onActivePage, ] = React.useContext(PageContext);

  return {onActivePage};
}