import { useState, useCallback } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";
import ContactList from "../components/ContactList";
import ContactForm from "../components/ContactForm";
import ContactCard from "../components/ContactCard";

const Home = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [viewingContact, setViewingContact] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsFormOpen(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setIsFormOpen(true);
    setViewingContact(null);
  };

  const handleViewContact = (contact) => {
    setViewingContact(contact);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedContact(null);
  };

  const handleCloseCard = () => {
    setViewingContact(null);
  };

  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div className="relative min-h-screen bg-primary">
      <div className="relative z-0">
        <header className="shadow-lg bg-gradient-to-r from-primary via-secondary to-primary">
          <div className="flex items-center justify-between max-w-md px-6 py-6 mx-auto">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white shadow-md rounded-xl">
                <HeartIcon className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-black">
                  Contacts
                </h1>
                <p className="text-sm text-black">
                  Keep in touch with your loved ones
                </p>
              </div>
            </div>
            {!isFormOpen && !viewingContact && (
              <button
                onClick={handleAddContact}
                className="flex items-center gap-2 p-3 text-black transition-all duration-300 transform rounded-full shadow-lg bg-secondary hover:shadow-xl hover:scale-105 hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
              >
                <PlusIcon className="w-6 h-6" />
              </button>
            )}
          </div>
        </header>

        <main className="max-w-md px-4 py-6 mx-auto">
          <div className="p-4 shadow-lg bg-primary rounded-2xl">
            <ContactList
              key={refreshKey}
              refreshKey={refreshKey}
              onEditContact={handleEditContact}
              onViewContact={handleViewContact}
            />
          </div>
        </main>
      </div>

      {isFormOpen && (
        <ContactForm
          onClose={handleCloseForm}
          onSave={handleRefresh}
          initialData={selectedContact}
        />
      )}

      {viewingContact && (
        <ContactCard
          contact={viewingContact}
          onClose={handleCloseCard}
          onEdit={() => handleEditContact(viewingContact)}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
};

export default Home;
