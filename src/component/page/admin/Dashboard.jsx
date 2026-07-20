
import React, { useEffect, useState } from 'react';
import { PlusCircle, Trash2, Edit, Loader2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProductService } from "../../../services/productService"; 
import { showToast } from "../../../config/toast"; 
import { FRONTEND_MESSAGES } from "../../../constants/messages";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); 
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await ProductService.getAll();
      setProducts(res?.data || res || []); 
    } catch (err) {
      showToast.error(FRONTEND_MESSAGES.PRODUCT.FETCH_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (targetId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      setActionLoading(targetId);
      await ProductService.delete(targetId);

      showToast.success(FRONTEND_MESSAGES.PRODUCT.DELETE_SUCCESS);
      setProducts((prev) => prev.filter((item) => item.id !== targetId && item._id !== targetId));
    } catch (err) {
      showToast.error(FRONTEND_MESSAGES.PRODUCT.DELETE_FAILED);
    } finally {
      setActionLoading(null);
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct({
      ...product,
   
      isActive: product.isActive ?? false, 
      dimensions: product.specifications?.dimensions || "",
      weight: product.specifications?.weight || "",
      composition: product.specifications?.composition || "",
      placement: product.specifications?.placement || "",
      finish: product.specifications?.finish || ""
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const idToUpdate = selectedProduct._id || selectedProduct.id;
    
    const updatedPayload = {
      title: selectedProduct.title,
      collectionName: selectedProduct.collectionName,
      category: selectedProduct.category,
      sku: selectedProduct.sku,
      description: selectedProduct.description,
      longDescription: selectedProduct.longDescription,
      price: Number(selectedProduct.price),
      originalPrice: Number(selectedProduct.originalPrice),
      discountPercentage: Number(selectedProduct.discountPercentage),
      stock: Number(selectedProduct.stock),
    
      isActive: selectedProduct.isActive === "true" || selectedProduct.isActive === true,
      specifications: {
        dimensions: selectedProduct.dimensions,
        weight: selectedProduct.weight,
        composition: selectedProduct.composition,
        placement: selectedProduct.placement,
        finish: selectedProduct.finish
      }
    };

    const toastId = showToast.loading("Saving structural schema updates...");
    try {
      await ProductService.update(idToUpdate, updatedPayload);
      showToast.dismiss(toastId);
      showToast.success("Product schema modified successfully.");
      setIsEditModalOpen(false);
      fetchProducts(); 
    } catch (err) {
      showToast.dismiss(toastId);
      showToast.error(err.message || "Schema constraint execution failed.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight font-heading">
            Products Catalog Management
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Total Live Inventory: <span className="text-slate-900 font-bold">{products.length}</span> items
          </p>
        </div>
        
        <button 
          onClick={() => navigate("/admin/add-product")}
          className="bg-slate-950 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-900 hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 shrink-0"
        >
          <PlusCircle size={18} className="text-amber-500" /> 
          Add New Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[11px] tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Preview</th>
                <th className="p-4">Custom ID</th>
                <th className="p-4">Title</th>
                <th className="p-4">SKU Code</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-16 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={28} className="animate-spin text-amber-500" />
                      <span className="font-medium text-sm">Syncing Inventory Database...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <div className="inline-flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-3 text-slate-400">
                        <PlusCircle size={24} />
                      </div>
                      <span className="text-slate-500 font-semibold mb-1">No products found</span>
                      <span className="text-xs text-slate-400">Click "Add New Product" to start building your catalog.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const currentId = product._id || product.id;
                  return (
                    <tr key={currentId} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="p-4 pl-6">
                        <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                          <img 
                            src={product.images?.[0] || "https://placehold.co/150?text=No+Image"} 
                            alt={product.title} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                          />
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-400 text-xs">#{product.id || 'N/A'}</td>
                      <td className="p-4 font-semibold text-slate-800">{product.title}</td>
                      <td className="p-4 text-xs font-mono text-slate-500 tracking-wider">
                        <span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                          {product.sku || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-emerald-600">₹{product.price}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => openEditModal(product)}
                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" 
                            title="Edit Product"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(currentId)} 
                            disabled={actionLoading === currentId}
                            className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-40" 
                            title="Delete Product"
                          >
                            {actionLoading === currentId ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

  
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Modify Catalog Product</h3>
                <p className="text-xs text-slate-400">ID: {selectedProduct._id || selectedProduct.id}</p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Product Title</label>
                  <input 
                    type="text" required value={selectedProduct.title} 
                    onChange={(e) => setSelectedProduct({...selectedProduct, title: e.target.value})}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-950 transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">SKU String</label>
                  <input 
                    type="text" required value={selectedProduct.sku} 
                    onChange={(e) => setSelectedProduct({...selectedProduct, sku: e.target.value})}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-slate-950 transition"
                  />
                </div>
              </div>

   
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Collection</label>
                  <input 
                    type="text" required value={selectedProduct.collectionName} 
                    onChange={(e) => setSelectedProduct({...selectedProduct, collectionName: e.target.value})}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-950 transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Category</label>
                  <input 
                    type="text" required value={selectedProduct.category} 
                    onChange={(e) => setSelectedProduct({...selectedProduct, category: e.target.value})}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-950 transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Stock Vol</label>
                  <input 
                    type="number" required value={selectedProduct.stock} 
                    onChange={(e) => setSelectedProduct({...selectedProduct, stock: e.target.value})}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-950 transition"
                  />
                </div>
                
         
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Status</label>
                  <select 
                    value={selectedProduct.isActive} 
                    onChange={(e) => setSelectedProduct({...selectedProduct, isActive: e.target.value === "true"})}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-950 transition cursor-pointer appearance-none"
                  >
                    <option value="false">Inactive</option>
                    <option value="true">Active</option>
                  </select>
                </div>
              
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Active Price (₹)</label>
                  <input 
                    type="number" required value={selectedProduct.price} 
                    onChange={(e) => setSelectedProduct({...selectedProduct, price: e.target.value})}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-950 transition font-bold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Original Price</label>
                  <input 
                    type="number" value={selectedProduct.originalPrice || ""} 
                    onChange={(e) => setSelectedProduct({...selectedProduct, originalPrice: e.target.value})}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-950 transition text-slate-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Discount %</label>
                  <input 
                    type="number" value={selectedProduct.discountPercentage || 0} 
                    onChange={(e) => setSelectedProduct({...selectedProduct, discountPercentage: e.target.value})}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-950 transition"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-3 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Dimensions</label>
                    <input 
                      type="text" required value={selectedProduct.dimensions} 
                      onChange={(e) => setSelectedProduct({...selectedProduct, dimensions: e.target.value})}
                      className="w-full px-3 py-1.5 bg-white border rounded-lg text-xs focus:outline-none focus:border-slate-950"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Weight</label>
                    <input 
                      type="text" required value={selectedProduct.weight} 
                      onChange={(e) => setSelectedProduct({...selectedProduct, weight: e.target.value})}
                      className="w-full px-3 py-1.5 bg-white border rounded-lg text-xs focus:outline-none focus:border-slate-950"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Short Description</label>
                <textarea 
                  rows={2} required value={selectedProduct.description} 
                  onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-950 transition resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <button 
                  type="button" onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 border rounded-xl text-sm font-semibold hover:bg-slate-50 text-slate-600 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-slate-950 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition shadow-md"
                >
                  Commit Alteration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}