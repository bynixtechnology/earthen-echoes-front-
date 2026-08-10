import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  X,
  Tag,
  Upload,
  FileText,
  Heading,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../config/toast";
import { C } from "../../../constants/theme";
import {
  fetchProductTags,
  createProductTag,
  updateProductTag,
  deleteProductTag,
} from "../../../redux/thunks/productTagThunk";

const AddProductTag = () => {
  const dispatch = useDispatch();
  const { tags, loading } = useSelector((state) => state.productTags);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentTag, setCurrentTag] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    heading: "",
    description: "",
    image: "",
    imageFile: null,
  });

  useEffect(() => {
    dispatch(fetchProductTags());
  }, [dispatch]);

  const handleOpenModal = (tag = null) => {
    if (tag) {
      setFormData({
        id: tag._id || tag.id,
        name: tag.name || "",
        heading: tag.heading || "",
        description: tag.description || "",
        image: tag.image || "",
        imageFile: null,
      });
    } else {
      setFormData({
        id: null,
        name: "",
        heading: "",
        description: "",
        image: "",
        imageFile: null,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSubmitting(false);
    setFormData({
      id: null,
      name: "",
      heading: "",
      description: "",
      image: "",
      imageFile: null,
    });
  };

  const handleViewModal = (tag) => {
    setCurrentTag(tag);
    setIsViewModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
        image: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.heading) {
      showToast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("heading", formData.heading);
    data.append("description", formData.description || "");

    if (formData.imageFile) {
      data.append("image", formData.imageFile);
    } else if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (formData.id) {
        const resultAction = await dispatch(
          updateProductTag({ id: formData.id, tagData: data })
        );
        if (updateProductTag.fulfilled.match(resultAction)) {
          showToast.success("Product tag updated successfully.");
          handleCloseModal();
          dispatch(fetchProductTags());
        } else {
          showToast.error(resultAction.payload || "Failed to update tag.");
          setSubmitting(false);
        }
      } else {
        const resultAction = await dispatch(createProductTag(data));
        if (createProductTag.fulfilled.match(resultAction)) {
          showToast.success("Product tag created successfully.");
          handleCloseModal();
          dispatch(fetchProductTags());
        } else {
          showToast.error(resultAction.payload || "Failed to create tag.");
          setSubmitting(false);
        }
      }
    } catch (error) {
      showToast.error("Something went wrong.");
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
      try {
        const resultAction = await dispatch(deleteProductTag(id));
        if (deleteProductTag.fulfilled.match(resultAction)) {
          showToast.success("Product tag deleted successfully.");
          dispatch(fetchProductTags());
        } else {
          showToast.error(resultAction.payload || "Failed to delete tag.");
        }
      } catch (error) {
        showToast.error("Something went wrong.");
      }
    }
  };

  const filteredTags = (tags || []).filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            Product Tags Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create and manage product tags, descriptions, and tag visuals.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-md transition active:scale-95 whitespace-nowrap"
          style={{ background: C.coral }}
        >
          <Plus size={18} /> Add Product Tag
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search tags by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#F16937] focus:bg-white transition"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="p-4 sm:px-6">Image</th>
                <th className="p-4 sm:px-6">Tag Name</th>
                <th className="p-4 sm:px-6">Heading</th>
                <th className="p-4 sm:px-6">Description</th>
                <th className="p-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    Loading tags...
                  </td>
                </tr>
              ) : filteredTags.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    No product tags found.
                  </td>
                </tr>
              ) : (
                filteredTags.map((tag) => (
                  <tr key={tag._id || tag.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 sm:px-6">
                      <div className="h-12 w-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                        <img
                          src={tag.image || "/placeholder.png"}
                          alt={tag.name}
                          className="h-full w-full object-cover"
                          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                        />
                      </div>
                    </td>
                    <td className="p-4 sm:px-6 font-semibold text-slate-800">
                      <span 
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold border"
                        style={{ background: C.paleCoral, color: C.coral, borderColor: C.blush }}
                      >
                        <Tag size={12} /> {tag.name}
                      </span>
                    </td>
                    <td className="p-4 sm:px-6 font-medium text-slate-700">{tag.heading}</td>
                    <td className="p-4 sm:px-6 text-slate-500 max-w-xs truncate">
                      {tag.description || "No description provided"}
                    </td>
                    <td className="p-4 sm:px-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleViewModal(tag)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenModal(tag)}
                          className="rounded-lg p-2 hover:bg-orange-50 transition"
                          style={{ color: C.coral }}
                          title="Edit Tag"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(tag._id || tag.id)}
                          className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 transition"
                          title="Delete Tag"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                {formData.id ? "Edit Product Tag" : "Create New Product Tag"}
              </h3>
              <button
                onClick={handleCloseModal}
                disabled={submitting}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Tag Name *
                </label>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="e.g. Best Seller, Trending"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={submitting}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm outline-none focus:border-[#F16937] focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Heading *
                </label>
                <div className="relative">
                  <Heading className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="e.g. Top Rated Collections"
                    value={formData.heading}
                    onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                    required
                    disabled={submitting}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm outline-none focus:border-[#F16937] focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Description
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                  <textarea
                    rows={3}
                    placeholder="Enter short description about this tag..."
                    value={formData.description}
                    disabled={submitting}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm outline-none focus:border-[#F16937] focus:bg-white transition resize-none"
                  />
                </div>
              </div>

              {/* Enhanced Image File Upload Component */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Tag Image
                </label>
                <div className="flex items-center gap-4">
                  {formData.image ? (
                    <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0 shadow-sm group">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      {!submitting && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: "", imageFile: null })}
                          className="absolute inset-0 bg-slate-900/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ) : null}

                  <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-4 bg-slate-50 hover:bg-slate-100/60 cursor-pointer transition">
                    <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs mb-1">
                      <Upload size={16} className="text-[#F16937]" /> Upload image file
                    </div>
                    <p className="text-[11px] text-slate-400">SVG, PNG, JPG or WEBP (Max. 5MB)</p>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={submitting}
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-md transition disabled:opacity-70"
                  style={{ background: C.coral }}
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {submitting
                    ? formData.id
                      ? "Updating..."
                      : "Creating..."
                    : formData.id
                    ? "Update Tag"
                    : "Create Tag"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Popup Modal */}
      {isViewModalOpen && currentTag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-lg font-bold font-heading text-slate-900">Tag Details</h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="h-48 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={currentTag.image || "/placeholder.png"}
                  alt={currentTag.name}
                  className="h-full w-full object-cover"
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tag Name</span>
                <p className="font-bold text-slate-800 text-base mt-0.5">{currentTag.name}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Heading</span>
                <p className="font-semibold text-slate-700 mt-0.5">{currentTag.heading}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</span>
                <p className="text-slate-600 text-sm mt-0.5 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {currentTag.description || "No description provided."}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductTag;