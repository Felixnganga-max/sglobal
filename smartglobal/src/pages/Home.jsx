import React from "react";
import Hero from "../components/Hero";
import Sales from "../components/Sales";
import Recipes from "../components/Recipes";
import Contact from "../components/Contact";

const Home = () => {
  return (
    <div>
      <Hero />
      <Sales />
      <Recipes />
      <Contact />
    </div>
  );
};

export default Home;
