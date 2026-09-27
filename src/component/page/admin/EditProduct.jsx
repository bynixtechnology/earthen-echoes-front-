import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Upload,
  X,
  Loader2,
  ArrowLeft,
  Tag,
  Plus,
  Trash2,
  Layers,
} from "lucide-react";

import { fetchCategories } from "../../../redux/thunks/categoryThunk";
import { fetchProductTags } from "../../../redux/thunks/productTagThunk";
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
import { showToast } from "../../../config/toast";

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

const emptySize = (overrides = {}) => ({
  optionType: "capacity",
  sizeOrCapacity: "",
  sku: "",
  price: "",
  originalPrice: "",
  discountPercentage: "",
  stock: "",
  specifications: {
    composition: "100% natural red clay",
    capacity: "",
    height: "",
    width: "",
    length: "",
    weight: "",
  },
  ...overrides,
});

const emptyVariant = (composition = "100% natural red clay") => ({
  colorName: "",
  colorCode: "#C85A32",
  sku: "",
  sizes: [emptySize({ specifications: { ...emptySize().specifications, composition } })],
  existingImages: [],
  newImages: [],
});

const imageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url || image.secure_url || image.src || image.path || image.imageUrl || "";
};

export default function EditProduct() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categories = useSelector(selectCategories);
  const loadingCategories = useSelector(selectCategoriesLoading);
  const { tags: productTagsList = [] } = useSelector(
    (state) => state.productTags || {}
  );
  const selectedProduct = useSelector(selectSelectedProduct);
  const isLoading = useSelector(selectProductDetailsLoading);
  const loading = useSelector(selectProductActionLoading);

  // "none" = Normal Product, "colorSize" = Color & Size, "color" = Only Color
  const [variantMode, setVariantMode] = useState("none");
  const hasVariants = variantMode !== "none";
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
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
    composition: "100% natural red clay",
    optionType: "capacity",
    capacity: "",
    height: "",
    width: "",
    length: "",
    weight: "",
    suggestedProducts: [],
  });

  const [variants, setVariants] = useState([
    {
      colorName: "Terracotta Red",
      colorCode: "#C85A32",
      sku: "",
      sizes: [emptySize()],
      existingImages: [],
      newImages: [],
    },
  ]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProductTags());
    if (id) dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!selectedProduct) return;

    const categoryId =
      selectedProduct.category?._id ||
      selectedProduct.category?.id ||
      selectedProduct.category ||
      "";

    const mappedTags = (
      selectedProduct.productTags ||
      selectedProduct.tags ||
      []
    ).map((tag) => tag?._id || tag?.id || tag);

    const specs = selectedProduct.specifications || {};
    const rawVariants = Array.isArray(selectedProduct.variants)
      ? selectedProduct.variants
      : [];

    const productHasVariants =
      Boolean(selectedProduct.hasVariants) && rawVariants.length > 0;

    let detectedMode = "none";
    if (productHasVariants) {
      if (
        selectedProduct.variantMode === "color" ||
        selectedProduct.variantMode === "colorSize"
      ) {
        detectedMode = selectedProduct.variantMode;
      } else {
        const isColorOnly = rawVariants.some(
          (v) =>
            Array.isArray(v.sizes) &&
            v.sizes.some((sz) => sz?.optionType === "color")
        );
        detectedMode = isColorOnly ? "color" : "colorSize";
      }
    }

    setVariantMode(detectedMode);

    const optionType =
      specs.height !== undefined ||
      specs.width !== undefined ||
      specs.length !== undefined ||
      specs.weight !== undefined
        ? "size"
        : "capacity";

    setFormData({
      id:
        selectedProduct.id ??
        selectedProduct.numericalId ??
        selectedProduct.numericId ??
        "",
      title: selectedProduct.title || "",
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
      composition: specs.composition || "100% natural red clay",
      optionType,
      capacity: specs.capacity || "",
      height: specs.height ?? "",
      width: specs.width ?? "",
      length: specs.length ?? "",
      weight: specs.weight ?? "",
      suggestedProducts: selectedProduct.suggestedProducts || [],
    });

    if (!productHasVariants) {
      setExistingImages(selectedProduct.images || []);
      setNewImages([]);
      setVariants([emptyVariant(specs.composition || "100% natural red clay")]);
      return;
    }

    setExistingImages([]);
    setNewImages([]);

    const grouped = new Map();

    const normalizeSize = (source = {}, parent = {}) => {
      const sourceSpecs = source.specifications || {};
      const parentSpecs = parent.specifications || {};
      const type =
        source.optionType ||
        (sourceSpecs.capacity || source.sizeOrCapacity
          ? "capacity"
          : "size");

      return emptySize({
        optionType: type,
        sizeOrCapacity:
          source.sizeOrCapacity ??
          sourceSpecs.capacity ??
          "",
        sku: source.sku || parent.sku || "",
        price: source.price ?? parent.price ?? "",
        originalPrice:
          source.originalPrice ?? parent.originalPrice ?? "",
        discountPercentage:
          source.discountPercentage ?? parent.discountPercentage ?? "",
        stock: source.stock ?? parent.stock ?? "",
        specifications: {
          composition:
            sourceSpecs.composition ||
            parentSpecs.composition ||
            specs.composition ||
            "100% natural red clay",
          capacity: sourceSpecs.capacity || "",
          height: sourceSpecs.height ?? "",
          width: sourceSpecs.width ?? "",
          length: sourceSpecs.length ?? "",
          weight: sourceSpecs.weight ?? "",
        },
      });
    };

    rawVariants.forEach((v, index) => {
      const group = {
        colorName: v.colorName || `Variant ${index + 1}`,
        colorCode: v.colorCode || "#C85A32",
        sku: v.sku || "",
        sizes: [],
        existingImages: [...(v.images || v.existingImages || [])],
        newImages: [],
      };

      if (Array.isArray(v.sizes) && v.sizes.length) {
        v.sizes.forEach((sz) => {
          group.sizes.push(normalizeSize(sz, v));
        });
      } else {
        group.sizes.push(normalizeSize(v));
      }

      if (detectedMode === "color") {
        const first = group.sizes[0] || emptySize();
        group.sizes = [
          emptySize({
            optionType: "color",
            sku: first.sku || group.sku || "",
            price: first.price ?? "",
            originalPrice: first.originalPrice ?? "",
            discountPercentage: first.discountPercentage ?? "",
            stock: first.stock ?? "",
            specifications: {
              composition:
                first.specifications?.composition ||
                specs.composition ||
                "100% natural red clay",
            },
          }),
        ];
      }

      grouped.set(group.colorName, group);
    });

    const mappedVariants = Array.from(grouped.values()).map((v) => ({
      ...v,
      existingImages: Array.from(
        new Map(
          (v.existingImages || []).map((img) => [
            imageUrl(img) || JSON.stringify(img),
            img,
          ])
        ).values()
      ),
      newImages: [],
    }));

    setVariants(
      mappedVariants.length
        ? mappedVariants
        : [emptyVariant(specs.composition || "100% natural red clay")]
    );
  }, [selectedProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "price" || name === "originalPrice") {
        const p = Number(name === "price" ? value : updated.price);
        const op = Number(
          name === "originalPrice" ? value : updated.originalPrice
        );
        updated.discountPercentage =
          op > p && op > 0 ? Math.round(((op - p) / op) * 100) : 0;
      }

      if (name === "optionType") {
        if (value === "size") {
          updated.capacity = "";
        } else {
          updated.height = "";
          updated.width = "";
          updated.length = "";
          updated.weight = "";
        }
      }

      return updated;
    });
  };

  const handleTagToggle = (tagId) => {
    setFormData((prev) => ({
      ...prev,
      productTags: prev.productTags.includes(tagId)
        ? prev.productTags.filter((item) => item !== tagId)
        : [...prev.productTags, tagId],
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (existingImages.length + newImages.length + files.length > 5) {
      showToast.error("Maximum 5 images are allowed in total.");
      e.target.value = "";
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      emptyVariant(formData.composition || "100% natural red clay"),
    ]);
  };

  const removeVariant = (index) => {
    if (variants.length === 1) {
      showToast.error("At least one variant is required when variants are enabled.");
      return;
    }
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addSizeToVariant = (variantIndex) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[variantIndex] = {
        ...updated[variantIndex],
        sizes: [...updated[variantIndex].sizes, emptySize()],
      };
      return updated;
    });
  };

  const removeSizeFromVariant = (variantIndex, sizeIndex) => {
    setVariants((prev) => {
      const updated = [...prev];
      if (updated[variantIndex].sizes.length === 1) {
        showToast.error("Each color variant must have at least one option.");
        return prev;
      }
      updated[variantIndex] = {
        ...updated[variantIndex],
        sizes: updated[variantIndex].sizes.filter((_, i) => i !== sizeIndex),
      };
      return updated;
    });
  };

  const handleSizeChange = (variantIndex, sizeIndex, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      const sizes = [...updated[variantIndex].sizes];
      const target = {
        ...sizes[sizeIndex],
        specifications: { ...sizes[sizeIndex].specifications },
      };

      target[field] = value;

      if (field === "sizeOrCapacity" && target.optionType === "capacity") {
        target.specifications.capacity = value;
      }

      if (field === "price" || field === "originalPrice") {
        const p = Number(field === "price" ? value : target.price);
        const op = Number(
          field === "originalPrice" ? value : target.originalPrice
        );
        target.discountPercentage =
          op > p && op > 0 ? Math.round(((op - p) / op) * 100) : 0;
      }

      if (field === "optionType") {
        if (value === "size") {
          target.sizeOrCapacity = "";
          target.specifications.capacity = "";
        } else {
          target.specifications.height = "";
          target.specifications.width = "";
          target.specifications.length = "";
          target.specifications.weight = "";
        }
      }

      sizes[sizeIndex] = target;
      updated[variantIndex] = { ...updated[variantIndex], sizes };
      return updated;
    });
  };

  const handleSizeSpecChange = (variantIndex, sizeIndex, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      const sizes = [...updated[variantIndex].sizes];
      sizes[sizeIndex] = {
        ...sizes[sizeIndex],
        specifications: {
          ...sizes[sizeIndex].specifications,
          [field]: value,
        },
      };
      updated[variantIndex] = { ...updated[variantIndex], sizes };
      return updated;
    });
  };

  const handleVariantImageChange = (variantIndex, e) => {
    const files = Array.from(e.target.files || []);
    const variant = variants[variantIndex];

    const total =
      (variant.existingImages?.length || 0) +
      (variant.newImages?.length || 0) +
      files.length;

    if (total > 5) {
      showToast.error("Maximum 5 images allowed per color variant.");
      e.target.value = "";
      return;
    }

    setVariants((prev) => {
      const updated = [...prev];
      updated[variantIndex] = {
        ...updated[variantIndex],
        newImages: [
          ...(updated[variantIndex].newImages || []),
          ...files,
        ],
      };
      return updated;
    });

    e.target.value = "";
  };

  const removeVariantExistingImage = (variantIndex, imageIndex) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[variantIndex] = {
        ...updated[variantIndex],
        existingImages: updated[variantIndex].existingImages.filter(
          (_, i) => i !== imageIndex
        ),
      };
      return updated;
    });
  };

  const removeVariantNewImage = (variantIndex, imageIndex) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[variantIndex] = {
        ...updated[variantIndex],
        newImages: updated[variantIndex].newImages.filter(
          (_, i) => i !== imageIndex
        ),
      };
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!id) {
      showToast.error("Product ID is missing.");
      return;
    }

    if (!formData.category) {
      showToast.error("Please select a valid category.");
      return;
    }

    if (hasVariants) {
      if (!variants.length) {
        showToast.error("Please add at least one color variant.");
        return;
      }

      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];

        if (!v.colorName?.trim()) {
          showToast.error(`Color Name is required for variant #${i + 1}.`);
          return;
        }

        const imageCount =
          (v.existingImages?.length || 0) +
          (v.newImages?.length || 0);

        if (!imageCount) {
          showToast.error(
            `At least one image is required for variant "${v.colorName}".`
          );
          return;
        }

        if (variantMode === "colorSize") {
          if (!v.sizes?.length) {
            showToast.error(
              `At least one option is required for "${v.colorName}".`
            );
            return;
          }

          for (let s = 0; s < v.sizes.length; s++) {
            const size = v.sizes[s];

            if (
              size.optionType === "capacity" &&
              !String(size.sizeOrCapacity || "").trim()
            ) {
              showToast.error(
                `Capacity is required for ${v.colorName}, option #${s + 1}.`
              );
              return;
            }

            if (
              size.price === "" ||
              Number.isNaN(Number(size.price))
            ) {
              showToast.error(
                `Sale price is required for ${v.colorName}, option #${s + 1}.`
              );
              return;
            }

            if (
              size.stock === "" ||
              Number.isNaN(Number(size.stock))
            ) {
              showToast.error(
                `Stock is required for ${v.colorName}, option #${s + 1}.`
              );
              return;
            }
          }
        } else {
          const option = v.sizes?.[0] || {};

          if (
            option.price === "" ||
            Number.isNaN(Number(option.price))
          ) {
            showToast.error(`Sale price is required for "${v.colorName}".`);
            return;
          }

          if (
            option.stock === "" ||
            Number.isNaN(Number(option.stock))
          ) {
            showToast.error(`Stock is required for "${v.colorName}".`);
            return;
          }
        }
      }
    } else if (existingImages.length + newImages.length === 0) {
      showToast.error("At least one product image is required.");
      return;
    }

    const data = new FormData();

    data.append("id", formData.id);
    data.append("title", formData.title.trim());
    data.append("category", formData.category);
    data.append("sku", formData.sku.trim());
    data.append("description", formData.description.trim());
    data.append("longDescription", formData.longDescription.trim());

    if (formData.longDescription1) {
      data.append("longDescription1", formData.longDescription1.trim());
    }

    data.append("isActive", "true");
    data.append("hasVariants", String(hasVariants));
    data.append("variantMode", variantMode);

    if (!hasVariants) {
      data.append("price", Number(formData.price));

      if (formData.originalPrice !== "") {
        data.append("originalPrice", Number(formData.originalPrice));
      }

      data.append(
        "discountPercentage",
        Number(formData.discountPercentage || 0)
      );
      data.append("stock", Number(formData.stock || 0));

      data.append("existingImages", JSON.stringify(existingImages));
      newImages.forEach((file) => data.append("images", file));
    } else {
      const formattedVariants = variants.map((v) => {
        if (variantMode === "color") {
          const option = v.sizes?.[0] || {};

          return {
            colorName: v.colorName.trim(),
            colorCode: v.colorCode?.trim() || "#C85A32",
            sku: v.sku?.trim() || undefined,
            sizes: [
              {
                optionType: "color",
                sku: option.sku?.trim() || undefined,
                price: option.price !== "" ? Number(option.price) : 0,
                originalPrice:
                  option.originalPrice !== ""
                    ? Number(option.originalPrice)
                    : 0,
                discountPercentage: Number(
                  option.discountPercentage || 0
                ),
                stock: option.stock !== "" ? Number(option.stock) : 0,
                specifications: {
                  composition:
                    option.specifications?.composition?.trim() ||
                    "100% natural red clay",
                },
                existingImages: v.existingImages || [],
              },
            ],
          };
        }

        return {
          colorName: v.colorName.trim(),
          colorCode: v.colorCode?.trim() || "#C85A32",
          sku: v.sku?.trim() || undefined,
          sizes: (v.sizes || []).map((sz) => ({
            optionType: sz.optionType,
            sizeOrCapacity:
              sz.optionType === "capacity"
                ? sz.sizeOrCapacity?.trim() || undefined
                : undefined,
            sku: sz.sku?.trim() || undefined,
            price: sz.price !== "" ? Number(sz.price) : 0,
            originalPrice:
              sz.originalPrice !== ""
                ? Number(sz.originalPrice)
                : 0,
            discountPercentage: Number(
              sz.discountPercentage || 0
            ),
            stock: sz.stock !== "" ? Number(sz.stock) : 0,
            specifications: {
              composition:
                sz.specifications?.composition?.trim() ||
                "100% natural red clay",
              capacity:
                sz.optionType === "capacity"
                  ? sz.sizeOrCapacity?.trim() ||
                    sz.specifications?.capacity?.trim() ||
                    undefined
                  : undefined,
              height:
                sz.optionType === "size" &&
                sz.specifications?.height !== ""
                  ? Number(sz.specifications.height)
                  : undefined,
              width:
                sz.optionType === "size" &&
                sz.specifications?.width !== ""
                  ? Number(sz.specifications.width)
                  : undefined,
              length:
                sz.optionType === "size" &&
                sz.specifications?.length !== ""
                  ? Number(sz.specifications.length)
                  : undefined,
              weight:
                sz.optionType === "size" &&
                sz.specifications?.weight !== ""
                  ? Number(sz.specifications.weight)
                  : undefined,
            },
          })),
          existingImages: v.existingImages || [],
        };
      });

      data.append("variants", JSON.stringify(formattedVariants));

      variants.forEach((v, index) => {
        (v.newImages || []).forEach((file) => {
          data.append(`variant_${index}_images`, file);
        });
      });
    }

    data.append(
      "productTags",
      JSON.stringify(formData.productTags || [])
    );

    // Normal Product + Only Color both use the main Specifications & Capacity box.
    // Color & Size keeps specifications inside each variant option.
    if (variantMode !== "colorSize") {
      data.append(
        "specifications",
        JSON.stringify({
          composition: formData.composition?.trim() || "100% natural red clay",
          capacity: formData.optionType === "capacity" ? formData.capacity?.trim() || undefined : undefined,
          height: formData.optionType === "size" && formData.height !== "" ? Number(formData.height) : undefined,
          width: formData.optionType === "size" && formData.width !== "" ? Number(formData.width) : undefined,
          length: formData.optionType === "size" && formData.length !== "" ? Number(formData.length) : undefined,
          weight: formData.optionType === "size" && formData.weight !== "" ? Number(formData.weight) : undefined,
        })
      );
    }

    if (formData.suggestedProducts?.length) {
      data.append(
        "suggestedProducts",
        JSON.stringify(formData.suggestedProducts)
      );
    }

    try {
      const response = await dispatch(
        updateProduct({ id, data })
      ).unwrap();

      showToast.success(
        response?.message || "Product updated successfully."
      );
      navigate("/admin/product", { replace: true });
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);
      showToast.error(
        typeof error === "string"
          ? error
          : error?.message || "Failed to update product."
      );
    }
  };

  return (
    <div
      className="max-w-6xl mx-auto w-full space-y-6 pb-16"
      style={{ color: C.dark }}
    >
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/admin/product")}
          className="p-2 bg-white border rounded-xl hover:opacity-80 transition shadow-sm"
          style={{ borderColor: C.blush, color: C.teal }}
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ color: C.dark }}
          >
            Edit Product
          </h2>
          <p
            className="text-xs mt-0.5 font-medium"
            style={{ color: C.teal }}
          >
            Update product details, pricing, variants and images.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. CORE INFORMATION */}
          <div
            className="bg-white rounded-2xl border shadow-sm p-4 sm:p-6 space-y-4"
            style={{ borderColor: C.blush, backgroundColor: C.ivory }}
          >
            <h3
              className="text-sm sm:text-base font-bold border-b pb-2"
              style={{ borderColor: C.blush, color: C.dark }}
            >
              1. Core Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: C.darkTeal }}
                >
                  Numerical ID *
                </label>
                <input
                  type="number"
                  required
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  placeholder="101"
                  className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none"
                  style={{ borderColor: C.blush }}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: C.darkTeal }}
                >
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Clay Pitcher"
                  className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none"
                  style={{ borderColor: C.blush }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: C.darkTeal }}
                >
                  Main SKU *
                </label>
                <input
                  type="text"
                  required
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="EE-POT-01"
                  className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none"
                  style={{ borderColor: C.blush }}
                />
              </div>

              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: C.darkTeal }}
                >
                  Category *
                </label>
                <select
                  required
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  disabled={loadingCategories}
                  className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none disabled:opacity-60"
                  style={{ borderColor: C.blush }}
                >
                  <option value="" disabled>
                    {loadingCategories
                      ? "Loading categories..."
                      : "Select Category"}
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category._id || category.id}
                      value={category._id || category.id}
                    >
                      {category.name || category.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* PRODUCT TAGS SELECTION */}
          <div
            className="bg-white p-6 rounded-2xl border shadow-sm space-y-3"
            style={{ borderColor: C.blush, backgroundColor: C.ivory }}
          >
            <h3
              className="text-sm font-bold border-b pb-2"
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
                <p className="text-xs text-slate-400 italic">
                  No product tags available.
                </p>
              )}
            </div>
          </div>

          {/* FINANCIALS & BASE STOCK (Shown ONLY when Variants are Disabled) */}
          {!hasVariants && (
            <div
              className="bg-white p-6 rounded-2xl border shadow-sm space-y-4"
              style={{ borderColor: C.blush, backgroundColor: C.ivory }}
            >
              <h3
                className="text-sm font-bold border-b pb-2"
                style={{ borderColor: C.blush, color: C.dark }}
              >
                2. Base Financials & Stock
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { name: "price", label: "Sale Price", required: true },
                  { name: "originalPrice", label: "Original Price" },
                  { name: "discountPercentage", label: "Discount %" },
                  { name: "stock", label: "Base Stock", required: true },
                ].map((field) => (
                  <div key={field.name}>
                    <label
                      className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                      style={{ color: C.darkTeal }}
                    >
                      {field.label}
                    </label>
                    <input
                      type="number"
                      required={field.required}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none"
                      style={{ borderColor: C.blush }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SPECIFICATIONS & CAPACITY (Shown for Normal Product and Only Color modes) */}
          {variantMode !== "colorSize" && (
            <div
              className="bg-white p-6 rounded-2xl border shadow-sm space-y-4"
              style={{ borderColor: C.blush, backgroundColor: C.ivory }}
            >
              <h3
                className="text-sm font-bold border-b pb-2"
                style={{ borderColor: C.blush, color: C.dark }}
              >
                Specifications & Capacity
              </h3>
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: C.darkTeal }}
                >
                  Composition
                </label>
                <input
                  type="text"
                  name="composition"
                  value={formData.composition}
                  onChange={handleInputChange}
                  placeholder="e.g. 100% natural red clay"
                  className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none"
                  style={{ borderColor: C.blush }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: C.darkTeal }}
                  >
                    Type *
                  </label>
                  <select
                    name="optionType"
                    value={formData.optionType || "capacity"}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none"
                    style={{ borderColor: C.blush }}
                  >
                    <option value="capacity">Capacity</option>
                    <option value="size">Size / Dimensions</option>
                  </select>
                </div>

                {formData.optionType === "capacity" && (
                  <div>
                    <label
                      className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                      style={{ color: C.darkTeal }}
                    >
                      Capacity (e.g. 1L, 500ml) *
                    </label>
                    <input
                      type="text"
                      required
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      placeholder="e.g. 1 Litre"
                      className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none"
                      style={{ borderColor: C.blush }}
                    />
                  </div>
                )}
              </div>

              {formData.optionType === "size" && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 border-t">
                  <div>
                    <label
                      className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                      style={{ color: C.darkTeal }}
                    >
                      Height (Optional)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      placeholder="e.g. 15"
                      className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none"
                      style={{ borderColor: C.blush }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                      style={{ color: C.darkTeal }}
                    >
                      Width (Optional)
                    </label>
                    <input
                      type="number"
                      name="width"
                      value={formData.width}
                      onChange={handleInputChange}
                      placeholder="e.g. 10"
                      className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none"
                      style={{ borderColor: C.blush }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                      style={{ color: C.darkTeal }}
                    >
                      Length (Optional)
                    </label>
                    <input
                      type="number"
                      name="length"
                      value={formData.length}
                      onChange={handleInputChange}
                      placeholder="e.g. 12"
                      className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none"
                      style={{ borderColor: C.blush }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                      style={{ color: C.darkTeal }}
                    >
                      Weight (Optional)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="e.g. 500"
                      className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none"
                      style={{ borderColor: C.blush }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VARIANT MODE - MUTUALLY EXCLUSIVE */}
          <div
            className="bg-white p-6 rounded-2xl border shadow-sm space-y-4"
            style={{ borderColor: C.blush, backgroundColor: C.ivory }}
          >
            <div className="border-b pb-3">
              <div className="flex items-center gap-2 mb-3">
                <Layers size={18} style={{ color: C.coral }} />
                <h3 className="text-sm font-bold" style={{ color: C.dark }}>
                  Variant Mode
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setVariantMode("none")}
                  className="px-3 py-2.5 rounded-xl border text-xs font-bold transition"
                  style={{
                    borderColor: variantMode === "none" ? C.teal : C.blush,
                    backgroundColor: variantMode === "none" ? C.paleTeal : "#FFFFFF",
                    color: variantMode === "none" ? C.darkTeal : "#475569",
                  }}
                >
                  Normal Product
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setVariantMode("colorSize");
                    setVariants((prev) =>
                      prev.map((v) => ({
                        ...v,
                        sizes:
                          v.sizes?.length && v.sizes[0]?.optionType !== "color"
                            ? v.sizes
                            : [
                                emptySize({
                                  optionType: "capacity",
                                  specifications: {
                                    ...emptySize().specifications,
                                    composition:
                                      v.sizes?.[0]?.specifications?.composition ||
                                      formData.composition ||
                                      "100% natural red clay",
                                  },
                                }),
                              ],
                      }))
                    );
                  }}
                  className="px-3 py-2.5 rounded-xl border text-xs font-bold transition"
                  style={{
                    borderColor: variantMode === "colorSize" ? C.coral : C.blush,
                    backgroundColor: variantMode === "colorSize" ? C.paleCoral : "#FFFFFF",
                    color: variantMode === "colorSize" ? C.coral : "#475569",
                  }}
                >
                  Color & Size Variants
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setVariantMode("color");
                    setVariants((prev) =>
                      prev.map((v) => {
                        const first = v.sizes?.[0] || emptySize();
                        return {
                          ...v,
                          sizes: [
                            emptySize({
                              optionType: "color",
                              sku: first.sku || v.sku || "",
                              price: first.price ?? "",
                              originalPrice: first.originalPrice ?? "",
                              discountPercentage:
                                first.discountPercentage ?? "",
                              stock: first.stock ?? "",
                              specifications: {
                                composition:
                                  first.specifications?.composition ||
                                  formData.composition ||
                                  "100% natural red clay",
                              },
                            }),
                          ],
                        };
                      })
                    );
                  }}
                  className="px-3 py-2.5 rounded-xl border text-xs font-bold transition"
                  style={{
                    borderColor: variantMode === "color" ? C.raspberry : C.blush,
                    backgroundColor: variantMode === "color" ? C.paleBlush : "#FFFFFF",
                    color: variantMode === "color" ? C.raspberry : "#475569",
                  }}
                >
                  Only Color
                </button>
              </div>

              <p className="text-[11px] text-slate-500 mt-2">
                Only one mode can be active at a time. Only Color hides size, capacity and dimensions.
              </p>
            </div>

            {hasVariants && (
              <div className="space-y-6 pt-2">
                <div
                  className="px-3 py-2 rounded-xl border text-xs font-bold"
                  style={{
                    borderColor: variantMode === "colorSize" ? C.coral : C.raspberry,
                    backgroundColor: variantMode === "colorSize" ? C.paleCoral : C.paleBlush,
                    color: variantMode === "colorSize" ? C.coral : C.raspberry,
                  }}
                >
                  Active Mode:{" "}
                  {variantMode === "colorSize"
                    ? "Color & Size Variants"
                    : "Only Color Mode"}
                  <span className="font-normal text-slate-500 ml-1">
                    — same fields are used for every color variant.
                  </span>
                </div>

                {variants.map((variant, variantIndex) => (
                  <div
                    key={variantIndex}
                    className="bg-white p-4 sm:p-5 rounded-xl border space-y-4 shadow-sm"
                    style={{ borderColor: C.blush }}
                  >
                    <div className="flex items-center justify-between border-b pb-2">
                      <span
                        className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                        style={{ color: C.darkTeal }}
                      >
                        <span
                          className="w-4 h-4 rounded-full border shadow-inner"
                          style={{
                            backgroundColor: variant.colorCode || "#C85A32",
                            borderColor: C.blush,
                          }}
                        ></span>
                        Color Variant #{variantIndex + 1}: {variant.colorName || "Untitled Color"}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeVariant(variantIndex)}
                        className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Color Name & Hex Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          Color Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={variant.colorName}
                          onChange={(e) =>
                            handleVariantChange(variantIndex, "colorName", e.target.value)
                          }
                          placeholder="Terracotta Red"
                          className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs focus:outline-none"
                          style={{ borderColor: C.blush }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          Color Code (Hex)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={variant.colorCode || "#C85A32"}
                            onChange={(e) =>
                              handleVariantChange(variantIndex, "colorCode", e.target.value)
                            }
                            className="w-9 h-9 rounded-lg border cursor-pointer p-0.5 bg-white"
                            style={{ borderColor: C.blush }}
                          />
                          <input
                            type="text"
                            value={variant.colorCode}
                            onChange={(e) =>
                              handleVariantChange(variantIndex, "colorCode", e.target.value)
                            }
                            placeholder="#C85A32"
                            className="w-full px-2.5 py-2 bg-slate-50 border rounded-lg text-xs font-mono focus:outline-none uppercase"
                            style={{ borderColor: C.blush }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* OPTIONS & PRICING */}
                    <div className="space-y-4 pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                          {variantMode === "color"
                            ? `Pricing & Stock for ${variant.colorName || "this color"}`
                            : `Options & Pricing for ${variant.colorName || "this color"}`}
                        </label>

                        {variantMode === "colorSize" && (
                          <button
                            type="button"
                            onClick={() => addSizeToVariant(variantIndex)}
                            className="text-xs font-bold px-2.5 py-1 rounded-lg border bg-slate-50 hover:bg-slate-100 flex items-center gap-1"
                            style={{ color: C.coral, borderColor: C.blush }}
                          >
                            <Plus size={13} /> Add Option
                          </button>
                        )}
                      </div>

                      {variantMode === "color" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold mb-1">
                              Sale Price (₹) *
                            </label>
                            <input
                              type="number"
                              required
                              value={variant.sizes?.[0]?.price ?? ""}
                              onChange={(e) =>
                                handleSizeChange(
                                  variantIndex,
                                  0,
                                  "price",
                                  e.target.value
                                )
                              }
                              placeholder="299"
                              className="w-full px-3 py-2 bg-white border rounded-lg text-xs focus:outline-none"
                              style={{ borderColor: C.blush }}
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold mb-1">
                              Original Price
                            </label>
                            <input
                              type="number"
                              value={variant.sizes?.[0]?.originalPrice ?? ""}
                              onChange={(e) =>
                                handleSizeChange(
                                  variantIndex,
                                  0,
                                  "originalPrice",
                                  e.target.value
                                )
                              }
                              placeholder="399"
                              className="w-full px-3 py-2 bg-white border rounded-lg text-xs focus:outline-none"
                              style={{ borderColor: C.blush }}
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold mb-1">
                              Stock *
                            </label>
                            <input
                              type="number"
                              required
                              value={variant.sizes?.[0]?.stock ?? ""}
                              onChange={(e) =>
                                handleSizeChange(
                                  variantIndex,
                                  0,
                                  "stock",
                                  e.target.value
                                )
                              }
                              placeholder="10"
                              className="w-full px-3 py-2 bg-white border rounded-lg text-xs focus:outline-none"
                              style={{ borderColor: C.blush }}
                            />
                          </div>
                        </div>
                      ) : (
                        variant.sizes.map((sizeItem, sizeIndex) => (
                          <div
                            key={sizeIndex}
                            className="p-4 rounded-xl border bg-slate-50/60 space-y-3 relative"
                            style={{ borderColor: C.blush }}
                          >
                            <div className="flex items-center justify-between border-b pb-2">
                              <span className="text-xs font-bold text-slate-700">
                                Option #{sizeIndex + 1}
                              </span>
                              {variant.sizes.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeSizeFromVariant(
                                      variantIndex,
                                      sizeIndex
                                    )
                                  }
                                  className="text-rose-500 hover:text-rose-700 p-1"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>

                            <div
                              className={`grid grid-cols-1 ${
                                sizeItem.optionType === "capacity"
                                  ? "sm:grid-cols-4"
                                  : "sm:grid-cols-3"
                              } gap-3`}
                            >
                              <div>
                                <label className="block text-[11px] font-semibold mb-1">
                                  Type *
                                </label>
                                <select
                                  value={sizeItem.optionType || "capacity"}
                                  onChange={(e) =>
                                    handleSizeChange(
                                      variantIndex,
                                      sizeIndex,
                                      "optionType",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 bg-white border rounded-lg text-xs focus:outline-none"
                                  style={{ borderColor: C.blush }}
                                >
                                  <option value="capacity">Capacity</option>
                                  <option value="size">
                                    Size / Dimensions
                                  </option>
                                </select>
                              </div>

                              {sizeItem.optionType === "capacity" && (
                                <div>
                                  <label className="block text-[11px] font-semibold mb-1">
                                    Capacity (e.g. 500ml, 1L) *
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={sizeItem.sizeOrCapacity}
                                    onChange={(e) =>
                                      handleSizeChange(
                                        variantIndex,
                                        sizeIndex,
                                        "sizeOrCapacity",
                                        e.target.value
                                      )
                                    }
                                    placeholder="e.g. 500ml"
                                    className="w-full px-3 py-2 bg-white border rounded-lg text-xs focus:outline-none"
                                    style={{ borderColor: C.blush }}
                                  />
                                </div>
                              )}

                              <div>
                                <label className="block text-[11px] font-semibold mb-1">
                                  Sale Price (₹) *
                                </label>
                                <input
                                  type="number"
                                  required
                                  value={sizeItem.price}
                                  onChange={(e) =>
                                    handleSizeChange(
                                      variantIndex,
                                      sizeIndex,
                                      "price",
                                      e.target.value
                                    )
                                  }
                                  placeholder="299"
                                  className="w-full px-3 py-2 bg-white border rounded-lg text-xs focus:outline-none"
                                  style={{ borderColor: C.blush }}
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold mb-1">
                                  Stock *
                                </label>
                                <input
                                  type="number"
                                  required
                                  value={sizeItem.stock}
                                  onChange={(e) =>
                                    handleSizeChange(
                                      variantIndex,
                                      sizeIndex,
                                      "stock",
                                      e.target.value
                                    )
                                  }
                                  placeholder="10"
                                  className="w-full px-3 py-2 bg-white border rounded-lg text-xs focus:outline-none"
                                  style={{ borderColor: C.blush }}
                                />
                              </div>
                            </div>

                            {sizeItem.optionType === "size" && (
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t">
                                {[
                                  ["height", "Height", "e.g. 15"],
                                  ["width", "Width", "e.g. 10"],
                                  ["length", "Length", "e.g. 12"],
                                  ["weight", "Weight (g)", "e.g. 500"],
                                ].map(([field, label, placeholder]) => (
                                  <div key={field}>
                                    <label className="block text-[10px] font-semibold mb-1">
                                      {label}
                                    </label>
                                    <input
                                      type="number"
                                      value={sizeItem.specifications[field]}
                                      onChange={(e) =>
                                        handleSizeSpecChange(
                                          variantIndex,
                                          sizeIndex,
                                          field,
                                          e.target.value
                                        )
                                      }
                                      placeholder={placeholder}
                                      className="w-full px-2.5 py-1.5 bg-white border rounded-lg text-xs"
                                      style={{ borderColor: C.blush }}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Variant Images Upload */}
                    <div className="pt-1 border-t">
                      <label className="block text-xs font-semibold mb-1.5">
                        Variant Images (Max 5) *
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {(variant.existingImages || []).map((img, imgIdx) => (
                          <div
                            key={`v-existing-${imgIdx}`}
                            className="relative aspect-square rounded-lg overflow-hidden border group bg-white"
                            style={{ borderColor: C.blush }}
                          >
                            <img
                              src={imageUrl(img)}
                              alt="Existing variant"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/no-image.png";
                              }}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeVariantExistingImage(
                                  variantIndex,
                                  imgIdx
                                )
                              }
                              className="absolute top-1 right-1 p-1 rounded bg-black/70 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}

                        {(variant.newImages || []).map((img, imgIdx) => (
                          <ImagePreview
                            key={`v-new-${imgIdx}`}
                            image={img}
                            onRemove={() =>
                              removeVariantNewImage(
                                variantIndex,
                                imgIdx
                              )
                            }
                          />
                        ))}

                        {((variant.existingImages?.length || 0) +
                          (variant.newImages?.length || 0)) < 5 && (
                          <label
                            className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition gap-1"
                            style={{
                              borderColor: C.blush,
                              color: C.teal,
                            }}
                          >
                            <Upload size={16} />
                            <span className="text-[10px] font-bold">
                              Add Photo
                            </span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => handleVariantImageChange(variantIndex, e)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addVariant}
                  className="w-full py-2.5 border-2 border-dashed rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition"
                  style={{ borderColor: C.coral, color: C.coral }}
                >
                  <Plus size={16} />
                  Add Another Color Variant
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col space-y-6">
          {/* DESCRIPTION */}
          <div
            className="bg-white p-6 rounded-2xl border shadow-sm space-y-4"
            style={{ borderColor: C.blush, backgroundColor: C.ivory }}
          >
            <h3
              className="text-sm font-bold border-b pb-2"
              style={{ borderColor: C.blush, color: C.dark }}
            >
              3. Product Description
            </h3>

            <textarea
              rows={3}
              required
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Short description"
              className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none resize-none"
              style={{ borderColor: C.blush }}
            />

            <textarea
              rows={5}
              required
              name="longDescription"
              value={formData.longDescription}
              onChange={handleInputChange}
              placeholder="Long description"
              className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none resize-none"
              style={{ borderColor: C.blush }}
            />

            <textarea
              rows={4}
              name="longDescription1"
              value={formData.longDescription1}
              onChange={handleInputChange}
              placeholder="Additional long description (Optional)"
              className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none resize-none"
              style={{ borderColor: C.blush }}
            />
          </div>

          {/* SINGLE PRODUCT IMAGES (When Variants Disabled) */}
          {!hasVariants && (
            <div
              className="bg-white p-6 rounded-2xl border shadow-sm space-y-3"
              style={{ borderColor: C.blush, backgroundColor: C.ivory }}
            >
              <h3
                className="text-sm font-bold border-b pb-2"
                style={{ borderColor: C.blush, color: C.dark }}
              >
                4. Main Product Images
              </h3>

              <p className="text-xs" style={{ color: C.teal }}>
                Maximum 5 images allowed.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {existingImages.map((image, index) => (
                  <div
                    key={`existing-${index}`}
                    className="relative aspect-square rounded-xl overflow-hidden border group"
                    style={{ borderColor: C.blush, backgroundColor: C.cream }}
                  >
                    <img
                      src={imageUrl(image)}
                      alt="Existing product"
                      onError={(e) => {
                        e.currentTarget.src = "/no-image.png";
                      }}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
                      style={{ backgroundColor: C.dark, color: "#FFFFFF" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                {newImages.map((image, index) => (
                  <ImagePreview
                    key={`${image.name}-${index}`}
                    image={image}
                    onRemove={() => removeNewImage(index)}
                  />
                ))}

                {existingImages.length + newImages.length < 5 && (
                  <label
                    className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition gap-2"
                    style={{
                      borderColor: C.blush,
                      backgroundColor: C.cream,
                      color: C.teal,
                    }}
                  >
                    <Upload size={20} />
                    <span className="text-xs font-semibold">Upload</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-4 font-bold transition shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: C.coral, color: "#FFFFFF" }}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
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
| Image Preview Component
|--------------------------------------------------------------------------
*/
function ImagePreview({ image, onRemove }) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!image) return undefined;

    const url = URL.createObjectURL(image);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  return (
    <div
      className="relative aspect-square rounded-xl overflow-hidden border group"
      style={{ borderColor: C.blush, backgroundColor: C.cream }}
    >
      <img
        src={preview}
        alt="preview"
        onError={(e) => {
          e.currentTarget.src = "/no-image.png";
        }}
        className="w-full h-full object-cover"
      />

      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 p-1.5 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
        style={{ backgroundColor: C.dark, color: "#FFFFFF" }}
      >
        <X size={14} />
      </button>
    </div>
  );
}