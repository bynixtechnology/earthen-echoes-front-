
import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import {
  Upload,
  X,
  Loader2,
  ArrowLeft,
} from "lucide-react";

import {
  fetchCategories,
} from "../../../redux/thunks/categoryThunk";

import {
  createProduct,
} from "../../../redux/thunks/productThunk";

import {
  selectCategories,
  selectCategoriesLoading,
} from "../../../redux/slices/categorySlice";

import {
  selectProductActionLoading,
} from "../../../redux/slices/productSlice";

import {
  showToast,
} from "../../../config/toast";


export default function AddProduct() {

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();


  /*
  |--------------------------------------------------------------------------
  | Redux State
  |--------------------------------------------------------------------------
  */

  const categories =
    useSelector(
      selectCategories
    );

  const loadingCategories =
    useSelector(
      selectCategoriesLoading
    );

  const loading =
    useSelector(
      selectProductActionLoading
    );


  /*
  |--------------------------------------------------------------------------
  | Local State
  |--------------------------------------------------------------------------
  */

  const [
    images,
    setImages,
  ] = useState([]);


  const [
    formData,
    setFormData,
  ] = useState({

    id: "",

    title: "",

    collectionName: "",

    category: "",

    sku: "",

    description: "",

    longDescription: "",

    longDescription1: "",

    price: "",

    originalPrice: "",

    discountPercentage: "",

    stock: "",

    dimensions: "",

    weight: "",

    composition: "",

    placement: "",

    finish: "",

    suggestedProducts: [],

    isActive: false,

  });


  /*
  |--------------------------------------------------------------------------
  | Fetch Categories
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    dispatch(
      fetchCategories()
    );

  }, [dispatch]);


  /*
  |--------------------------------------------------------------------------
  | Input Change
  |--------------------------------------------------------------------------
  */

  const handleInputChange = (
    e
  ) => {

    const {
      name,
      value,
    } = e.target;


    /*
    |--------------------------------------------------------------------------
    | Convert isActive To Boolean
    |--------------------------------------------------------------------------
    */

    if (
      name === "isActive"
    ) {

      setFormData(
        (prev) => ({
          ...prev,

          isActive:
            value === "true",
        })
      );

      return;

    }


    setFormData(
      (prev) => ({
        ...prev,

        [name]: value,
      })
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Image Selection
  |--------------------------------------------------------------------------
  */

  const handleFileChange = (
    e
  ) => {

    const files =
      Array.from(
        e.target.files ||
        []
      );


    if (
      images.length +
      files.length >
      5
    ) {

      showToast.error(
        "Maximum 5 images are allowed."
      );

      e.target.value = "";

      return;

    }


    setImages(
      (prev) => [
        ...prev,
        ...files,
      ]
    );


    /*
    |--------------------------------------------------------------------------
    | Allow Same File Selection Again
    |--------------------------------------------------------------------------
    */

    e.target.value = "";

  };


  /*
  |--------------------------------------------------------------------------
  | Remove Image
  |--------------------------------------------------------------------------
  */

  const removeImage = (
    index
  ) => {

    setImages(
      (prev) =>
        prev.filter(
          (
            _,
            currentIndex
          ) =>
            currentIndex !==
            index
        )
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Submit Product
  |--------------------------------------------------------------------------
  */

  const handleSubmit =
    async (e) => {

      e.preventDefault();


      if (loading) {
        return;
      }


      /*
      |--------------------------------------------------------------------------
      | Category Validation
      |--------------------------------------------------------------------------
      */

      if (
        !formData.category
      ) {

        showToast.error(
          "Please select a valid category."
        );

        return;

      }


      /*
      |--------------------------------------------------------------------------
      | Image Validation
      |--------------------------------------------------------------------------
      */

      if (
        images.length > 5
      ) {

        showToast.error(
          "Maximum 5 images are allowed."
        );

        return;

      }


      /*
      |--------------------------------------------------------------------------
      | Create Multipart FormData
      |--------------------------------------------------------------------------
      */

      const data =
        new FormData();


      /*
      |--------------------------------------------------------------------------
      | Basic Product Fields
      |--------------------------------------------------------------------------
      */

      const baseFields = [

        "id",

        "title",

        "collectionName",

        "category",

        "sku",

        "description",

        "longDescription",

        "longDescription1",

        "price",

        "originalPrice",

        "discountPercentage",

        "stock",

      ];


      baseFields.forEach(
        (key) => {

          const value =
            formData[key];


          if (
            value !== "" &&
            value !== null &&
            value !== undefined
          ) {

            data.append(
              key,
              value
            );

          }

        }
      );


      /*
      |--------------------------------------------------------------------------
      | Specifications Object
      |--------------------------------------------------------------------------
      */

      const specifications = {

        dimensions:
          formData.dimensions,

        weight:
          formData.weight,

        composition:
          formData.composition,

        placement:
          formData.placement,

        finish:
          formData.finish,

      };


      data.append(
        "specifications",

        JSON.stringify(
          specifications
        )
      );


      /*
      |--------------------------------------------------------------------------
      | Product Status
      |--------------------------------------------------------------------------
      */

      data.append(
        "isActive",

        String(
          formData.isActive
        )
      );


      /*
      |--------------------------------------------------------------------------
      | Suggested Products
      |--------------------------------------------------------------------------
      */

      if (
        formData
          .suggestedProducts
          ?.length
      ) {

        data.append(

          "suggestedProducts",

          JSON.stringify(
            formData
              .suggestedProducts
          )

        );

      }


      /*
      |--------------------------------------------------------------------------
      | Images
      |--------------------------------------------------------------------------
      */

      images.forEach(
        (image) => {

          data.append(
            "images",
            image
          );

        }
      );


      /*
      |--------------------------------------------------------------------------
      | Dispatch Create Product
      |--------------------------------------------------------------------------
      */

      try {

        const response =
          await dispatch(
            createProduct(data)
          ).unwrap();


        showToast.success(

          response?.message ||

          "Product created successfully."

        );


        navigate(
          "/admin/dashboard",
          {
            replace: true,
          }
        );

      } catch (error) {

        console.error(
          "CREATE PRODUCT ERROR:",
          error
        );


        showToast.error(

          typeof error ===
            "string"

            ? error

            : error?.message ||

            "Failed to create product."

        );

      }

    };


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (

    <div
      className="
        max-w-6xl
        mx-auto
        w-full
        space-y-6
        pb-16
      "
    >

      {/* ================================================================
          HEADER
      ================================================================= */}

      <div
        className="
          flex
          items-center
          gap-3
        "
      >

        <button

          type="button"

          onClick={() =>
            navigate(
              "/admin/dashboard"
            )
          }

          className="
            p-2
            bg-white
            border
            border-slate-200
            rounded-xl
            hover:bg-slate-100
            transition
            shadow-sm
            text-slate-600
          "
        >

          <ArrowLeft
            size={18}
          />

        </button>


        <div>

          <h2
            className="
              text-2xl
              font-bold
              text-slate-800
              tracking-tight
            "
          >

            Add New Product

          </h2>


          <p
            className="
              text-xs
              text-slate-500
              mt-0.5
              font-medium
            "
          >

            Create and publish a new
            Earthen Echoes product.

          </p>

        </div>

      </div>


      {/* ================================================================
          FORM
      ================================================================= */}

      <form

        onSubmit={
          handleSubmit
        }

        className="
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-6
        "
      >

        {/* ==============================================================
            LEFT SIDE
        =============================================================== */}

        <div
          className="
            lg:col-span-2
            space-y-6
          "
        >

          {/* ============================================================
              CORE INFORMATION
          ============================================================= */}

          <div
            className="
              bg-white
              rounded-2xl
              border
              border-slate-200
              shadow-sm
              p-4
              sm:p-6
              space-y-4
            "
          >

            <h3
              className="
                text-sm
                sm:text-base
                font-bold
                text-slate-800
                border-b
                pb-2
              "
            >

              1. Core Information

            </h3>


            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-3
                gap-4
              "
            >

              {/* ID */}

              <div>

                <label className="form-label">

                  Numerical ID

                </label>


                <input

                  type="number"

                  required

                  name="id"

                  value={
                    formData.id
                  }

                  onChange={
                    handleInputChange
                  }

                  placeholder="101"

                  className="
                    w-full
                    px-3.5
                    py-2.5
                    bg-slate-50
                    border
                    border-slate-200
                    rounded-xl
                    text-sm
                    focus:border-slate-950
                    focus:outline-none
                  "

                />

              </div>


              {/* TITLE */}

              <div
                className="
                  sm:col-span-2
                "
              >

                <label className="form-label">

                  Product Title

                </label>


                <input

                  type="text"

                  required

                  name="title"

                  value={
                    formData.title
                  }

                  onChange={
                    handleInputChange
                  }

                  placeholder="Clay Pitcher"

                  className="
                    w-full
                    px-3.5
                    py-2.5
                    bg-slate-50
                    border
                    border-slate-200
                    rounded-xl
                    text-sm
                    focus:border-slate-950
                    focus:outline-none
                  "

                />

              </div>

            </div>


            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-4
                gap-4
              "
            >

              {/* SKU */}

              <div>

                <label className="form-label">

                  SKU

                </label>


                <input

                  type="text"

                  required

                  name="sku"

                  value={
                    formData.sku
                  }

                  onChange={
                    handleInputChange
                  }

                  placeholder="EE-POT-01"

                  className="
                    w-full
                    px-3.5
                    py-2.5
                    bg-slate-50
                    border
                    border-slate-200
                    rounded-xl
                    text-sm
                    focus:outline-none
                    focus:border-slate-950
                  "

                />

              </div>


              {/* COLLECTION */}

              <div>

                <label className="form-label">

                  Collection

                </label>


                <input

                  type="text"

                  required

                  name="collectionName"

                  value={
                    formData
                      .collectionName
                  }

                  onChange={
                    handleInputChange
                  }

                  placeholder="Summer Harvest"

                  className="
                    w-full
                    px-3.5
                    py-2.5
                    bg-slate-50
                    border
                    border-slate-200
                    rounded-xl
                    text-sm
                    focus:outline-none
                    focus:border-slate-950
                  "

                />

              </div>


              {/* CATEGORY */}

              <div>

                <label className="form-label">

                  Category *

                </label>


                <select

                  required

                  name="category"

                  value={
                    formData.category
                  }

                  onChange={
                    handleInputChange
                  }

                  disabled={
                    loadingCategories
                  }

                  className="
                    w-full
                    px-3.5
                    py-2.5
                    bg-slate-50
                    border
                    border-slate-200
                    rounded-xl
                    text-sm
                    focus:outline-none
                    focus:border-slate-950
                    disabled:opacity-60
                  "

                >

                  <option
                    value=""
                    disabled
                  >

                    {
                      loadingCategories

                        ? "Loading categories..."

                        : "Select Category"
                    }

                  </option>


                  {categories.map(
                    (category) => (

                      <option

                        key={
                          category._id ||
                          category.id
                        }

                        value={
                          category._id ||
                          category.id
                        }

                      >

                        {
                          category.name ||
                          category.title
                        }

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* STATUS */}

              <div>

                <label className="form-label">

                  Status

                </label>


                <select

                  name="isActive"

                  value={
                    String(
                      formData
                        .isActive
                    )
                  }

                  onChange={
                    handleInputChange
                  }

                  className="
                    w-full
                    px-3.5
                    py-2.5
                    bg-slate-50
                    border
                    border-slate-200
                    rounded-xl
                    text-sm
                    focus:outline-none
                    focus:border-slate-950
                  "

                >

                  <option value="false">

                    Inactive

                  </option>

                  <option value="true">

                    Active

                  </option>

                </select>

              </div>

            </div>

          </div>


          {/* ============================================================
              FINANCIALS
          ============================================================= */}

          <div
            className="
              bg-white
              p-6
              rounded-2xl
              border
              border-slate-200
              shadow-sm
              space-y-4
            "
          >

            <h3
              className="
                text-sm
                font-bold
                text-slate-800
                border-b
                pb-2
              "
            >

              2. Financials & Stock

            </h3>


            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-4
                gap-4
              "
            >

              {[
                {
                  name: "price",
                  label: "Sale Price",
                  required: true,
                },

                {
                  name:
                    "originalPrice",
                  label:
                    "Original Price",
                },

                {
                  name:
                    "discountPercentage",
                  label:
                    "Discount %",
                },

                {
                  name: "stock",
                  label: "Stock",
                  required: true,
                },

              ].map(
                (field) => (

                  <div
                    key={
                      field.name
                    }
                  >

                    <label className="form-label">

                      {field.label}

                    </label>


                    <input

                      type="number"

                      required={
                        field.required
                      }

                      name={
                        field.name
                      }

                      value={
                        formData[
                        field.name
                        ]
                      }

                      onChange={
                        handleInputChange
                      }

                      className="
                        w-full
                        px-3.5
                        py-2.5
                        bg-slate-50
                        border
                        border-slate-200
                        rounded-xl
                        text-sm
                        focus:outline-none
                        focus:border-slate-950
                      "

                    />

                  </div>

                )
              )}

            </div>

          </div>


          {/* ============================================================
              SPECIFICATIONS
          ============================================================= */}

          <div
            className="
              bg-white
              p-6
              rounded-2xl
              border
              border-slate-200
              shadow-sm
              space-y-4
            "
          >

            <h3
              className="
                text-sm
                font-bold
                text-slate-800
                border-b
                pb-2
              "
            >

              3. Specifications

            </h3>


            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-4
              "
            >

              <input

                type="text"

                required

                name="dimensions"

                value={
                  formData.dimensions
                }

                onChange={
                  handleInputChange
                }

                placeholder="Dimensions"

                className="product-input"

              />


              <input

                type="text"

                required

                name="weight"

                value={
                  formData.weight
                }

                onChange={
                  handleInputChange
                }

                placeholder="Weight"

                className="product-input"

              />

            </div>


            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-3
                gap-4
              "
            >

              {[
                "composition",
                "placement",
                "finish",
              ].map(
                (field) => (

                  <input

                    key={field}

                    type="text"

                    name={field}

                    value={
                      formData[field]
                    }

                    onChange={
                      handleInputChange
                    }

                    placeholder={
                      field
                        .charAt(0)
                        .toUpperCase() +
                      field.slice(1)
                    }

                    className="product-input"

                  />

                )
              )}

            </div>

          </div>

        </div>


        {/* ==============================================================
            RIGHT SIDE
        =============================================================== */}

        <div
          className="
            flex
            flex-col
            space-y-6
          "
        >

          {/* DESCRIPTION */}

          <div
            className="
              bg-white
              p-6
              rounded-2xl
              border
              border-slate-200
              shadow-sm
              space-y-4
            "
          >

            <h3
              className="
                text-sm
                font-bold
                border-b
                pb-2
              "
            >

              4. Product Description

            </h3>


            <textarea

              rows={3}

              required

              name="description"

              value={
                formData.description
              }

              onChange={
                handleInputChange
              }

              placeholder="Short description"

              className="product-input resize-none"

            />


            <textarea

              rows={5}

              required

              name="longDescription"

              value={
                formData
                  .longDescription
              }

              onChange={
                handleInputChange
              }

              placeholder="Long description"

              className="product-input resize-none"

            />


            <textarea

              rows={5}

              required

              name="longDescription1"

              value={
                formData
                  .longDescription1
              }

              onChange={
                handleInputChange
              }

              placeholder="Additional long description"

              className="product-input resize-none"

            />

          </div>


          {/* ============================================================
              IMAGES
          ============================================================= */}

          <div
            className="
              bg-white
              p-6
              rounded-2xl
              border
              border-slate-200
              shadow-sm
              space-y-3
            "
          >

            <h3
              className="
                text-sm
                font-bold
                border-b
                pb-2
              "
            >

              5. Product Images

            </h3>


            <p
              className="
                text-xs
                text-slate-400
              "
            >

              Maximum 5 images allowed.

            </p>


            <div
              className="
                grid
                grid-cols-2
                sm:grid-cols-3
                gap-3
              "
            >

              {images.map(
                (
                  image,
                  index
                ) => (

                  <ImagePreview

                    key={`${image.name}-${index}`}

                    image={
                      image
                    }

                    onRemove={() =>
                      removeImage(
                        index
                      )
                    }

                  />

                )
              )}


              {images.length <
                5 && (

                  <label
                    className="
                    aspect-square
                    rounded-xl
                    border-2
                    border-dashed
                    border-slate-200
                    hover:border-slate-400
                    flex
                    flex-col
                    items-center
                    justify-center
                    cursor-pointer
                    bg-slate-50
                    text-slate-400
                    gap-2
                  "
                  >

                    <Upload
                      size={20}
                    />


                    <span
                      className="
                      text-xs
                      font-semibold
                    "
                    >

                      Upload

                    </span>


                    <input

                      type="file"

                      multiple

                      accept="image/*"

                      onChange={
                        handleFileChange
                      }

                      className="hidden"

                    />

                  </label>

                )}

            </div>

          </div>


          {/* ============================================================
              SUBMIT
          ============================================================= */}

          <button

            type="submit"

            disabled={loading}

            className="
              w-full
              rounded-xl
              bg-slate-950
              py-4
              font-bold
              text-white
              hover:bg-slate-900
              transition
              shadow-md
              flex
              items-center
              justify-center
              gap-2
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >

            {loading ? (

              <>

                <Loader2

                  className="
                    animate-spin
                  "

                  size={18}

                />

                Creating Product...

              </>

            ) : (

              "Create Product"

            )}

          </button>

        </div>

      </form>

    </div>

  );

}


/*
|--------------------------------------------------------------------------
| Image Preview Component
|--------------------------------------------------------------------------
*/

function ImagePreview({
  image,
  onRemove,
}) {

  const [
    preview,
    setPreview,
  ] = useState("");


  useEffect(() => {

    const url =
      URL.createObjectURL(
        image
      );


    setPreview(url);


    return () => {

      URL.revokeObjectURL(
        url
      );

    };

  }, [image]);


  return (

    <div
      className="
        relative
        aspect-square
        rounded-xl
        overflow-hidden
        border
        border-slate-200
        group
        bg-slate-100
      "
    >

      <img
        src={preview}
        alt="preview"
        onError={(e) => {
          e.currentTarget.src = "/no-image.png";
        }}

        className="
          w-full
          h-full
          object-cover
        "

      />


      <button

        type="button"

        onClick={
          onRemove
        }

        className="
          absolute
          top-2
          right-2
          bg-slate-950
          text-white
          p-1.5
          rounded-lg
          opacity-100
          sm:opacity-0
          sm:group-hover:opacity-100
          transition
        "

      >

        <X
          size={14}
        />

      </button>

    </div>

  );

}