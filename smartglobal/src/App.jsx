import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Footer from "./components/Footer";
import ContactUs from "./pages/ContactUs";
import Blogs from "./pages/Blogs";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import About from "./pages/About";

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isAuth = location.pathname === "/auth";

  return (
    <>
      {!isDashboard && !isAuth && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<Login />} />
        <Route path="/about" element={<About />} />
      </Routes>
      {!isDashboard && !isAuth && <Footer />}
    </>
  );
}

export default App;
