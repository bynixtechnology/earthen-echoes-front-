import React, {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Upload,
  X,
  Loader2,
  ArrowLeft,
  Tag,
  Trash2,
} from "lucide-react";

import {
  fetchCategories,
} from "../../../redux/thunks/categoryThunk";

import {
  fetchProductTags,
} from "../../../redux/thunks/productTagThunk";

import {
  fetchProductById,
  updateProduct,
} from "../../../redux/thunks/productThunk";

import {
  selectCategories,
  selectCategoriesLoading,
} from "../../../redux/slices/categorySlice";

import {
  selectSelectedProduct,
  selectProductDetailsLoading,
  selectProductActionLoading,
} from "../../../redux/slices/productSlice";

import {
  showToast,
} from "../../../config/toast";


/*
|--------------------------------------------------------------------------
| Theme Colors
|--------------------------------------------------------------------------
*/

export const C = {
  coral: "#F16937",
  teal: "#1BACB1",
  blush: "#F5B5D0",
  raspberry: "#E44587",
  green: "#76A845",
  ivory: "#FDF8F3",
  cream: "#FAF4ED",
  dark: "#1C1208",
  darkTeal: "#0D6B70",
  paleTeal: "#E8F7F8",
  paleBlush: "#FEF0F6",
  paleCoral: "#FEF1EC",
  paleGreen: "#EEF6E7",
};


export default function EditProduct() {

  /*
  |--------------------------------------------------------------------------
  | Hooks & Params
  |--------------------------------------------------------------------------
  */

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();


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

  const { tags: productTagsList = [] } =
    useSelector(
      (state) => state.productTags || {}
    );

  const selectedProduct =
    useSelector(
      selectSelectedProduct
    );

  const isLoading =
    useSelector(
      selectProductDetailsLoading
    );

  const isSubmitting =
    useSelector(
      selectProductActionLoading
    );


  /*
  |--------------------------------------------------------------------------
  | Local State
  |--------------------------------------------------------------------------
  */

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [
    formData,
    setFormData,
  ] = useState({

    numericalId: "",

    title: "",

    slug: "",

    collectionName: "",

    category: "",

    productTags: [],

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
  | Fetch Categories, Tags & Product Details
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProductTags());
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      const categoryId =
        selectedProduct.category?._id ||
        selectedProduct.category?.id ||
        selectedProduct.category ||
        "";

      const mappedTags = (
        selectedProduct.productTags ||
        selectedProduct.tags ||
        []
      ).map((t) => t?._id || t?.id || t);

      setFormData({
        numericalId:
          selectedProduct.numericalId ||
          selectedProduct.numericId ||
          selectedProduct.id ||
          "",
        title: selectedProduct.title || "",
        slug: selectedProduct.slug || "",
        collectionName: selectedProduct.collectionName || "",
        category: categoryId,
        productTags: mappedTags,
        sku: selectedProduct.sku || "",
        description: selectedProduct.description || "",
        longDescription: selectedProduct.longDescription || "",
        longDescription1: selectedProduct.longDescription1 || "",
        price: selectedProduct.price ?? "",
        originalPrice: selectedProduct.originalPrice ?? "",
        discountPercentage: selectedProduct.discountPercentage ?? "",
        stock: selectedProduct.stock ?? "",
        dimensions: selectedProduct.specifications?.dimensions || "",
        weight: selectedProduct.specifications?.weight || "",
        composition: selectedProduct.specifications?.composition || "",
        placement: selectedProduct.specifications?.placement || "",
        finish: selectedProduct.specifications?.finish || "",
        suggestedProducts: selectedProduct.suggestedProducts || [],
        isActive: selectedProduct.isActive ?? false,
      });

      setExistingImages(selectedProduct.images || []);
    }
  }, [selectedProduct]);


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
      (prev) => {
        const updated = {
          ...prev,
          [name]: value,
        };

        // Auto-generate slug if title changes
        if (name === "title") {
          updated.slug = value
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
        }

        return updated;
      }
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Tag Selection Toggle
  |--------------------------------------------------------------------------
  */

  const handleTagToggle = (tagId) => {
    setFormData((prev) => {
      const currentTags = prev.productTags;
      if (currentTags.includes(tagId)) {
        return {
          ...prev,
          productTags: currentTags.filter((id) => id !== tagId),
        };
      } else {
        return {
          ...prev,
          productTags: [...currentTags, tagId],
        };
      }
    });
  };


  /*
  |--------------------------------------------------------------------------
  | Image Selection (New Files)
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


    const totalImagesCount = existingImages.length + newImages.length + files.length;

    if (totalImagesCount > 5) {

      showToast.error(
        "Maximum 5 images are allowed in total."
      );

      e.target.value = "";

      return;

    }


    setNewImages(
      (prev) => [
        ...prev,
        ...files,
      ]
    );

    e.target.value = "";

  };


  /*
  |--------------------------------------------------------------------------
  | Remove New Image Preview
  |--------------------------------------------------------------------------
  */

  const removeNewImage = (
    index
  ) => {

    setNewImages(
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
  | Remove Existing Image
  |--------------------------------------------------------------------------
  */

  const removeExistingImage = (indexToRemove) => {
    setExistingImages((prev) =>
      prev.filter((_, idx) => idx !== indexToRemove)
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Submit Updated Product via Redux Thunk
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!formData.category) {
      showToast.error("Please select a valid category.");
      return;
    }

    if (existingImages.length === 0 && newImages.length === 0) {
      showToast.error("At least one product image is required.");
      return;
    }

    const data = new FormData();

    data.append("numericalId", formData.numericalId);
    data.append("title", formData.title.trim());
    
    // Ensure slug is provided to satisfy backend requirements
    const productSlug = formData.slug || formData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
      
    data.append("slug", productSlug);

    data.append("collectionName", formData.collectionName.trim());
    data.append("category", formData.category);
    data.append("sku", formData.sku.trim());
    data.append("description", formData.description.trim());
    data.append("longDescription", formData.longDescription.trim());
    
    if (formData.longDescription1) {
      data.append("longDescription1", formData.longDescription1.trim());
    }

    data.append("price", Number(formData.price));
    
    if (formData.originalPrice !== "") {
      data.append("originalPrice", Number(formData.originalPrice));
    }
    if (formData.discountPercentage !== "") {
      data.append("discountPercentage", Number(formData.discountPercentage));
    }
    
    data.append("stock", Number(formData.stock || 0));
    data.append("isActive", String(formData.isActive));

    if (formData.productTags && formData.productTags.length > 0) {
      data.append("productTags", JSON.stringify(formData.productTags));
    }

    const specifications = {
      dimensions: formData.dimensions.trim(),
      weight: formData.weight.trim(),
      composition: formData.composition.trim() || "100% natural red clay",
      placement: formData.placement.trim() || "Indoor / Outdoor",
      finish: formData.finish.trim() || "Matte terracotta body",
    };
    data.append("specifications", JSON.stringify(specifications));

    if (formData.suggestedProducts?.length) {
      data.append("suggestedProducts", JSON.stringify(formData.suggestedProducts));
    }

    if (existingImages.length > 0) {
      data.append("existingImages", JSON.stringify(existingImages));
    }

    newImages.forEach((image) => {
      data.append("images", image);
    });

    try {
      const resultAction = await dispatch(
        updateProduct({ id, data })
      );

      if (updateProduct.fulfilled.match(resultAction)) {
        showToast.success(
          resultAction.payload?.message || "Product updated successfully."
        );

        navigate("/admin/product", {
          replace: true,
        });
      } else {
        throw new Error(resultAction.payload || "Failed to update product.");
      }
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);

      showToast.error(
        typeof error === "string"
          ? error
          : error?.message || "Failed to update product."
      );
    }
  };


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 size={32} className="animate-spin text-[#1BACB1]" />
        <p className="text-sm font-medium text-slate-500">Loading product details...</p>
      </div>
    );
  }


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
      style={{ color: C.dark }}
    >

      {/* ================================================================
          HEADER
      ================================================================ */}

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
              "/admin/product"
            )
          }

          className="
            p-2
            bg-white
            border
            rounded-xl
            hover:opacity-80
            transition
            shadow-sm
          "
          style={{ borderColor: C.blush, color: C.teal }}

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
              tracking-tight
            "
            style={{ color: C.dark }}
          >

            Edit Product

          </h2>


          <p
            className="
              text-xs
              mt-0.5
              font-medium
            "
            style={{ color: C.teal }}
          >

            Update inventory and specifications.

          </p>

        </div>

      </div>


      {/* ================================================================
          FORM
      ================================================================ */}

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
              shadow-sm
              p-4
              sm:p-6
              space-y-4
            "
            style={{ borderColor: C.blush, backgroundColor: C.ivory }}
          >

            <h3
              className="
                text-sm
                sm:text-base
                font-bold
                border-b
                pb-2
              "
              style={{ borderColor: C.blush, color: C.dark }}
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

                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: C.darkTeal }}>

                  Numerical ID

                </label>


                <input

                  type="number"

                  required

                  name="numericalId"

                  value={
                    formData.numericalId
                  }

                  onChange={
                    handleInputChange
                  }

                  placeholder="101"

                  className="
                    w-full
                    px-3.5
                    py-2.5
                    bg-white
                    border
                    rounded-xl
                    text-sm
                    focus:outline-none
                  "
                  style={{ borderColor: C.blush }}

                />

              </div>


              {/* TITLE */}

              <div
                className="
                  sm:col-span-2
                "
              >

                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: C.darkTeal }}>

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
                    bg-white
                    border
                    rounded-xl
                    text-sm
                    focus:outline-none
                  "
                  style={{ borderColor: C.blush }}

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

                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: C.darkTeal }}>

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
                    bg-white
                    border
                    rounded-xl
                    text-sm
                    focus:outline-none
                  "
                  style={{ borderColor: C.blush }}

                />

              </div>


              {/* COLLECTION */}

              <div>

                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: C.darkTeal }}>

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
                    bg-white
                    border
                    rounded-xl
                    text-sm
                    focus:outline-none
                  "
                  style={{ borderColor: C.blush }}

                />

              </div>


              {/* CATEGORY */}

              <div>

                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: C.darkTeal }}>

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
                    bg-white
                    border
                    rounded-xl
                    text-sm
                    focus:outline-none
                    disabled:opacity-60
                  "
                  style={{ borderColor: C.blush }}

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

                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: C.darkTeal }}>

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
                    bg-white
                    border
                    rounded-xl
                    text-sm
                    focus:outline-none
                  "
                  style={{ borderColor: C.blush }}

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
              PRODUCT TAGS SELECTION
          ============================================================= */}

          <div
            className="
              bg-white
              p-6
              rounded-2xl
              border
              shadow-sm
              space-y-3
            "
            style={{ borderColor: C.blush, backgroundColor: C.ivory }}
          >

            <h3
              className="
                text-sm
                font-bold
                border-b
                pb-2
              "
              style={{ borderColor: C.blush, color: C.dark }}
            >

              Product Tags

            </h3>

            <p className="text-xs text-slate-500">
              Select multiple tags to associate with this product.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {productTagsList && productTagsList.length > 0 ? (
                productTagsList.map((tag) => {
                  const tagId = tag._id || tag.id;
                  const isSelected = formData.productTags.includes(tagId);
                  return (
                    <button
                      key={tagId}
                      type="button"
                      onClick={() => handleTagToggle(tagId)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        isSelected
                          ? "shadow-sm"
                          : "bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                      style={{
                        backgroundColor: isSelected ? C.paleCoral : "#FFFFFF",
                        color: isSelected ? C.coral : "#475569",
                        borderColor: isSelected ? C.coral : C.blush,
                      }}
                    >
                      <Tag size={12} />
                      {tag.name}
                    </button>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 italic">No product tags available.</p>
              )}
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
              shadow-sm
              space-y-4
            "
            style={{ borderColor: C.blush, backgroundColor: C.ivory }}
          >

            <h3
              className="
                text-sm
                font-bold
                border-b
                pb-2
              "
              style={{ borderColor: C.blush, color: C.dark }}
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

                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: C.darkTeal }}>

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
                        bg-white
                        border
                        rounded-xl
                        text-sm
                        focus:outline-none
                      "
                      style={{ borderColor: C.blush }}

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
              shadow-sm
              space-y-4
            "
            style={{ borderColor: C.blush, backgroundColor: C.ivory }}
          >

            <h3
              className="
                text-sm
                font-bold
                border-b
                pb-2
              "
              style={{ borderColor: C.blush, color: C.dark }}
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

              <div>

                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: C.darkTeal }}>

                  Dimensions *

                </label>

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

                  placeholder="e.g. 10 x 5 x 5 inches"

                  className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none"
                  style={{ borderColor: C.blush }}

                />

              </div>


              <div>

                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: C.darkTeal }}>

                  Weight *

                </label>

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

                  placeholder="e.g. 500g"

                  className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none"
                  style={{ borderColor: C.blush }}

                />

              </div>

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
                { name: "composition", label: "Composition", placeholder: "e.g. Terracotta" },
                { name: "placement", label: "Placement", placeholder: "e.g. Indoor / Outdoor" },
                { name: "finish", label: "Finish", placeholder: "e.g. Matte Glaze" },
              ].map(
                (field) => (

                  <div key={field.name}>

                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: C.darkTeal }}>

                      {field.label}

                    </label>

                    <input

                      type="text"

                      name={field.name}

                      value={
                        formData[field.name]
                      }

                      onChange={
                        handleInputChange
                      }

                      placeholder={field.placeholder}

                      className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none"
                      style={{ borderColor: C.blush }}

                    />

                  </div>

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
              shadow-sm
              space-y-4
            "
            style={{ borderColor: C.blush, backgroundColor: C.ivory }}
          >

            <h3
              className="
                text-sm
                font-bold
                border-b
                pb-2
              "
              style={{ borderColor: C.blush, color: C.dark }}
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

              className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none resize-none"
              style={{ borderColor: C.blush }}

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

              className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none resize-none"
              style={{ borderColor: C.blush }}

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

              className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none resize-none"
              style={{ borderColor: C.blush }}

            />

          </div>


          {/* ============================================================
              IMAGES (Existing + New)
          ============================================================ */}

          <div
            className="
              bg-white
              p-6
              rounded-2xl
              border
              shadow-sm
              space-y-3
            "
            style={{ borderColor: C.blush, backgroundColor: C.ivory }}
          >

            <h3
              className="
                text-sm
                font-bold
                border-b
                pb-2
              "
              style={{ borderColor: C.blush, color: C.dark }}
            >

              5. Product Images

            </h3>


            <p
              className="
                text-xs
              "
              style={{ color: C.teal }}
            >

              Maximum 5 images total (existing + new).

            </p>


            <div
              className="
                grid
                grid-cols-2
                sm:grid-cols-3
                gap-3
              "
            >

              {/* Existing Images from server */}
              {existingImages.map((imgObj, idx) => (
                <div
                  key={`existing-${idx}`}
                  className="relative aspect-square rounded-xl overflow-hidden border group"
                  style={{ borderColor: C.blush, backgroundColor: C.cream }}
                >
                  <img
                    src={imgObj.url}
                    alt="Existing"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/no-image.png";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
                    style={{ backgroundColor: C.dark, color: "#FFFFFF" }}
                    title="Remove Image"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}


              {/* Newly Uploaded Files Preview */}
              {newImages.map((image, index) => (
                <ImagePreview
                  key={`new-${image.name}-${index}`}
                  image={image}
                  onRemove={() => removeNewImage(index)}
                />
              ))}


              {/* Upload Input Button */}
              {(existingImages.length + newImages.length) < 5 && (

                <label
                  className="
                    aspect-square
                    rounded-xl
                    border-2
                    border-dashed
                    flex
                    flex-col
                    items-center
                    justify-center
                    cursor-pointer
                    transition
                    gap-2
                  "
                  style={{ borderColor: C.blush, backgroundColor: C.cream, color: C.teal }}
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
          ============================================================ */}

          <button

            type="submit"

            disabled={isSubmitting}

            className="
              w-full
              rounded-xl
              py-4
              font-bold
              transition
              shadow-md
              flex
              items-center
              justify-center
              gap-2
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
            style={{ backgroundColor: C.coral, color: "#FFFFFF" }}

          >

            {isSubmitting ? (

              <>

                <Loader2

                  className="
                    animate-spin
                  "

                  size={18}

                />

                Updating Product...

              </>

            ) : (

              "Update Product"

            )}

          </button>

        </div>

      </form>

    </div>

  );

}


/*
|--------------------------------------------------------------------------
| Image Preview Component for New Files
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
        group
      "
      style={{ borderColor: C.blush, backgroundColor: C.cream }}
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
          p-1.5
          rounded-lg
          opacity-100
          sm:opacity-0
          sm:group-hover:opacity-100
          transition
        "
        style={{ backgroundColor: C.dark, color: "#FFFFFF" }}

      >

        <X
          size={14}
        />

      </button>

    </div>

  );

}