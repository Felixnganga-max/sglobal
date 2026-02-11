import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import Footer from "./components/Footer";
import ContactUs from "./pages/ContactUs";
import Blogs from "./pages/Blogs";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <>
      {!isDashboard && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path ="/auth" element={<Login /> } />
      </Routes>
      {!isDashboard && <Footer />}
    </>
  );
}

export default App;
