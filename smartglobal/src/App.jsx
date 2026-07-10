import React, { useEffect } from "react";
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
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isAuth = location.pathname === "/auth";

  // React Router doesn't scroll to top on navigation by default — without
  // this, clicking a link from partway down one page lands you partway
  // down the next page too (e.g. Hero/Recipes CTAs, related-recipe links).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
        <Route path="/recipes/:slug" element={<RecipeDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
      {!isDashboard && !isAuth && <Footer />}
    </>
  );
}

export default App;
