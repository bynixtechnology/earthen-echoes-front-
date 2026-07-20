import React from "react";
import { FaInstagram } from "react-icons/fa";

const galleryImages = [
    {
        id: 1,
        image:
            "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80",
        alt: "Instagram Post 1",
    },
    {
        id: 2,
        image:
            "https://images.unsplash.com/photo-1530251173308-fb744d081b23?auto=format&fit=crop&w=400&q=80",
        alt: "Instagram Post 2",
    },
    {
        id: 3,
        image:
            "https://uxmagic.blob.core.windows.net/public/agent-images/product-terracotta-1783060850121-p5722vebyj9.png",
        alt: "Instagram Post 3",
    },
    {
        id: 4,
        image:
            "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80",
        alt: "Instagram Post 4",
    },
];

const Gallery = () => {
    return (
        <section className="py-20 bg-muted/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-xl mx-auto mb-12">
                    <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-2">
                        Earthen Living on Instagram
                    </h2>

                    <p className="text-muted-foreground">
                        Follow our journey and share your moments with{" "}
                        <strong className="text-primary">#EarthenEchoes</strong>
                    </p>
                </div>

                {/* Instagram Masonry Grid */}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleryImages.map((item) => (
                        <div
                            key={item.id}
                            className="group relative overflow-hidden rounded-xl aspect-square"
                        >
                            <img
                                src={item.image}
                                alt={item.alt}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-primary/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <FaInstagram
                                    size={40}
                                    className="text-white"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;