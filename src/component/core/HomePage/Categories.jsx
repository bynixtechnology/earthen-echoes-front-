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

// Category API Service
import {
  CategoryService,
} from "../../../services/categoryService";


const Categories = () => {

  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | Fetch Categories
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    let isMounted = true;

    const fetchCategories =
      async () => {

        try {

          setIsLoading(true);
          setError("");

          /*
          |--------------------------------------------------------------------------
          | Category Service
          |--------------------------------------------------------------------------
          */

          const response =
            await CategoryService.getAll();

         


          /*
          |--------------------------------------------------------------------------
          | Handle Different API Response Structures
          |--------------------------------------------------------------------------
          |
          | Supported:
          |
          | {
          |   success: true,
          |   data: [...]
          | }
          |
          | OR
          |
          | [...]
          |
          */

          const fetchedData =
            response?.data ??
            response ??
            [];


          if (isMounted) {

            setCategories(
              Array.isArray(fetchedData)
                ? fetchedData
                : []
            );

          }

        } catch (error) {

          console.error(
            "FETCH CATEGORIES ERROR:",
            error
          );

          if (isMounted) {

            setCategories([]);

            setError(
              error?.response?.data?.message ||
              error?.message ||
              "Unable to load categories."
            );

          }

        } finally {

          if (isMounted) {
            setIsLoading(false);
          }

        }

      };


    fetchCategories();


    /*
    |--------------------------------------------------------------------------
    | Cleanup
    |--------------------------------------------------------------------------
    */

    return () => {
      isMounted = false;
    };

  }, []);


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

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

      {/* ================================================================
          HEADING
      ================================================================= */}

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
          Every piece is hand-molded and
          sun-dried in Rajasthan, capturing
          the authentic warmth of traditional
          Indian clay.
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


      {/* ================================================================
          LOADING
      ================================================================= */}

      {isLoading ? (

        <div
          className="
            flex
            justify-center
            items-center
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

      ) : error ? (

        /* ================================================================
           ERROR
        ================================================================= */

        <div
          className="
            text-center
            py-12
          "
        >

          <p
            className="
              text-red-600
              font-medium
            "
          >
            {error}
          </p>

        </div>

      ) : categories.length === 0 ? (

        /* ================================================================
           EMPTY
        ================================================================= */

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

        /* ================================================================
           CATEGORY GRID
        ================================================================= */

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
            (item, index) => {

              /*
              |--------------------------------------------------------------------------
              | Category Data
              |--------------------------------------------------------------------------
              */

              const categoryId =
                item?._id || "";

              const categoryName =
                item?.name ||
                item?.title ||
                "Category";

              const categoryImage =
                item?.image ||
                item?.imageUrl ||
                "/placeholder.png";

              const categoryDescription =
                item?.description ||
                item?.subtitle ||
                "Traditional Series";


              return (

                <Link

                  key={
                    categoryId ||
                    index
                  }

                  /*
                  |--------------------------------------------------------------------------
                  | Category Filter URL
                  |--------------------------------------------------------------------------
                  |
                  | Example:
                  |
                  | /products?category=687abc123
                  |
                  */

                  to={
                    categoryId
                      ? `/products?category=${encodeURIComponent(
                          categoryId
                        )}`
                      : "/products"
                  }

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

                  {/* ====================================================
                      IMAGE
                  ===================================================== */}

                  <div
                    className="
                      w-full
                      h-full
                      overflow-hidden
                      bg-slate-100
                    "
                  >

                    <img

                      src={
                        categoryImage
                      }

                      alt={
                        categoryName
                      }

                      loading="lazy"

                      onError={(e) => {

                        e.currentTarget.onerror =
                          null;

                        e.currentTarget.src =
                          "/placeholder.png";

                      }}

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


                  {/* ====================================================
                      OVERLAY
                  ===================================================== */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/80
                      via-black/20
                      to-transparent
                      pointer-events-none
                    "
                  />


                  {/* ====================================================
                      CONTENT
                  ===================================================== */}

                  <div
                    className="
                      absolute
                      bottom-4
                      left-4
                      right-4
                      text-white
                      z-10
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

                      {
                        categoryDescription
                      }

                    </span>


                    <h6
                      className="
                        font-heading
                        text-lg
                        font-bold
                        truncate
                      "
                    >

                      {
                        categoryName
                      }

                    </h6>

                  </div>


                  {/* ====================================================
                      BORDER
                  ===================================================== */}

                  <div
                    className="
                      absolute
                      inset-0
                      rounded-xl
                      border
                      border-white/10
                      group-hover:border-white/40
                      transition-all
                      pointer-events-none
                    "
                  />

                </Link>

              );

            }
          )}

        </div>

      )}

    </section>

  );

};


export default Categories;