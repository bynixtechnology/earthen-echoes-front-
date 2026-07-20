import React, {
  useEffect,
  useState,
} from "react";

import {
  Loader2,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import axiosInstance from "../../../config/axiosInstance";

import {
  API_ENDPOINTS,
} from "../../../constants/apiEndpoints";


const Categories = () => {

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);


  useEffect(() => {

    const fetchCategories =
      async () => {

        try {

          setIsLoading(true);

          const response =
            await axiosInstance.get(
              API_ENDPOINTS.CATEGORY.GET_ALL
            );

          const fetchedData =
            response?.data?.data ||
            response?.data ||
            [];

          setCategories(
            Array.isArray(fetchedData)
              ? fetchedData
              : []
          );

        } catch (error) {

          console.error(
            "Failed to fetch categories:",
            error
          );

          setCategories([]);

        } finally {

          setIsLoading(false);

        }

      };


    fetchCategories();

  }, []);


  return (

    <section
      className="
        py-20
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
      "
    >

      {/* Heading */}

      <div
        className="
          text-center
          max-w-xl
          mx-auto
          mb-16
        "
      >

        <h2
          className="
            text-3xl
            sm:text-4xl
            font-heading
            font-bold
            mb-4
          "
        >
          Shop by Category
        </h2>

        <p className="text-muted-foreground">
          Every piece is hand-molded and sun-dried
          in Rajasthan, capturing the authentic
          warmth of traditional Indian clay.
        </p>

        <div
          className="
            w-16
            h-1
            bg-primary
            mx-auto
            mt-4
          "
        />

      </div>


      {/* Loading */}

      {isLoading ? (

        <div
          className="
            flex
            justify-center
            items-center
            py-20
            min-h-[300px]
          "
        >

          <Loader2
            className="
              w-10
              h-10
              animate-spin
              text-amber-700
            "
          />

        </div>

      ) : categories.length === 0 ? (

        <div
          className="
            text-center
            text-gray-500
            py-10
            font-medium
          "
        >
          No categories found right now.
        </div>

      ) : (

        <div
          className="
            grid
            grid-cols-2
            gap-5
            md:grid-cols-3
            xl:grid-cols-4
          "
        >

          {categories.map(
            (item, index) => (

              <Link

                key={
                  item._id || index
                }

                /*
                |--------------------------------------------------------------------------
                | IMPORTANT
                |--------------------------------------------------------------------------
                | Category ID query parameter me send hoga
                */

                to={`/products?category=${encodeURIComponent(
                  item._id
                )}`}

                className="
                  group
                  relative
                  aspect-square
                  rounded-xl
                  overflow-hidden
                  shadow-sm
                  hover:shadow-xl
                  transition-all
                  duration-300
                "
              >

                {/* Image */}

                <div
                  className="
                    aspect-square
                    overflow-hidden
                    bg-slate-100
                  "
                >

                  <img

                    src={
                      item.image ||
                      item.imageUrl ||
                      "/placeholder.png"
                    }

                    alt={
                      item.name ||
                      item.title ||
                      "Category"
                    }

                    className="
                      w-full
                      h-full
                      object-cover
                      group-hover:scale-110
                      transition-transform
                      duration-500
                    "
                  />

                </div>


                {/* Overlay */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/80
                    via-black/20
                    to-transparent
                  "
                />


                {/* Content */}

                <div
                  className="
                    absolute
                    bottom-4
                    left-4
                    right-4
                    text-white
                  "
                >

                  <span
                    className="
                      text-xs
                      uppercase
                      tracking-widest
                      text-white/90
                      mb-1
                      block
                      truncate
                    "
                  >

                    {item.title ||
                      "Traditional Series"}

                  </span>


                  <h6
                    className="
                      font-heading
                      text-lg
                      font-bold
                      truncate
                    "
                  >

                    {item.name ||
                      item.title}

                  </h6>

                </div>


                <div
                  className="
                    absolute
                    inset-0
                    rounded-xl
                    border
                    border-white/10
                    group-hover:border-white/40
                    transition-all
                  "
                />

              </Link>

            )
          )}

        </div>

      )}

    </section>

  );

};


export default Categories;