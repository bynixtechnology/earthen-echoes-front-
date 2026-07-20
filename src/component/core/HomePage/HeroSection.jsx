import { ArrowRight, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
   <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
  <div className="absolute inset-0">
    <img
      src="https://uxmagic.blob.core.windows.net/public/agent-images/hero-banner-1783060832865-za7ect3yr5n.png"
      alt="Earthen Echoes Terracotta Living Room Banner"
      className="w-full h-full object-cover transform scale-105 transition-transform duration-1000"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-primary/65 via-primary/45 to-transparent" />
  </div>
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-primary-foreground z-10">
    <div className="max-w-2xl space-y-6">
      <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-primary/30">
        <iconify-icon icon="lucide:sparkles" className="text-primary text-sm" />
        <span className="text-xs uppercase tracking-widest font-semibold text-primary-foreground">
          Jaipur Heritage Collection
        </span>
      </div>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight drop-shadow-sm">
        Bring Nature Home with Handcrafted Terracotta Elegance
      </h1>
      <p className="text-base sm:text-lg text-primary-foreground/90 font-sans leading-relaxed">
        Discover beautifully handcrafted pottery, planters, urlis, décor
        accents, and gifting collections made by skilled Indian artisans.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Link
          to="/products"
          className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg shadow-lg hover:bg-primary/90 transition-all transform hover:-translate-y-0.5 text-center"
        >
          Shop Collection
          <iconify-icon icon="lucide:arrow-right" className="ml-2 text-lg" />
        </Link>
       
      </div>
    </div>
  </div>
</section>

  );
};

export default HeroSection;