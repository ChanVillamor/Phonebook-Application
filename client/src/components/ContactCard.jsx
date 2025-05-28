import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  PencilSquareIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { SocialIcon } from "react-social-icons";
import api from "../config/api";
import { toast } from "react-hot-toast";

const ContactCard = ({ contact, onClose, onEdit, onRefresh, onSave }) => {
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
      default:
        return "bg-gray-400";
    }
  };

  const handleDelete = async (contactId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact?"
    );
    if (!confirmed) return; // User canceled

    try {
      await api.delete(`/api/contacts/${contactId}`);
      toast.success("Contact deleted successfully!");
      onSave(); // refresh data or update UI after delete
      onClose(); // close modal or dialog if needed
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error(
        error.response?.data?.message ||
          "Error deleting contact. Please try again."
      );
    }
  };

  const toggleFavorite = async () => {
    try {
      await api.patch(`/api/contacts/${contact._id}/favorite`);
      onRefresh();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md transition-all duration-300 transform shadow-2xl bg-primary rounded-2xl">
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute p-2 transition-colors duration-300 rounded-full top-4 right-4 hover:bg-gray-100"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>

          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <div className="flex items-center justify-center w-32 h-32 overflow-hidden rounded-full shadow-xl bg-secondary/20 ring-4 ring-white">
                {contact.image ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${contact.image}`}
                    alt={contact.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-6xl font-semibold text-secondary">
                    {contact.name.charAt(0)}
                  </span>
                )}
              </div>
              <div
                className={`absolute top-2 right-3 w-5 h-5 rounded-full ${getStatusColor(
                  contact.status
                )} ring-4 ring-white shadow-lg`}
              />
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {contact.name}
                </h2>
                <button
                  onClick={toggleFavorite}
                  className="p-1 transition-colors duration-300 rounded-full hover:bg-secondary/10"
                >
                  {contact.favorite ? (
                    <HeartIconSolid className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500 capitalize">
                {contact.status}
              </p>
            </div>
          </div>

          <div className="mb-8 space-y-4">
            <div className="flex items-center p-3 space-x-4 bg-gray-50 rounded-xl">
              <PhoneIcon className="w-6 h-6 text-secondary" />
              <a
                href={`tel:${contact.mobileNo}`}
                className="text-blue-600 hover:underline"
              >
                {contact.mobileNo}
              </a>
            </div>

            {contact.email && (
              <div className="flex items-center p-3 space-x-4 bg-gray-50 rounded-xl">
                <EnvelopeIcon className="w-6 h-6 text-secondary" />
                <a
                  href={`mailto:${contact.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {contact.email}
                </a>
              </div>
            )}

            {contact.address && (
              <div className="flex items-center p-3 space-x-4 bg-gray-50 rounded-xl">
                <MapPinIcon className="w-6 h-6 text-secondary" />
                <span className="text-gray-700">{contact.address}</span>
              </div>
            )}

            {(contact.facebook || contact.instagram) && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                {contact.facebook && (
                  <SocialIcon
                    url={contact.facebook}
                    network="facebook"
                    style={{ height: 35, width: 35 }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-80"
                  />
                )}
                {contact.instagram && (
                  <SocialIcon
                    url={contact.instagram}
                    network="instagram"
                    style={{ height: 35, width: 35 }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-80"
                  />
                )}
              </div>
            )}

            {contact.notes && (
              <div className="p-3 bg-gray-50 rounded-xl">
                <h3 className="mb-2 font-medium text-gray-700">Notes</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {contact.notes}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => handleDelete(contact._id)}
              className="flex items-center px-4 py-2 space-x-2 text-red-600 transition-colors duration-300 rounded-lg hover:bg-red-50"
            >
              <TrashIcon className="w-5 h-5" />
              <span>Delete</span>
            </button>
            <button
              onClick={onEdit}
              className="flex items-center px-4 py-2 space-x-2 text-black transition-all duration-300 rounded-lg shadow-lg bg-secondary hover:bg-secondary/90 hover:shadow-xl"
            >
              <PencilSquareIcon className="w-5 h-5" />
              <span>Edit Contact</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
