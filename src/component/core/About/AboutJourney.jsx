import React from 'react'

const AboutJourney = () => {
  return (
<section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
    <div className="space-y-6">
      <h2 className="text-3xl font-heading font-bold text-foreground">
        The Journey of Earthen Echoes
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Earthen Echoes was born from a desire to bridge the gap between ancient
        heritage craftsmanship and modern luxury living. Based in Jaipur, India,
        we work directly with native pottery clusters to bring you authentic,
        premium terracotta home décor.
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Our products are made using traditional clay-molding techniques passed
        down through generations. By utilizing natural Banas riverbed clay and
        wooden-fired kilns, we ensure every piece carries the true warmth of the
        earth while promoting fully sustainable, zero-plastic lifestyles.
      </p>
      <div className="grid grid-cols-2 gap-6 pt-4">
        <div className="p-4 bg-muted/40 rounded-xl">
          <h3 className="font-heading text-lg font-bold text-primary mb-1">
            Our Mission
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            To preserve India's pottery heritage while creating beautiful,
            sustainable modern home décor.
          </p>
        </div>
        <div className="p-4 bg-muted/40 rounded-xl">
          <h3 className="font-heading text-lg font-bold text-primary mb-1">
            Our Vision
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            To become India's most loved handcrafted terracotta lifestyle brand
            across the globe.
          </p>
        </div>
      </div>
    </div>
    <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-square lg:aspect-auto lg:h-[450px]">
      <img
        src="https://uxmagic.blob.core.windows.net/public/agent-images/hero-banner-1783060832865-za7ect3yr5n.png"
        alt="Earthen Echoes Clay Pottery"
        className="w-full h-full object-cover"
      />
    </div>
  </div>
</section>

  )
}

export default AboutJourney