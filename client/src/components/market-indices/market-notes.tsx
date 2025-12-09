"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { CirclePlus, Trash2, Pencil, X } from "lucide-react";
import {
  useGetNotes,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
} from "@/hooks/market-indices/use-market-notes";
import { MarketNote, INDEX_OPTIONS } from "@/types/page/market-indices";

const MarketNotes = () => {
  const [selectedIndex, setSelectedIndex] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<MarketNote | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteIndex, setNoteIndex] = useState<string>("general");

  const { data, isLoading, error } = useGetNotes(selectedIndex || undefined);
  const { mutateAsync: createNote } = useCreateNote();
  const { mutateAsync: updateNote } = useUpdateNote();
  const { mutateAsync: deleteNote } = useDeleteNote();

  const notes = data?.notes || [];

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingNote(null);
    setNoteTitle("");
    setNoteContent("");
    setNoteIndex("general");
    setShowModal(true);
  };

  const handleOpenEdit = (note: MarketNote) => {
    setIsEditing(true);
    setEditingNote(note);
    setNoteTitle(note.note_title);
    setNoteContent(note.note_content);
    setNoteIndex(note.index_name);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingNote(null);
    setNoteTitle("");
    setNoteContent("");
    setNoteIndex("general");
  };

  const handleSubmit = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      alert("Please enter both title and content");
      return;
    }

    try {
      if (isEditing && editingNote) {
        await updateNote({
          id: editingNote.id,
          note_title: noteTitle,
          note_content: noteContent,
        });
      } else {
        await createNote({
          index_name: noteIndex,
          note_title: noteTitle,
          note_content: noteContent,
        });
      }
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save note:", err);
      alert("Failed to save note");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await deleteNote(id);
    } catch (err) {
      console.error("Failed to delete note:", err);
      alert("Failed to delete note");
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400">Loading notes...</p>
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

  return (
    <>
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Market Notes
          </h2>
          <button
            onClick={handleOpenCreate}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
          >
            <CirclePlus size={20} />
          </button>
        </div>

        <div className="mb-4">
          <select
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="">All Indices</option>
            {INDEX_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {notes.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            No notes yet. Create one to get started!
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                        {INDEX_OPTIONS.find((opt) => opt.value === note.index_name)?.label ||
                          note.index_name}
                      </span>
                      <h3 className="font-medium text-gray-800 dark:text-white">
                        {note.note_title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {note.note_content}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(note.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => handleOpenEdit(note)}
                      className="p-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="p-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 m-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {isEditing ? "Edit Note" : "Create Note"}
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
                    Index
                  </label>
                  <select
                    value={noteIndex}
                    onChange={(e) => setNoteIndex(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  >
                    {INDEX_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Note Title
                  </label>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    placeholder="e.g., Market Analysis Q1 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Note Content
                  </label>
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={6}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    placeholder="Enter your notes here..."
                  />
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

export default MarketNotes;


