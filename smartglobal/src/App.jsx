import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import Footer from "./components/Footer";
import ContactUs from "./pages/ContactUs";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
