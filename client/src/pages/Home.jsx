import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import FeaturedDestination from "../components/FeaturedDestination";
import ExclusiveOffers from "../components/ExclusiveOffers";
import Testimonial from "../components/Testimonial";
import NewsLetter from "../components/NewsLetter";


const Home = () => {
  return (
    <>
      <Hero />    
      <FeaturedDestination/>
      <Testimonial/>
      <NewsLetter/>
    </>
  );
};

export default Home;
