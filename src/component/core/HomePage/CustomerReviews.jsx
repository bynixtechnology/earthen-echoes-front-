import React from "react";
import { Quote, Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Aaradhya Sharma",
    role: "Interior Designer, Mumbai",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    review:
      "The Jaipur Royal Urli is a masterpiece. The finish and detailing are incredibly premium. It adds a majestic warmth to my living room entrance.",
  },
  {
    id: 2,
    name: "Devendra Rathore",
    role: "Eco-Enthusiast, Jaipur",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    review:
      "I love their sustainable packaging! Every planter arrived in perfect condition without any plastic bubbles. The craftsmanship is flawless.",
  },
  {
    id: 3,
    name: "Meera Sen",
    role: "HR Lead, Bangalore",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    review:
      "Earthen Echoes is our go-to for luxury corporate gifts. Our clients are always mesmerized by the authenticity and the rich culture of these pieces.",
  },
];

const CustomerReviews = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            Whispers of Appreciation
          </h2>

          <p className="text-muted-foreground">
            Hear from our patrons who have welcomed Earthen Echoes into their
            homes.
          </p>

          <div className="w-16 h-1 bg-primary mx-auto mt-4" />
        </div>

        {/* Reviews Grid */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card p-8 rounded-xl border border-border/40 shadow-sm relative"
            >
              <Quote
                size={40}
                className="absolute top-6 right-6 text-primary/10"
              />

              {/* Rating */}

              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={16}
                    className="fill-current"
                  />
                ))}
              </div>

              {/* Review */}

              <p className="text-muted-foreground text-sm italic leading-relaxed mb-6">
                "{review.review}"
              </p>

              {/* User */}

              <div className="flex items-center gap-3">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div>
                  <h4 className="font-heading font-bold text-sm text-foreground">
                    {review.name}
                  </h4>

                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;