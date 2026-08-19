import React, { useEffect, useState } from "react";
import {
  Home,
  Plus,
  Pencil,
  Trash2,
  X,
  MapPin,
  Phone,
  User,
  Building,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { C } from "../../../../constants/theme";

const emptyForm = {
  type: "Home",
  fullName: "",
  phone: "",
  street: "",
  landmark: "",
  city: "",
  state: "",
  zipCode: "",
  country: "India",
  isDefault: false,
};

const AddressTab = ({ user, loading = false, onUpdate }) => {
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.addresses) {
      setAddresses(user.addresses);
    }
  }, [user]);

  const showNotification = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({
      ...emptyForm,
      fullName: user?.name || "",
      phone: user?.phone || "",
      isDefault: addresses.length === 0,
    });
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item._id || item.id);
    setFormData({
      type: item.type || "Home",
      fullName: item.fullName || "",
      phone: item.phone || "",
      street: item.street || "",
      landmark: item.landmark || "",
      city: item.city || "",
      state: item.state || "",
      zipCode: item.zipCode || "",
      country: item.country || "India",
      isDefault: item.isDefault || false,
    });
    setIsModalOpen(true);
  };

  const close = () => {
    setEditingId(null);
    setIsModalOpen(false);
    setFormData(emptyForm);
  };

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add / Edit handler
  const save = async (e) => {
    e.preventDefault();
    if (!onUpdate) return;

    try {
      setSaving(true);
      let updatedList = [];

      if (editingId) {
        // Edit mode
        updatedList = addresses.map((addr) => {
          const id = addr._id || addr.id;
          if (id === editingId) {
            return {
              ...addr,
              ...formData,
              isDefault: formData.isDefault,
            };
          }
          return formData.isDefault ? { ...addr, isDefault: false } : addr;
        });
      } else {
        // Add new mode
        const shouldBeDefault = formData.isDefault || addresses.length === 0;
        const existingList = shouldBeDefault
          ? addresses.map((a) => ({ ...a, isDefault: false }))
          : [...addresses];

        const newAddress = {
          ...formData,
          isDefault: shouldBeDefault,
        };

        updatedList = [...existingList, newAddress];
      }

      await onUpdate({ addresses: updatedList });
      setAddresses(updatedList);
      showNotification(
        editingId ? "Address updated successfully." : "Address added successfully."
      );
      close();
    } catch (err) {
      console.error("Save address error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Delete handler
  const del = async (id) => {
    try {
      let updatedList = addresses.filter((a) => (a._id || a.id) !== id);

      // Agar default delete hua aur list khali nahi hai to pehle wale ko default set karein
      if (updatedList.length > 0 && !updatedList.some((a) => a.isDefault)) {
        updatedList[0] = { ...updatedList[0], isDefault: true };
      }

      setAddresses(updatedList);
      if (onUpdate) {
        await onUpdate({ addresses: updatedList });
        showNotification("Address removed successfully.");
      }
    } catch (err) {
      console.error("Delete address error:", err);
    }
  };

  // Set Default handler
  const setDefault = async (id) => {
    try {
      const updatedList = addresses.map((a) => ({
        ...a,
        isDefault: (a._id || a.id) === id,
      }));

      setAddresses(updatedList);
      if (onUpdate) {
        await onUpdate({ addresses: updatedList });
        showNotification("Default address updated.");
      }
    } catch (err) {
      console.error("Set default error:", err);
    }
  };

  return (
    <div
      className="p-6 sm:p-8 rounded-3xl"
      style={{ backgroundColor: C.cream, color: C.dark }}
    >
      {/* Tab Header */}
      <div
        className="flex justify-between items-center mb-6 pb-4 border-b"
        style={{ borderColor: `${C.dark}15` }}
      >
        <div>
          <h2 className="text-2xl font-bold font-heading">Address Book</h2>
          <p className="text-xs sm:text-sm mt-1" style={{ color: `${C.dark}80` }}>
            Manage your saved shipping addresses for faster checkout.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:opacity-90 active:scale-95 cursor-pointer"
          style={{ backgroundColor: C.coral }}
        >
          <Plus size={18} />
          <span>Add Address</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className="mb-4 flex items-center gap-2 text-sm font-semibold p-3 rounded-2xl transition-all"
          style={{ backgroundColor: C.paleGreen, color: C.green }}
        >
          <CheckCircle2 size={18} />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {addresses.length === 0 ? (
          <div className="col-span-full">
            <div
              className="rounded-3xl border-2 border-dashed py-14 px-8 text-center"
              style={{ borderColor: `${C.dark}20`, backgroundColor: C.ivory }}
            >
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: C.paleCoral }}
              >
                <MapPin size={32} style={{ color: C.coral }} />
              </div>
              <h3 className="text-xl font-bold font-heading">No Address Found</h3>
              <p className="mt-2 text-xs sm:text-sm" style={{ color: `${C.dark}70` }}>
                You haven't saved any addresses yet.
              </p>
              <button
                onClick={openAdd}
                className="mt-5 rounded-full px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:opacity-90 active:scale-95 cursor-pointer"
                style={{ backgroundColor: C.coral }}
              >
                <Plus className="mr-1.5 inline" size={16} />
                Add New Address
              </button>
            </div>
          </div>
        ) : (
          addresses.map((item) => (
            <div
              key={item._id || item.id || Math.random()}
              className="group relative overflow-hidden rounded-3xl border shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              style={{
                backgroundColor: C.ivory,
                borderColor: `${C.dark}15`,
              }}
            >
              {/* Top Accent Strip */}
              <div
                className="h-2"
                style={{
                  background: `linear-gradient(90deg, ${C.coral} 0%, ${C.raspberry} 50%, ${C.teal} 100%)`,
                }}
              />

              <div className="p-5 sm:p-6">
                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: C.paleCoral, color: C.coral }}
                    >
                      {item.type === "Home" ? (
                        <Home size={22} />
                      ) : item.type === "Office" ? (
                        <Building size={22} />
                      ) : (
                        <MapPin size={22} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold font-heading">
                        {item.type || "Address"}
                      </h3>
                      {item.isDefault && (
                        <span
                          className="mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                          style={{
                            backgroundColor: C.paleGreen,
                            color: C.green,
                          }}
                        >
                          <CheckCircle2 size={12} className="mr-1" /> Default
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(item)}
                      className="rounded-xl p-2 transition hover:bg-white cursor-pointer"
                      style={{ color: C.teal }}
                      title="Edit Address"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => del(item._id || item.id)}
                      className="rounded-xl p-2 transition hover:bg-white cursor-pointer"
                      style={{ color: C.raspberry }}
                      title="Delete Address"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div
                  className="my-4 border-t border-dashed"
                  style={{ borderColor: `${C.dark}15` }}
                />

                {/* Details */}
                <div className="space-y-2.5 text-xs sm:text-sm font-medium">
                  <div className="flex items-center gap-2.5">
                    <User size={15} style={{ color: C.coral }} />
                    <span>{item.fullName}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone size={15} style={{ color: C.teal }} />
                    <span>{item.phone}</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin
                      size={15}
                      className="mt-0.5 shrink-0"
                      style={{ color: C.raspberry }}
                    />
                    <div style={{ color: `${C.dark}80` }}>
                      <div>{item.street}</div>
                      {item.landmark && <div>{item.landmark}</div>}
                      <div>
                        {item.city}, {item.state} - {item.zipCode}
                      </div>
                      <div>{item.country}</div>
                    </div>
                  </div>
                </div>

                {!item.isDefault && (
                  <button
                    onClick={() => setDefault(item._id || item.id)}
                    className="mt-5 w-full rounded-full border py-2.5 text-xs font-bold transition hover:bg-white cursor-pointer"
                    style={{ borderColor: C.coral, color: C.coral }}
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border shadow-2xl transition-all"
            style={{
              backgroundColor: C.cream,
              borderColor: `${C.dark}20`,
            }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between border-b px-6 py-4"
              style={{ borderColor: `${C.dark}15` }}
            >
              <div>
                <h2 className="text-xl font-bold font-heading">
                  {editingId ? "Edit Address" : "Add New Address"}
                </h2>
                <p className="text-xs mt-0.5" style={{ color: `${C.dark}70` }}>
                  Enter details for delivery.
                </p>
              </div>
              <button
                onClick={close}
                className="rounded-full p-2 hover:bg-black/5 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <div className="overflow-y-auto max-h-[calc(90vh-85px)] px-6 py-5">
              <form onSubmit={save} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-bold">
                      Address Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={change}
                      className="w-full rounded-2xl border px-4 py-2.5 text-xs sm:text-sm font-medium outline-none bg-[#FFFDF9] focus:border-[#F16937]"
                      style={{ borderColor: `${C.dark}20` }}
                    >
                      <option value="Home">🏠 Home</option>
                      <option value="Office">🏢 Office</option>
                      <option value="Other">📍 Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={change}
                      placeholder="Ravinder Kumar"
                      className="w-full rounded-2xl border px-4 py-2.5 text-xs sm:text-sm outline-none bg-[#FFFDF9] focus:border-[#F16937]"
                      style={{ borderColor: `${C.dark}20` }}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-bold">
                      Mobile Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={change}
                      placeholder="9876543210"
                      className="w-full rounded-2xl border px-4 py-2.5 text-xs sm:text-sm outline-none bg-[#FFFDF9] focus:border-[#F16937]"
                      style={{ borderColor: `${C.dark}20` }}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold">
                      Landmark
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={change}
                      placeholder="Near City Park"
                      className="w-full rounded-2xl border px-4 py-2.5 text-xs sm:text-sm outline-none bg-[#FFFDF9] focus:border-[#F16937]"
                      style={{ borderColor: `${C.dark}20` }}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold">
                    Street Address *
                  </label>
                  <textarea
                    rows={2}
                    name="street"
                    value={formData.street}
                    onChange={change}
                    placeholder="House No, Building, Street Area..."
                    className="w-full rounded-2xl border px-4 py-2.5 text-xs sm:text-sm outline-none bg-[#FFFDF9] resize-none focus:border-[#F16937]"
                    style={{ borderColor: `${C.dark}20` }}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-bold">
                      City / District *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={change}
                      placeholder="Jaipur"
                      className="w-full rounded-2xl border px-4 py-2.5 text-xs sm:text-sm outline-none bg-[#FFFDF9] focus:border-[#F16937]"
                      style={{ borderColor: `${C.dark}20` }}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={change}
                      placeholder="Rajasthan"
                      className="w-full rounded-2xl border px-4 py-2.5 text-xs sm:text-sm outline-none bg-[#FFFDF9] focus:border-[#F16937]"
                      style={{ borderColor: `${C.dark}20` }}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-bold">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={change}
                      placeholder="302001"
                      className="w-full rounded-2xl border px-4 py-2.5 text-xs sm:text-sm outline-none bg-[#FFFDF9] focus:border-[#F16937]"
                      style={{ borderColor: `${C.dark}20` }}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={change}
                      className="w-full rounded-2xl border px-4 py-2.5 text-xs sm:text-sm outline-none bg-[#FFFDF9] focus:border-[#F16937]"
                      style={{ borderColor: `${C.dark}20` }}
                    />
                  </div>
                </div>

                <div
                  className="rounded-2xl border p-3 flex items-center gap-3 bg-[#FFFDF9]"
                  style={{ borderColor: `${C.dark}15` }}
                >
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={change}
                    className="h-4 w-4 accent-[#F16937] rounded-sm cursor-pointer"
                  />
                  <label
                    htmlFor="isDefault"
                    className="cursor-pointer text-xs font-bold"
                  >
                    Make this my default shipping address
                  </label>
                </div>

                <div
                  className="flex justify-end gap-3 pt-3 border-t"
                  style={{ borderColor: `${C.dark}15` }}
                >
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-full border px-6 py-2.5 text-xs sm:text-sm font-bold transition hover:bg-black/5 cursor-pointer"
                    style={{ borderColor: `${C.dark}20` }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full px-6 py-2.5 text-xs sm:text-sm font-bold text-white transition hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    style={{ backgroundColor: C.coral }}
                  >
                    {saving && <Loader2 size={16} className="animate-spin" />}
                    <span>
                      {saving
                        ? "Saving..."
                        : editingId
                        ? "Update Address"
                        : "Save Address"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressTab;