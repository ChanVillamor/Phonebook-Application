import { useState } from "react";
import {
  StarIcon,
  PlusIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import api from "../config/api";
import { toast } from "react-hot-toast";

const ContactForm = ({ onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    mobileNo: initialData?.mobileNo || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
    socialMedia: initialData?.facebook || initialData?.instagram || "",
    notes: initialData?.notes || "",
    status: initialData?.status || "none",
    favorite: initialData?.favorite || false,
    image: initialData?.image || null,
  });

  const [imagePreview, setImagePreview] = useState(
    initialData?.image
      ? `${import.meta.env.VITE_API_URL}/${initialData.image}`
      : null
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "hotline":
        return "bg-red-500";
      case "family":
        return "bg-green-500";
      case "work":
        return "bg-blue-500";
      case "friend":
        return "bg-yellow-400";
      case "none":
      default:
        return "bg-gray-400";
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "image") {
        if (formData[key] instanceof File) {
          formDataToSend.append("image", formData[key]);
        } else if (formData[key]) {
          formDataToSend.append("image", formData[key]);
        }
      } else if (key === "socialMedia") {
        const value = formData[key].trim();
        // Check if it's a URL
        if (value.includes("http") || value.includes("www.")) {
          if (value.includes("facebook.com")) {
            formDataToSend.append("facebook", value);
            formDataToSend.append("instagram", "");
          } else if (value.includes("instagram.com")) {
            formDataToSend.append("instagram", value);
            formDataToSend.append("facebook", "");
          } else {
            formDataToSend.append("facebook", "");
            formDataToSend.append("instagram", "");
          }
        } else if (value) {
          // If it's just a name, assume it's a Facebook username
          formDataToSend.append("facebook", `https://facebook.com/${value}`);
          formDataToSend.append("instagram", "");
        } else {
          formDataToSend.append("facebook", "");
          formDataToSend.append("instagram", "");
        }
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      if (initialData) {
        await api.put(`/api/contacts/${initialData._id}`, formDataToSend);
        toast.success("Contact updated successfully!");
      } else {
        await api.post("/api/contacts", formDataToSend);
        toast.success("Contact added successfully!");
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving contact:", error);
      toast.error(
        error.response?.data?.message ||
          "Error saving contact. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="w-full max-w-md shadow-2xl bg-primary rounded-2xl">
        <div className="p-4">
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData ? "Edit Contact" : "Add Contact"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="relative flex items-center justify-center w-24 h-24 overflow-hidden rounded-full shadow-xl bg-secondary/20 ring-4 ring-gray-200">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-4xl font-semibold text-secondary">
                      {formData.name.charAt(0) || "+"}
                    </span>
                  )}
                </div>
                {formData.status !== "none" && (
                  <div
                    className={`absolute top-1 right-1 w-5 h-5 ${getStatusColor(
                      formData.status
                    )} rounded-full ring-2 ring-white shadow-lg`}
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center transition-colors duration-300 rounded-full cursor-pointer bg-black/0 hover:bg-black/20">
                  <span className="text-transparent hover:text-white">
                    Change Photo
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label="Change photo"
                />
              </div>
            </div>

            <div>
              <input
                type="text"
                name="name"
                placeholder="Name *"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-[#a4737d] rounded-lg bg-secondary text-black/500 focus:outline-none focus:ring-2 focus:ring-secondary"
                required
              />
            </div>

            <div>
              <input
                type="tel"
                name="mobileNo"
                placeholder="Mobile Number *"
                value={formData.mobileNo}
                onChange={handleChange}
                className="w-full px-4 py-3 border-[#a4737d] rounded-lg bg-secondary text-black/500 focus:outline-none focus:ring-2 focus:ring-secondary"
                required
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-[#a4737d] rounded-lg bg-secondary text-black/500 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border-[#a4737d] rounded-lg bg-secondary text-black/500 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div>
              <input
                type="text"
                name="socialMedia"
                placeholder="Social Media (username or full URL)"
                value={formData.socialMedia}
                onChange={handleChange}
                className="w-full px-4 py-3 border-[#a4737d] rounded-lg bg-secondary text-black/500 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <p className="mt-1 ml-1 text-xs text-gray-500">
                Enter Facebook/Instagram username or full profile URL
              </p>
            </div>

            <div>
              <textarea
                name="notes"
                placeholder="Notes"
                value={formData.notes}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-3 border-[#a4737d] rounded-lg bg-secondary text-black/500 focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  value="none"
                  checked={formData.status === "none"}
                  onChange={handleChange}
                  className="text-gray-400 focus:ring-gray-400"
                />
                <span className="text-gray-400">None</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  value="hotline"
                  checked={formData.status === "hotline"}
                  onChange={handleChange}
                  className="text-red-500 focus:ring-red-500"
                />
                <span className="text-red-500">Hotline</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  value="family"
                  checked={formData.status === "family"}
                  onChange={handleChange}
                  className="text-green-500 focus:ring-green-500"
                />
                <span className="text-green-500">Family</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  value="work"
                  checked={formData.status === "work"}
                  onChange={handleChange}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span className="text-blue-500">Work</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  value="friend"
                  checked={formData.status === "friend"}
                  onChange={handleChange}
                  className="text-yellow-400 focus:ring-yellow-400"
                />
                <span className="text-yellow-400">Friend</span>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="favorite"
                  checked={formData.favorite}
                  onChange={handleChange}
                  className="text-red-500 rounded-lg focus:ring-red-500"
                />
                <span className="text-gray-700">Mark as Favorite</span>
              </label>
            </div>

            <div className="flex justify-end mt-4 space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-500 transition-colors duration-300 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-black transition-colors duration-300 rounded-lg bg-secondary hover:bg-secondary/90 flex items-center justify-center gap-2"
              >
                {initialData ? (
                  <>
                    <PencilSquareIcon className="w-5 h-5" />
                    <span>Update Contact</span>
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Contact</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
