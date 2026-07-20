
import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { Upload, X, Loader2, ArrowLeft } from "lucide-react";

import { ProductService, CategoryService } from "../../../services/productService"; 
import { showToast } from "../../../config/toast";
import { FRONTEND_MESSAGES } from "../../../constants/messages";

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  
 
  const [categories, setCategories] = useState([]); 
  const [loadingCategories, setLoadingCategories] = useState(true);
  

const [formData, setFormData] = useState({
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
  isActive: false
});


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await CategoryService.getAll();

        setCategories(res?.data || res || []);
      } catch (error) {
        showToast.error("Failed to load dynamic categories from backend.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
  
    if (images.length + files.length > 5) {
      showToast.error("Validation Error: Exceeds the schema limit of 5 images.");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return;

  if (!formData.category) {
    showToast.error(
      "Please select a valid category from the dropdown."
    );
    return;
  }

  setLoading(true);

  const data = new FormData();

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

  baseFields.forEach((key) => {
    if (formData[key] !== "") {
      data.append(
        key,
        formData[key]
      );
    }
  });

  const specsObject = {
    dimensions: formData.dimensions,
    weight: formData.weight,
    composition: formData.composition,
    placement: formData.placement,
    finish: formData.finish,
  };

  data.append(
    "specifications",
    JSON.stringify(specsObject)
  );

  data.append(
    "isActive",
    String(formData.isActive)
  );

  images.forEach((img) => {
    data.append(
      "images",
      img
    );
  });

  try {
  const response = await ProductService.create(data);

  console.log("CREATE PRODUCT RESPONSE:", response);

  showToast.success(
    response?.data?.message ||
    response?.message ||
    "Product created successfully."
  );

  // Hard redirect to dashboard
  window.location.href = "/admin/dashboard";

  return;

} catch (err) {
  console.error(
    "CREATE PRODUCT ERROR:",
    err
  );

  showToast.error(
    err?.response?.data?.message ||
    err?.message ||
    "Failed to create product."
  );

} finally {
  setLoading(false);
}
};


return (
    <div className="max-w-6xl mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      
      <div className="flex items-center gap-3">
        <button 
          type="button" onClick={() => navigate("/admin/dashboard")}
          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition shadow-sm text-slate-600"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Catalog New Mapped Product</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Strict layout aligned directly with core Mongoose database structure</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          
       
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 border-b pb-2">1. Core Identifiers</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Numerical ID (Unique)</label>
                <input 
                  type="number" required name="id" value={formData.id} onChange={handleInputChange} placeholder="101"
                 className="w-full px-3 py-2.5 sm:px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-slate-950 focus:outline-none transition"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Product Title</label>
                <input 
                  type="text" required name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Clay Pitcher"
                className="w-full px-3 py-2 sm:px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-slate-950 focus:outline-none transition resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4"> 
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">SKU Tracking</label>
                <input 
                  type="text" required name="sku" value={formData.sku} onChange={handleInputChange} placeholder="EE-POT-01"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-slate-950 focus:outline-none transition font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Collection Name</label>
                <input 
                  type="text" required name="collectionName" value={formData.collectionName} onChange={handleInputChange} placeholder="Summer Harvest"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-slate-950 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Category *</label>
                <select 
                  required 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange}
                  disabled={loadingCategories}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-slate-950 focus:outline-none transition cursor-pointer appearance-none"
                >
                  <option value="" disabled>
                    {loadingCategories ? "Loading categories..." : "Select Platform Category"}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id || cat.id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

           
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Product Status</label>
                <select 
                  name="isActive" 
                  value={formData.isActive} 
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-slate-950 focus:outline-none transition cursor-pointer appearance-none"
                >
                  <option value="false">Inactive (False)</option>
                  <option value="true">Active (True)</option>
                </select>
              </div>
             

            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2">2. Financials & Logistics</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Sale Price (INR)</label>
                <input 
                  type="number" required name="price" value={formData.price} onChange={handleInputChange} placeholder="499"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-slate-950 focus:outline-none transition font-semibold text-emerald-600"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Original Price</label>
                <input 
                  type="number" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} placeholder="699"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-slate-950 focus:outline-none transition text-slate-400 line-through"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Discount %</label>
                <input 
                  type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-slate-950 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Stock Volume</label>
                <input 
                  type="number" required name="stock" value={formData.stock} onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-slate-950 focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2">3. Mongoose Inner Specifications Block</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Dimensions (Req)</label>
                <input 
                  type="text" required name="dimensions" value={formData.dimensions} onChange={handleInputChange} placeholder="12x6x6 inches"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-slate-950 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Weight (Req)</label>
                <input 
                  type="text" required name="weight" value={formData.weight} onChange={handleInputChange} placeholder="1.4 kg"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-slate-950 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Clay Composition</label>
                <input 
                  type="text" name="composition" value={formData.composition} onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-slate-950 focus:outline-none transition text-slate-600"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Placement Target</label>
                <input 
                  type="text" name="placement" value={formData.placement} onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-slate-950 focus:outline-none transition text-slate-600"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Texture Finish</label>
                <input 
                  type="text" name="finish" value={formData.finish} onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-slate-950 focus:outline-none transition text-slate-600"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4 sm:space-y-6">
      
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex-1">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2">4. Copywriting Context</h3>
            
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Brief Description (Short)</label>
              <textarea 
                rows={2} required name="description" value={formData.description} onChange={handleInputChange} placeholder="Short text snippet for cards..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-slate-950 focus:outline-none transition resize-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Comprehensive Narrative (Long Description 1)
              </label>

              <textarea
                rows={5}
                required
                name="longDescription1"
                value={formData.longDescription1}
                onChange={handleInputChange}
                placeholder="Second Long Description..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-slate-950 focus:outline-none transition resize-none"
              />
            </div>
            
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Comprehensive Narrative (Long Description)</label>
              <textarea 
                rows={5} required name="longDescription" value={formData.longDescription} onChange={handleInputChange} placeholder="Full dynamic narrative breakdown for product pages..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-slate-950 focus:outline-none transition resize-none"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-1">5. Product Vault Media</h3>
            <p className="text-[11px] text-slate-400 font-medium">Validating bounds: Max 5 strict image attachments.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 ">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                  <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                  <button 
                    type="button" onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-slate-950 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition duration-150"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-400 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50/50 text-slate-400 gap-1 p-2">
                  <Upload size={18} />
                  <span className="text-[9px] font-black uppercase tracking-wider">Inject</span>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full rounded-xl bg-slate-950 py-3 sm:py-4 text-sm sm:text-base font-bold text-white hover:bg-slate-900 active:scale-[0.99] transition shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <><Loader2 className="animate-spin" size={18} /> Syncing Schema Buffer...</> : "Commit Product Document"}
          </button>

        </div>
      </form>
    </div>
  );
} 