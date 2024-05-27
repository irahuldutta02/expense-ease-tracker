import { createContext, useState } from "react";

export const ThemeContext = createContext();
export const ConfirmationModelContext = createContext();

export const ContextProvider = ({ children }) => {
  const getThemeFromLocalStorage = localStorage.getItem("theme");
  if (getThemeFromLocalStorage === null) {
    localStorage.setItem("theme", "dark");
  }
  const [theme, setTheme] = useState(getThemeFromLocalStorage || "dark");
  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      localStorage.setItem("theme", "light");
    } else {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  const [confirmationModel, setConfirmationModel] = useState(false);
  const [confirmationModelData, setConfirmationModelData] = useState(null);

  const openConfirmationModel = (
    data = {
      question: "Are you sure ?",
      answer: ["Yes", "No"],
    }
  ) => {
    setConfirmationModelData(data);
    setConfirmationModel(true);
  };

  const closeConfirmationModel = () => {
    setConfirmationModelData({
      question: "Are you sure ?",
      answer: ["Yes", "No"],
    });
    setConfirmationModel(false);
  };

  return (
    <>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <ConfirmationModelContext.Provider
          value={{
            confirmationModel,
            confirmationModelData,
            openConfirmationModel,
            closeConfirmationModel,
          }}
        >
          {children}
        </ConfirmationModelContext.Provider>
      </ThemeContext.Provider>
    </>
  );
};
