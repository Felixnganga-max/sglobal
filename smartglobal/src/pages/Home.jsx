import React from "react";
import HeroBanner from "../components/home/HeroBanner";
import PromoStrip from "../components/home/PromoStrip";
import Sales from "../components/Sales";
import BestDeals from "../components/home/BestDeals";
import DiscountBanners from "../components/home/DiscountBanners";
import TrendingThisWeek from "../components/home/TrendingThisWeek";
import RecommendedForYou from "../components/home/RecommendedForYou";
import Recipes from "../components/Recipes";
import CertStrip from "../components/home/CertStrip";
import Newsletter from "../components/home/Newsletter";
import Contact from "../components/Contact";

const Home = () => {
  return (
    <div>
      <HeroBanner />
      <PromoStrip />
      <Sales />
      <BestDeals />
      <DiscountBanners />
      <TrendingThisWeek />
      <RecommendedForYou />
      <Recipes />
      <CertStrip />
      <Newsletter />
      <Contact />
    </div>
  );
};

export default Home;
