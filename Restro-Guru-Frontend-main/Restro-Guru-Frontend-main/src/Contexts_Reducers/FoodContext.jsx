import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create a context
const FoodContext = createContext();

// Create a provider component
export const FoodProvider = ({ children }) => {
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/getAllfoods`);
        setFoodItems(response.data);
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
    };

    fetchFoodItems();
  }, []);

  return (
    <FoodContext.Provider value={{ foodItems, setFoodItems }}>
      {children}
    </FoodContext.Provider>
  );
};

// Create a custom hook for easier context consumption
export const useFood = () => useContext(FoodContext);
