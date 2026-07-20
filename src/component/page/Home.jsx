import React from 'react'
import Header from '../common/Header'
import HeroSection from '../core/HomePage/HeroSection'
import Categories from '../core/HomePage/Categories'
import BestSeller from '../core/HomePage/BestSeller'
import WhyChoose from '../core/HomePage/WhyChoose'
import Craftsmanship from '../core/HomePage/Craftsmanship'
import CustomerReviews from '../core/HomePage/CustomerReviews'
import Gallery from '../core/HomePage/Gallery'
import Newsletter from '../core/HomePage/Newsletter'
import Footer from '../common/Footer'

const Home = () => {
  return (
     <>
     

      {/* Hero */}
      <HeroSection />

      {/* Categories */}
      <Categories />

      {/* Best Sellers */}
      <BestSeller />

      {/* Why Choose */}
      <WhyChoose />

      {/* Craftsmanship */}
      <Craftsmanship />

      {/* Customer Reviews */}
      <CustomerReviews />

      {/* Gallery */}
      <Gallery />

      {/* Newsletter */}
      <Newsletter />

     

     
    </>
  )
}

export default Home