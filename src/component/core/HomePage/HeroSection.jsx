import {
  ArrowRight,
  Leaf,
  BadgeCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#FCF7F2]">
      {/* Background Blur */}
      <div className="absolute inset-0">
        <div className="absolute left-10 top-32 h-72 w-72 rounded-full bg-orange-100 blur-[140px]" />
        <div className="absolute right-20 bottom-10 h-72 w-72 rounded-full bg-teal-100 blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT */}

          <div>

            {/* Badge */}

            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2 text-sm font-semibold text-[#F46A34]">
              <span className="h-2 w-2 rounded-full bg-[#F46A34]" />
              JAIPUR HERITAGE COLLECTION
            </div>

            {/* Heading */}

            <h1 className="mt-8 font-serif leading-none text-[#221814]">

              <span className="block text-[72px] font-semibold">
                Handcrafted
              </span>

              <span className="block text-[72px] font-semibold">
                Stories
              </span>

              <span className="block text-[72px] italic text-[#F46A34]">
                for
              </span>

              <span className="block text-[72px] italic text-[#F46A34]">
                Beautiful
              </span>

              <span className="block text-[72px] font-semibold">
                Homes
              </span>

            </h1>

            {/* Description */}

            <p className="mt-8 max-w-xl text-[20px] leading-9 text-gray-600">
              Discover beautifully hand-molded pottery, planters, urns,
              décor accents, and gifting collections from master artisans
              of traditional Indian clay.
            </p>

            {/* Buttons */}

            <div className="mt-10 flex flex-wrap gap-5">

              <Link
                to="/products"
                className="flex items-center gap-2 rounded-full bg-[#F46A34] px-8 py-4 font-semibold text-white shadow-xl transition hover:scale-105"
              >
                Shop Collection
                <ArrowRight size={20} />
              </Link>

              <Link
                to="/about"
                className="rounded-full border border-gray-300 px-8 py-4 font-semibold text-[#221814] transition hover:bg-white"
              >
                Our Story
              </Link>

            </div>

            {/* Features */}

            <div className="mt-10 flex flex-wrap gap-8 text-sm font-medium text-gray-700">

              <div className="flex items-center gap-2">
                <Sparkles
                  size={16}
                  className="text-[#F46A34]"
                />
                Handmade
              </div>

              <div className="flex items-center gap-2">
                <Leaf
                  size={16}
                  className="text-green-600"
                />
                Eco Friendly
              </div>

              <div className="flex items-center gap-2">
                <BadgeCheck
                  size={16}
                  className="text-cyan-600"
                />
                Made in India
              </div>

            </div>

            {/* Divider */}

            <div className="mt-12 border-t border-gray-200" />

            {/* Stats */}

            <div className="mt-10 grid grid-cols-3 gap-10">

              <div>
                <h2 className="text-4xl font-serif font-semibold text-[#221814]">
                  12K+
                </h2>
                <p className="mt-2 text-gray-500">
                  Happy Customers
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-serif font-semibold text-[#221814]">
                  500+
                </h2>
                <p className="mt-2 text-gray-500">
                  Products
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-serif font-semibold text-[#221814]">
                  15+
                </h2>
                <p className="mt-2 text-gray-500">
                  Years Heritage
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="relative flex justify-center">

            {/* Blob */}

            <div className="absolute right-0 top-4 h-[520px] w-[520px] rounded-full bg-pink-100 opacity-70 blur-0" />

            <div className="absolute left-6 top-20 h-28 w-28 rounded-full bg-green-200 opacity-60" />

            <div className="absolute left-10 bottom-0 h-40 w-40 rounded-full bg-cyan-200 opacity-60" />

            {/* Image */}

            <div className="relative overflow-hidden rounded-[42px] shadow-2xl">

              <img
                src="/images/hero-pottery.jpg"
                alt=""
                className="h-[560px] w-[520px] object-cover"
              />

              {/* Eco Badge */}

              <div className="absolute right-6 top-6 rounded-full bg-[#67A63B] px-6 py-3 text-white font-semibold shadow-lg">
                🌿 100% Eco Friendly
              </div>

            </div>

            {/* Floating Card */}

            <div className="absolute left-0 bottom-8 flex items-center gap-4 rounded-3xl bg-white p-5 shadow-2xl">

              <img
                src="/images/product-thumb.jpg"
                alt=""
                className="h-14 w-14 rounded-xl object-cover"
              />

              <div>

                <h3 className="font-semibold text-[#221814]">
                  Terracotta Vase
                </h3>

                <p className="text-sm text-gray-500">
                  Just restocked
                </p>

                <div className="mt-2 flex items-center gap-1 text-[#FFB800]">

                  <Star
                    fill="currentColor"
                    size={15}
                  />

                  <Star
                    fill="currentColor"
                    size={15}
                  />

                  <Star
                    fill="currentColor"
                    size={15}
                  />

                  <Star
                    fill="currentColor"
                    size={15}
                  />

                  <Star
                    fill="currentColor"
                    size={15}
                  />

                  <span className="ml-2 text-sm text-gray-500">
                    4.9 (312)
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;