import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
  exportCategoriesExcel,
  importCategoriesExcel,
} from "../../../redux/thunks/categoryThunk";

import {
  selectCategories,
  selectCategoriesLoading,
  selectCategoryActionLoading,
  selectCategoryPagination,
  selectCategoryExcelLoading,
} from "../../../redux/slices/categorySlice";

import { showToast } from "../../../config/toast";

import CategoryHeader from "./category/CategoryHeader";
import CategoryToolbar from "./category/CategoryToolbar";
import CategoryTable from "./category/CategoryTable";
import CategoryPagination from "./category/CategoryPagination";
import CategoryModal from "./category/CategoryModal";

const INITIAL_FORM = {
  name: "",
  title: "",
  description: "",
  sortOrder: 0,
};

export default function AddCategory() {
  const dispatch = useDispatch();

  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoriesLoading);
  const isSubmitting = useSelector(selectCategoryActionLoading);
  const pagination = useSelector(selectCategoryPagination);
  const excelLoading = useSelector(selectCategoryExcelLoading);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [actionLoading, setActionLoading] = useState(null);

  const fileInputRef = useRef(null);

  /*
  |--------------------------------------------------------------------------
  | Load Categories
  |--------------------------------------------------------------------------
  */
  const loadCategories = (
    currentPage = page,
    searchValue = search,
    currentLimit = limit
  ) => {
    dispatch(
      fetchCategories({
        page: currentPage,
        limit: currentLimit,
        search: searchValue.trim(),
      })
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Fetch With Debounced Search
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    const timer = setTimeout(() => {
      loadCategories(page, search, limit);
    }, 400);

    return () => clearTimeout(timer);
  }, [dispatch, page, limit, search]);

  /*
  |--------------------------------------------------------------------------
  | Cleanup Preview
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  /*
  |--------------------------------------------------------------------------
  | Form Change
  |--------------------------------------------------------------------------
  */
  const handleFormChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Image Selection & Removal
  |--------------------------------------------------------------------------
  */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast.error("Please select a valid image.");
      e.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast.error("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (isSubmitting) return;

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setImage(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Reset Form
  |--------------------------------------------------------------------------
  */
  const resetForm = () => {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setEditingCategory(null);
    setForm({ ...INITIAL_FORM });
    setImage(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Open Create Modal
  |--------------------------------------------------------------------------
  */
  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Open Edit Modal
  |--------------------------------------------------------------------------
  */
  const openEditModal = (category) => {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setEditingCategory(category);
    setForm({
      name: category?.name || "",
      title: category?.title || "",
      description: category?.description || "",
      sortOrder: category?.sortOrder ?? 0,
    });

    setImage(null);
    setPreview(category?.image || null);
    setIsModalOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Close Modal
  |--------------------------------------------------------------------------
  */
  const closeModal = () => {
    if (isSubmitting) return;

    resetForm();
    setIsModalOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Submit Form (Create / Update)
  |--------------------------------------------------------------------------
  */
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (isSubmitting) return;

    const cleanName = form.name.trim();
    const cleanTitle = form.title.trim();
    const cleanDescription = form.description.trim();

    if (!cleanName) {
      showToast.error("Category name is required.");
      return;
    }

    if (!cleanTitle) {
      showToast.error("Category title is required.");
      return;
    }

    if (!editingCategory && !image) {
      showToast.error("Category image is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", cleanName);
    formData.append("title", cleanTitle);
    formData.append("description", cleanDescription);
    formData.append("sortOrder", String(Number(form.sortOrder) || 0));

    if (image) {
      formData.append("image", image);
    }

    try {
      let response;

      if (editingCategory?._id) {
        // FIX: Payload key changed from formData to data to match categoryThunk.js
        response = await dispatch(
          updateCategory({
            id: editingCategory._id,
            data: formData,
          })
        ).unwrap();
      } else {
        response = await dispatch(createCategory(formData)).unwrap();
      }

      showToast.success(
        response?.message ||
          (editingCategory
            ? "Category updated successfully."
            : "Category created successfully.")
      );

      resetForm();
      setIsModalOpen(false);

      if (!editingCategory && page !== 1) {
        setPage(1);
      } else {
        loadCategories(page, search, limit);
      }
    } catch (error) {
      showToast.error(
        typeof error === "string"
          ? error
          : error?.message || "Something went wrong."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Category
  |--------------------------------------------------------------------------
  */
  const handleDelete = async (category) => {
    const id = category?._id || category?.id;

    if (!id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${category?.name}"?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(id);

      const response = await dispatch(deleteCategory(id)).unwrap();

      showToast.success(
        response?.message || "Category deleted successfully."
      );

      if (categories.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        loadCategories(page, search, limit);
      }
    } catch (error) {
      showToast.error(
        typeof error === "string"
          ? error
          : error?.message || "Failed to delete category."
      );
    } finally {
      setActionLoading(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Toggle Category Status
  |--------------------------------------------------------------------------
  */
  const handleStatus = async (category) => {
    const id = category?._id || category?.id;

    if (!id) return;

    const newStatus = !Boolean(category?.isActive);

    try {
      setActionLoading(id);

      const response = await dispatch(
        updateCategoryStatus({
          id,
          isActive: newStatus,
        })
      ).unwrap();

      showToast.success(
        response?.message ||
          `Category ${newStatus ? "activated" : "deactivated"} successfully.`
      );

      loadCategories(page, search, limit);
    } catch (error) {
      showToast.error(
        typeof error === "string"
          ? error
          : error?.message || "Failed to update category status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Pagination & Filters
  |--------------------------------------------------------------------------
  */
  const totalPages = Math.max(
    Number(pagination?.totalPages || pagination?.pages || 1),
    1
  );

  const totalCategories = Number(
    pagination?.total ??
      pagination?.totalCategories ??
      pagination?.totalItems ??
      categories.length
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | Excel Export / Import
  |--------------------------------------------------------------------------
  */
  const handleExportExcel = async () => {
    try {
      await dispatch(exportCategoriesExcel()).unwrap();
      showToast.success("Categories exported successfully.");
    } catch (error) {
      showToast.error(error?.message || "Export failed.");
    }
  };

  const handleImportExcel = async (file) => {
    try {
      const response = await dispatch(importCategoriesExcel(file)).unwrap();
      showToast.success(
        response?.message || "Categories imported successfully."
      );
      loadCategories(page, search, limit);
    } catch (error) {
      showToast.error(
        typeof error === "string"
          ? error
          : error?.message || "Import failed."
      );
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <CategoryHeader onAdd={openCreateModal} />

      <CategoryToolbar
        search={search}
        onSearchChange={handleSearchChange}
        total={totalCategories}
        onImport={handleImportExcel}
        onExport={handleExportExcel}
        importLoading={excelLoading}
        exportLoading={excelLoading}
      />

      <CategoryTable
        categories={categories}
        loading={loading}
        actionLoading={actionLoading}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onStatus={handleStatus}
      />

      <CategoryPagination
        page={page}
        totalPages={totalPages}
        total={totalCategories}
        limit={limit}
        loading={loading}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />

      <CategoryModal
        open={isModalOpen}
        editingCategory={editingCategory}
        form={form}
        preview={preview}
        fileInputRef={fileInputRef}
        isSubmitting={isSubmitting}
        onChange={handleFormChange}
        onImageChange={handleImageChange}
        onRemoveImage={removeImage}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}