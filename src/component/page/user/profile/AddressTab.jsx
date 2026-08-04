import React, { useEffect, useState } from "react";
import {
  Home, Plus, Pencil, Trash2, CheckCircle, X,
  MapPin, Phone, User, Building, CheckCircle2
} from "lucide-react";

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
    if (user?.addresses) setAddresses(user.addresses);
  }, [user]);

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
  const close = () => { setEditingId(null); setIsModalOpen(false); setFormData(emptyForm); };
  const change = e => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const save = async (e) => {
    e.preventDefault();

    if (!onUpdate) {
      console.log("onUpdate function not found");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        address: {
          ...(editingId && { _id: editingId }),
          type: formData.type,
          fullName: formData.fullName,
          phone: formData.phone,
          street: formData.street,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          isDefault: formData.isDefault,
        },
      };

      console.log("Payload =>", payload);

      const response = await onUpdate(payload);

      console.log("Response =>", response);

      close();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    const list = addresses.filter(
      (a) => (a._id || a.id) !== id
    );
    setAddresses(list);
    if (onUpdate) await onUpdate({ addresses: list });
  };

  const setDefault = async (id) => {
    const list = addresses.map((a) => ({
      ...a,
      isDefault: (a._id || a.id) === id,
    }));
    setAddresses(list);
    if (onUpdate) await onUpdate({ addresses: list });
  };

  return <div className="text-[var(--card-foreground)]">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Address Book</h2>
      <button onClick={openAdd} className="flex gap-2 px-5 py-2 rounded bg-[var(--primary)] text-[var(--primary-foreground)]"><Plus size={18} />Add Address</button>
    </div>

    {statusMessage && <div className="mb-4 flex gap-2"><CheckCircle2 size={18} />{statusMessage}</div>}

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

      {addresses.length === 0 ? (

        <div className="col-span-full">

          <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-white py-16 px-8 text-center">

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">

              <MapPin
                size={40}
                className="text-blue-600"
              />

            </div>

            <h3 className="text-2xl font-bold">
              No Address Found
            </h3>

            <p className="mt-3 text-gray-500">
              You haven't added any address yet.
            </p>

            <button
              onClick={openAdd}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              <Plus className="mr-2 inline" size={18} />
              Add Address
            </button>

          </div>

        </div>

      ) : (

        addresses.map((item) => (

          <div
            key={item._id || item.id}
            className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >

            {/* Top Gradient */}

            <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

            <div className="p-6">

              {/* Header */}

              <div className="flex items-start justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">

                    {item.type === "Home" ? (
                      <Home size={26} />
                    ) : item.type === "Office" ? (
                      <Building size={26} />
                    ) : (
                      <MapPin size={26} />
                    )}

                  </div>

                  <div>

                    <h3 className="text-lg font-bold">
                      {item.type}
                    </h3>

                    {item.isDefault && (

                      <span className="mt-2 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                        <CheckCircle2
                          size={14}
                          className="mr-1"
                        />

                        Default

                      </span>

                    )}

                  </div>

                </div>

                <div className="flex gap-2">

                  <button
                    onClick={() => openEdit(item)}
                    className="rounded-xl p-2 text-blue-600 transition hover:bg-blue-100"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => del(item._id || item.id)}
                    className="rounded-xl p-2 text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>

              {/* Divider */}

              <div className="my-5 border-t border-dashed" />

              {/* Details */}

              <div className="space-y-4">

                <div className="flex items-center gap-3">

                  <div className="rounded-full bg-gray-100 p-2">
                    <User
                      size={16}
                      className="text-gray-500"
                    />
                  </div>

                  <span className="font-medium">
                    {item.fullName}
                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <div className="rounded-full bg-gray-100 p-2">
                    <Phone
                      size={16}
                      className="text-gray-500"
                    />
                  </div>

                  <span>
                    {item.phone}
                  </span>

                </div>

                <div className="flex items-start gap-3">

                  <div className="rounded-full bg-gray-100 p-2 mt-1">
                    <MapPin
                      size={16}
                      className="text-gray-500"
                    />
                  </div>

                  <div className="text-sm leading-6 text-gray-600">

                    <div>
                      {item.street}
                    </div>

                    {item.landmark && (
                      <div>
                        {item.landmark}
                      </div>
                    )}

                    <div>
                      {item.city}, {item.state}
                    </div>

                    <div>
                      {item.zipCode}
                    </div>

                    <div>
                      {item.country}
                    </div>

                  </div>

                </div>

              </div>

              {/* Footer */}

              {!item.isDefault && (

                <button
                  onClick={() =>
                    setDefault(item._id || item.id)
                  }
                  className="mt-6 w-full rounded-xl border border-blue-500 py-3 font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                >
                  Set as Default
                </button>

              )}

            </div>

          </div>

        ))

      )}

    </div>

    {isModalOpen && (
      <div className="fixed max-w-3xl mx-auto inset-0 z-50 flex items-center justify-center  p-4">

        <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl bg-[var(--card)] shadow-2xl border border-[var(--border)]">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] px-8 py-5">

            <div>
              <h2 className="text-2xl font-bold">
                {editingId ? "Edit Address" : "Add New Address"}
              </h2>

              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Enter your delivery address details.
              </p>
            </div>

            <button
              onClick={close}
              className="rounded-full p-2 hover:bg-gray-100 transition"
            >
              <X size={22} />
            </button>

          </div>

          {/* Body */}
          <div className="overflow-y-auto max-h-[calc(90vh-85px)] px-8 py-6">

            <form onSubmit={save} className="space-y-6">

              {/* Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Address Type
                  </label>

                  <select
                    name="type"
                    value={formData.type}
                    onChange={change}
                    className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Home">🏠 Home</option>
                    <option value="Office">🏢 Office</option>
                    <option value="Other">📍 Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={change}
                    placeholder="Enter full name"
                    className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

              </div>

              {/* Row 2 */}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Mobile Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={change}
                    placeholder="Enter mobile number"
                    className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Landmark
                  </label>

                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={change}
                    placeholder="Nearby landmark"
                    className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

              </div>

              {/* Street */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Street Address
                </label>

                <textarea
                  rows={3}
                  name="street"
                  value={formData.street}
                  onChange={change}
                  placeholder="House No, Building, Street..."
                  className="w-full rounded-xl border px-4 py-3 resize-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>

              {/* Row 3 */}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={change}
                    placeholder="City"
                    className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={change}
                    placeholder="State"
                    className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

              </div>

              {/* Row 4 */}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    ZIP Code
                  </label>

                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={change}
                    placeholder="302001"
                    className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Country
                  </label>

                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={change}
                    className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

              </div>

              {/* Default */}

              <div className="rounded-xl border bg-gray-50 p-4 flex items-center gap-3">

                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={change}
                  className="h-5 w-5"
                />

                <label
                  htmlFor="isDefault"
                  className="cursor-pointer font-medium"
                >
                  Make this my default address
                </label>

              </div>

              {/* Footer */}

              <div className="flex justify-end gap-4 border-t pt-6">

                <button
                  type="button"
                  onClick={close}
                  className="rounded-xl border px-8 py-3 font-medium hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <svg
                        className="mr-2 inline h-5 w-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          opacity=".25"
                        />
                        <path
                          d="M22 12a10 10 0 00-10-10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                      </svg>

                      Saving...
                    </>
                  ) : editingId ? (
                    "Update Address"
                  ) : (
                    "Save Address"
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>
    )}
  </div>;
};

export default AddressTab;
