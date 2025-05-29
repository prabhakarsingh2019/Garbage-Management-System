import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import collectionService from "../../services/collectionService";
import { toast } from "react-toastify";
import CollectionItem from "./CollectionItem";
import CollectionForm from "./CollectionForm"; // import your form component

const CollectionList = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const { user, token } = useAuth();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        let data;
        if (user.role === "admin") {
          data = await collectionService.getAllCollections(token);
        } else {
          data = await collectionService.getDriverCollections(user._id, token);
        }
        setCollections(data);
      } catch (err) {
        toast.error("Failed to fetch collections");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [user, token]);

  const handleAddNewClick = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleFormSubmit = async (newCollectionData) => {
    try {
      await collectionService.createCollection(newCollectionData, token);
      toast.success("Collection created successfully");

      // Refresh collection list
      let data;
      if (user.role === "admin") {
        data = await collectionService.getAllCollections(token);
      } else {
        data = await collectionService.getDriverCollections(user._id, token);
      }
      setCollections(data);
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to create collection");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            Collection Records
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all garbage collection records in the system.
          </p>
        </div>
        {user.role !== "admin" && !showForm && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={handleAddNewClick}
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add new collection
            </button>
          </div>
        )}
      </div>

      {/* Show form if toggled */}
      {showForm && (
        <CollectionForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
          driverId={user._id}
        />
      )}

      <div className="mt-8 space-y-4">
        {collections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No collection records found</p>
          </div>
        ) : (
          collections.map((collection) => (
            <CollectionItem key={collection._id} collection={collection} />
          ))
        )}
      </div>
    </div>
  );
};

export default CollectionList;
