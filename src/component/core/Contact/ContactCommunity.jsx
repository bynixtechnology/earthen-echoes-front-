import React from "react";
import {
  Image,
  ThumbsUp,
  Bookmark,
  PhoneCall,
} from "lucide-react";

const socialLinks = [
  {
    id: 1,
    title: "Instagram",
    href: "#",
    icon: Image,
  },
  {
    id: 2,
    title: "Facebook",
    href: "#",
    icon: ThumbsUp,
  },
  {
    id: 3,
    title: "Pinterest",
    href: "#",
    icon: Bookmark,
  },
  {
    id: 4,
    title: "WhatsApp",
    href: "https://wa.me/919876543210",
    icon: PhoneCall,
  },
];

const ContactCommunity = () => {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-heading font-bold">
          Connect With Our Heritage Community
        </h2>

        {/* Description */}
        <p className="mt-4 text-sm md:text-base text-primary-foreground/80 max-w-xl mx-auto leading-relaxed">
          Stay updated with daily artisan wheel-throwing videos, live kiln
          firings, and interior design inspiration.
        </p>

        {/* Social Icons */}
        <div className="mt-10 flex items-center justify-center gap-5 flex-wrap">
          {socialLinks.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.id}
                href={item.href}
                target={item.title === "WhatsApp" ? "_blank" : "_self"}
                rel="noopener noreferrer"
                title={item.title}
                className="w-12 h-12 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center text-primary-foreground transition-all duration-300 hover:scale-110 hover:shadow-xl"
              >
                <Icon size={20} strokeWidth={2.2} />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactCommunity;