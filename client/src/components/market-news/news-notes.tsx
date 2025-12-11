"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { CirclePlus, Trash2, Pencil, X, FileText } from "lucide-react";
import {
  useGetNewsNotes,
  useCreateNewsNote,
  useUpdateNewsNote,
  useDeleteNewsNote,
} from "@/hooks/market-news/use-news-notes";
import { NewsNote } from "@/types/page/market-news";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { usePagePermissions } from "@/hooks/permissions/use-page-permissions";
import { checkPermissionBeforeAction } from "@/utils/permission-checker";

export default function NewsNotes() {
  const { data, isLoading, error } = useGetNewsNotes();
  const { mutateAsync: createNote } = useCreateNewsNote();
  const { mutateAsync: updateNote } = useUpdateNewsNote();
  const { mutateAsync: deleteNote } = useDeleteNewsNote();
  
  // Get permissions for market-news page
  const { canAdd, canUpdate, canDelete } = usePagePermissions();

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<NewsNote | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [relevanceTags, setRelevanceTags] = useState("");

  const notes = data?.notes || [];

  const handleOpenCreate = () => {
    // Check permission before allowing to create
    if (!checkPermissionBeforeAction(canAdd, "create", "note")) {
      return;
    }
    setIsEditing(false);
    setEditingNote(null);
    setNoteTitle("");
    setNoteContent("");
    setRelevanceTags("");
    setShowModal(true);
  };

  const handleOpenEdit = (note: NewsNote) => {
    // Check permission before allowing to edit
    if (!checkPermissionBeforeAction(canUpdate, "update", "note")) {
      return;
    }
    setIsEditing(true);
    setEditingNote(note);
    setNoteTitle(note.note_title);
    setNoteContent(note.note_content);
    setRelevanceTags(note.relevance_tags?.join(", ") || "");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingNote(null);
    setNoteTitle("");
    setNoteContent("");
    setRelevanceTags("");
  };

  const handleSubmit = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      alert("Please enter both title and content");
      return;
    }

    // Check permission before submitting
    if (isEditing) {
      if (!checkPermissionBeforeAction(canUpdate, "update", "note")) {
        return;
      }
    } else {
      if (!checkPermissionBeforeAction(canAdd, "create", "note")) {
        return;
      }
    }

    try {
      const tags = relevanceTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      if (isEditing && editingNote) {
        await updateNote({
          id: editingNote.id,
          note_title: noteTitle.trim(),
          note_content: noteContent.trim(),
          relevance_tags: tags.length > 0 ? tags : undefined,
        });
      } else {
        await createNote({
          note_title: noteTitle.trim(),
          note_content: noteContent.trim(),
          relevance_tags: tags.length > 0 ? tags : undefined,
        });
      }
      handleCloseModal();
    } catch (err: any) {
      console.error("Failed to save news note:", err);
      // Error will be handled by API interceptor and React Query onError
    }
  };

  const handleDelete = async (id: number) => {
    // Check permission before allowing to delete
    if (!checkPermissionBeforeAction(canDelete, "delete", "note")) {
      return;
    }

    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await deleteNote(id);
    } catch (err) {
      console.error("Failed to delete news note:", err);
      // Error will be handled by API interceptor and React Query onError
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-gray-600 dark:text-gray-400">
        Loading news notes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-600 dark:text-red-400">
        Error loading news notes
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
            News Notes
          </h3>
          <Button
            onClick={handleOpenCreate}
            size="sm"
            className="h-7 px-2 text-xs"
            variant="outline"
          >
            <CirclePlus className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>

        {notes.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            No notes yet. Click "Add" to create one.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="group relative rounded-lg p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">
                    {note.note_title}
                  </h4>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(note)}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Edit"
                    >
                      <Pencil className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                  {note.note_content}
                </p>
                {note.relevance_tags && note.relevance_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {note.relevance_tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-xs rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  {new Date(note.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1D283A] rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {isEditing ? "Edit News Note" : "Add News Note"}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="noteTitle">Note Title *</Label>
                    <Input
                      id="noteTitle"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="e.g., Market Impact Analysis"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="noteContent">Note Content *</Label>
                    <Textarea
                      id="noteContent"
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Your analysis, observations, or insights..."
                      className="mt-1"
                      rows={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="relevanceTags">Relevance Tags (comma-separated)</Label>
                    <Input
                      id="relevanceTags"
                      value={relevanceTags}
                      onChange={(e) => setRelevanceTags(e.target.value)}
                      placeholder="e.g., customer_impact, market_trend, risk"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button
                    onClick={handleSubmit}
                    className="flex-1"
                    variant="default"
                  >
                    {isEditing ? "Update" : "Create"}
                  </Button>
                  <Button
                    onClick={handleCloseModal}
                    className="flex-1"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

