import { createContext, useState, useContext } from "react";

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const toggleSidebarCollapse = () => setIsSidebarCollapsed((prev) => !prev);

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupUser, setPopupUser] = useState(null);
  const showUserProfile = (user) => {
    setPopupUser(user);
    setIsPopupVisible(true);
  };
  const closeUserProfile = () => setIsPopupVisible(false);

  const value = {
    isSidebarVisible,
    toggleSidebar,
    searchQuery,
    handleSearchChange,
    isPopupVisible,
    popupUser,
    isSidebarCollapsed,
    toggleSidebarCollapse,
    showUserProfile,
    closeUserProfile,
  };

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
