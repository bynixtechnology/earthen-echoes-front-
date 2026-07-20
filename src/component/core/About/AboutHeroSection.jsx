import React from 'react'

const AboutHeroSection = () => {
  return (
    <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
  <div className="absolute inset-0">
    <img
      src="https://uxmagic.blob.core.windows.net/public/agent-images/artisan-craft-1783060841778-xbzpiwajcvf.png"
      alt="Earthen Echoes Story Banner"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/50 to-transparent" />
  </div>
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-primary-foreground z-10 text-center">
    <div className="max-w-3xl mx-auto space-y-4">
      <span className="text-xs uppercase tracking-widest font-semibold text-primary-foreground bg-primary/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-primary/30">
        Our Story
      </span>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold drop-shadow-sm">
        Every Piece Tells a Story
      </h1>
      <p className="text-sm sm:text-base text-primary-foreground/90 max-w-xl mx-auto leading-relaxed">
        From the sacred soil of Rajasthan to your modern home sanctuary.
      </p>
    </div>
  </div>
</section>

  )
}

export default AboutHeroSection