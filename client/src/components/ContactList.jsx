import { useState, useEffect } from "react";
import {
  StarIcon,
  MagnifyingGlassIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import {
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
} from "@heroicons/react/24/solid";
import api from "../config/api";
import { toast } from "react-hot-toast";

const ContactList = ({ onEditContact, onViewContact, refreshKey }) => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupedContacts, setGroupedContacts] = useState({});
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, [refreshKey]);

  // Add this function inside your ContactList component (above fetchContacts or outside the component)
  const bubbleSortContacts = (arr) => {
    const contacts = [...arr];
    let n = contacts.length;
    let swapped;

    do {
      swapped = false;
      for (let i = 1; i < n; i++) {
        if (
          contacts[i - 1].name.toLowerCase() > contacts[i].name.toLowerCase()
        ) {
          [contacts[i - 1], contacts[i]] = [contacts[i], contacts[i - 1]];
          swapped = true;
        }
      }
      n--;
    } while (swapped);

    return contacts;
  };

  const fetchContacts = async () => {
    try {
      const response = await api.get("/api/contacts");
      // Flatten grouped contacts into a single array
      const grouped = response.data;
      const allContacts = Object.values(grouped).flat();
      const sortedContacts = bubbleSortContacts(allContacts);
      setContacts(sortedContacts);
      filterAndGroupContacts(sortedContacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      if (error.code === "ECONNREFUSED") {
        toast.error(
          "Cannot connect to server. Please make sure the server is running."
        );
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(
          "Error loading contacts. Please check your connection and try again."
        );
      }
    }
  };

  const filterAndGroupContacts = (contactsList) => {
    let filteredContacts = contactsList;

    // Apply search filter
    if (searchQuery) {
      filteredContacts = contactsList.filter(
        (contact) =>
          contact.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          contact.mobileNo.includes(searchQuery) ||
          contact.email?.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    // Apply favorites filter
    if (showFavorites) {
      filteredContacts = filteredContacts.filter((contact) => contact.favorite);
    }

    // Group by first letter
    const grouped = filteredContacts.reduce((acc, contact) => {
      const firstLetter = contact.name.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(contact);
      return acc;
    }, {});

    setGroupedContacts(grouped);
  };

  useEffect(() => {
    filterAndGroupContacts(contacts);
  }, [searchQuery, showFavorites, contacts]);

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

  const toggleFavorite = async (e, contact) => {
    e.stopPropagation();
    try {
      await api.patch(`/api/contacts/${contact._id}/favorite`);
      fetchContacts();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="max-w-md p-4 mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 flex items-center pointer-events-none left-4">
            <MagnifyingGlassIcon className="w-5 h-5 text-black" />
          </div>
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full py-3 pl-12 pr-4 transition-all duration-300 shadow-sm border-secondary bg-secondary rounded-xl focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-300 hover:border-red-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          className={`p-3 rounded-xl ${
            showFavorites
              ? "bg-red-50 text-red-500"
              : "bg-secondary border border-gray-200 hover:border-red-200 text-black hover:text-red-500 hover:bg-red-50"
          } transition-all duration-300 shadow-sm`}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          {showFavorites ? (
            <HeartIconSolid className="w-5 h-5" />
          ) : (
            <HeartIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="h-[500px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {Object.keys(groupedContacts).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            {showFavorites ? (
              <>
                <HeartIcon className="w-12 h-12 mb-3 text-red-200" />
                <p className="text-lg font-medium">No favorite contacts</p>
                <p className="text-sm">
                  Mark contacts as favorite to see them here
                </p>
              </>
            ) : (
              <>
                <StarIcon className="w-12 h-12 mb-3 text-gray-300" />
                <p className="text-lg font-medium">No contacts found</p>
                <p className="text-sm">
                  Start adding contacts to your phonebook
                </p>
              </>
            )}
          </div>
        ) : (
          Object.keys(groupedContacts)
            .sort()
            .map((letter) => (
              <div key={letter} className="space-y-2">
                <h2 className="sticky top-0 flex items-center gap-4 px-2 py-1 text-sm font-semibold text-gray-500 bg-primary">
                  <span>{letter}</span>
                  <div className="flex-1 h-[1px] bg-secondary"></div>
                </h2>
                <div className="space-y-1">
                  {groupedContacts[letter].map((contact) => (
                    <div
                      key={contact._id}
                      className="flex items-center justify-between p-2 transition-all duration-300 cursor-pointer hover:bg-gray-50 rounded-xl"
                      onClick={() => onViewContact(contact)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="relative flex items-center justify-center w-12 h-12 overflow-hidden rounded-full shadow-md bg-secondary/20 ring-2 ring-white">
                            {contact.image ? (
                              <img
                                src={`${import.meta.env.VITE_API_URL}/${
                                  contact.image
                                }`}
                                alt={contact.name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <span className="text-lg font-semibold text-secondary">
                                {contact.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          {contact.status !== "none" && (
                            <div
                              className={`absolute -top-0 -right-0 w-3 h-3 rounded-full ${getStatusColor(
                                contact.status
                              )} ring-2 ring-white shadow-sm z-10`}
                            />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">
                              {contact.name}
                            </h3>
                            {contact.favorite && (
                              <HeartIconSolid className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {contact.mobileNo}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default ContactList;
