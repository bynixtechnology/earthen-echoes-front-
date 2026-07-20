import React from 'react'

const ProductHeroSection = () => {
    return (
        <section className="bg-muted/40 py-10 border-b border-border/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <a href="#" className="hover:text-primary transition-colors">
                        Home
                    </a>
                    <iconify-icon icon="lucide:arrow-right" className="text-[10px]" />
                    <span className="text-foreground font-medium">Catalogue</span>
                </nav>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground">
                            The Terracotta Heritage Collection
                        </h1>
                        <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                            Browse our curated range of sustainable, master-crafted pottery and
                            home accents, hand-turned and kiln-fired to perfection in Jaipur.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-muted-foreground">
                            SORT BY:
                        </span>
                        <select className="px-4 py-2.5 bg-card border border-border text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground font-semibold">
                            <option>Best Selling</option>
                            <option>Newest Arrivals</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default ProductHeroSection