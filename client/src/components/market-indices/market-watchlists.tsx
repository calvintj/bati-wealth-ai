"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { CirclePlus, Trash2, Pencil, X } from "lucide-react";
import {
  useGetWatchlists,
  useCreateWatchlist,
  useUpdateWatchlist,
  useDeleteWatchlist,
} from "@/hooks/market-indices/use-market-watchlists";
import { MarketWatchlist, INDEX_OPTIONS } from "@/types/page/market-indices";

interface MarketWatchlistsProps {
  onWatchlistSelect?: (indices: string[] | null, watchlistId: number | null) => void;
  selectedWatchlistId?: number | null;
}

const MarketWatchlists = ({ onWatchlistSelect, selectedWatchlistId }: MarketWatchlistsProps) => {
  const { data, isLoading, error } = useGetWatchlists();
  const { mutateAsync: createWatchlist } = useCreateWatchlist();
  const { mutateAsync: updateWatchlist } = useUpdateWatchlist();
  const { mutateAsync: deleteWatchlist } = useDeleteWatchlist();

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingWatchlist, setEditingWatchlist] = useState<MarketWatchlist | null>(null);
  const [watchlistName, setWatchlistName] = useState("");
  const [selectedIndices, setSelectedIndices] = useState<string[]>([]);

  const watchlists = data?.watchlists || [];

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingWatchlist(null);
    setWatchlistName("");
    setSelectedIndices([]);
    setShowModal(true);
  };

  const handleOpenEdit = (watchlist: MarketWatchlist) => {
    setIsEditing(true);
    setEditingWatchlist(watchlist);
    setWatchlistName(watchlist.watchlist_name);
    setSelectedIndices(watchlist.indices);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingWatchlist(null);
    setWatchlistName("");
    setSelectedIndices([]);
  };

  const handleToggleIndex = (indexValue: string) => {
    setSelectedIndices((prev) =>
      prev.includes(indexValue)
        ? prev.filter((i) => i !== indexValue)
        : [...prev, indexValue]
    );
  };

  const handleSubmit = async () => {
    if (!watchlistName.trim() || selectedIndices.length === 0) {
      alert("Please enter a watchlist name and select at least one index");
      return;
    }

    try {
      if (isEditing && editingWatchlist) {
        await updateWatchlist({
          id: editingWatchlist.id,
          watchlist_name: watchlistName,
          indices: selectedIndices,
        });
      } else {
        await createWatchlist({
          watchlist_name: watchlistName,
          indices: selectedIndices,
        });
      }
      handleCloseModal();
      // Reset selection after creating/updating
      if (onWatchlistSelect) {
        onWatchlistSelect(null, null);
      }
    } catch (err) {
      console.error("Failed to save watchlist:", err);
      alert("Failed to save watchlist");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this watchlist?")) return;

    try {
      await deleteWatchlist(id);
      // Reset selection if deleted watchlist was selected
      if (selectedWatchlistId === id && onWatchlistSelect) {
        onWatchlistSelect(null, null);
      }
    } catch (err) {
      console.error("Failed to delete watchlist:", err);
      alert("Failed to delete watchlist");
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400">Loading watchlists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <p className="text-red-600 dark:text-red-400">Error: {error.message}</p>
      </div>
    );
  }

  const handleWatchlistSelectChange = (watchlistId: number | null) => {
    if (onWatchlistSelect) {
      if (watchlistId) {
        const watchlist = watchlists.find((w) => w.id === watchlistId);
        onWatchlistSelect(watchlist?.indices || null, watchlistId);
      } else {
        onWatchlistSelect(null, null);
      }
    }
  };

  return (
    <>
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Market Watchlists
          </h2>
          <button
            onClick={handleOpenCreate}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
          >
            <CirclePlus size={20} />
          </button>
        </div>

        {/* Watchlist Selector */}
        {watchlists.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by Watchlist
              </label>
              {selectedWatchlistId && (
                <button
                  onClick={() => handleWatchlistSelectChange(null)}
                  className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                >
                  Clear Filter
                </button>
              )}
            </div>
            <select
              value={selectedWatchlistId || ""}
              onChange={(e) => {
                const id = e.target.value ? parseInt(e.target.value, 10) : null;
                handleWatchlistSelectChange(id);
              }}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
            >
              <option value="">Show All Indices</option>
              {watchlists.map((watchlist) => (
                <option key={watchlist.id} value={watchlist.id}>
                  {watchlist.watchlist_name} ({watchlist.indices.length} indices)
                </option>
              ))}
            </select>
          </div>
        )}

        {watchlists.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            No watchlists yet. Create one to get started!
          </p>
        ) : (
          <div className="space-y-2">
            {watchlists.map((watchlist) => (
              <div
                key={watchlist.id}
                onClick={() => handleWatchlistSelectChange(
                  selectedWatchlistId === watchlist.id ? null : watchlist.id
                )}
                className={`p-3 rounded-lg flex justify-between items-start cursor-pointer transition-colors ${
                  selectedWatchlistId === watchlist.id
                    ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-500 dark:border-blue-400"
                    : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 dark:text-white mb-2">
                    {watchlist.watchlist_name}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {watchlist.indices.map((index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                      >
                        {INDEX_OPTIONS.find((opt) => opt.value === index)?.label || index}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => handleOpenEdit(watchlist)}
                    className="p-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(watchlist.id)}
                    className="p-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 m-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {isEditing ? "Edit Watchlist" : "Create Watchlist"}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Watchlist Name
                  </label>
                  <input
                    type="text"
                    value={watchlistName}
                    onChange={(e) => setWatchlistName(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    placeholder="e.g., My US Indices"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Indices
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {INDEX_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedIndices.includes(option.value)}
                          onChange={() => handleToggleIndex(option.value)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {isEditing ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default MarketWatchlists;

