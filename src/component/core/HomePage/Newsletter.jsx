import React from "react";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

const Newsletter = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast("Thank you for subscribing!");
  };

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
        {/* Icon */}
        <Mail size={40} className="mx-auto text-secondary" />

        <h2 className="text-3xl font-heading font-bold">
          Join the Earthen Circle
        </h2>

        <p className="text-primary-foreground/80 max-w-lg mx-auto text-sm">
          Subscribe to receive early access to new collections, artisan
          stories, and exclusive sustainable living tips.
        </p>

        <form
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2"
          onSubmit={handleSubmit}
        >
           <input
  type="email"
  placeholder="Your premium email address"
  required
  className="
    flex-1
    px-4
    py-3
    rounded-lg
    shadow-2xl
    border
    border-secondary
    text-foreground
    focus:outline-none
    focus:ring-2
    focus:ring-secondary
    focus:border-secondary
    text-sm
  "
/>

          <button
            type="submit"
            className="px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-all text-sm"
          >
            Subscribe Now
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;