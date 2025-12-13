"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { CirclePlus, Trash2, Pencil, X, AlertTriangle } from "lucide-react";
import {
  useGetNotes,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
} from "@/hooks/market-indices/use-market-notes";
import {
  MarketNote,
  MarketNoteResponse,
  INDEX_OPTIONS,
} from "@/types/page/market-indices";
import { usePagePermissions } from "@/hooks/permissions/use-page-permissions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MarketNotes = () => {
  const [selectedIndex, setSelectedIndex] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<MarketNote | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteIndex, setNoteIndex] = useState<string>("general");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);

  const { data, isLoading, error } = useGetNotes(selectedIndex || undefined);
  const { mutateAsync: createNote } = useCreateNote();
  const { mutateAsync: updateNote } = useUpdateNote();
  const { mutateAsync: deleteNote } = useDeleteNote();

  // Get permissions for market-indices page (not used for UI blocking, but kept for potential future use)
  const { canAdd, canUpdate, canDelete } = usePagePermissions();

  const notesData = data as MarketNoteResponse | undefined;
  const notes = notesData?.notes || [];

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
      alert("Masukkan judul dan konten");
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
      // Error will be handled by API interceptor and React Query onError
      console.error("Failed to save note:", err);
    }
  };

  const handleDelete = (id: number) => {
    setNoteToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;

    try {
      await deleteNote(noteToDelete);
      toast.success("Catatan berhasil dihapus", {
        description: "Catatan telah dihapus dari sistem",
        duration: 3000,
      });
      setShowDeleteDialog(false);
      setNoteToDelete(null);
    } catch (err) {
      // Error will be handled by API interceptor and React Query onError
      console.error("Failed to delete note:", err);
      setShowDeleteDialog(false);
      setNoteToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setNoteToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400">Memuat catatan...</p>
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
            Catatan Pasar
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
            <option value="">Semua Indeks</option>
            {INDEX_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {notes.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            Belum ada catatan. Buat satu untuk memulai!
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
                        {INDEX_OPTIONS.find(
                          (opt) => opt.value === note.index_name
                        )?.label || note.index_name}
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
                  {isEditing ? "Edit Catatan" : "Buat Catatan"}
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
                    Indeks
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
                    Judul Catatan
                  </label>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    placeholder="contoh: Analisis Pasar Q1 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Isi Catatan
                  </label>
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={6}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    placeholder="Masukkan catatan Anda di sini..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {isEditing ? "Perbarui" : "Buat"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Hapus Catatan
              </DialogTitle>
            </div>
            <DialogDescription className="pt-2 text-sm text-gray-600 dark:text-gray-400">
              Apakah Anda yakin ingin menghapus catatan ini? Tindakan ini tidak
              dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              onClick={handleCancelDelete}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 transition-colors"
            >
              Hapus
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MarketNotes;
