"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { CirclePlus, Trash2, Pencil, X, Calendar, AlertTriangle } from "lucide-react";
import {
  useGetProductPicks,
  useCreateProductPick,
  useUpdateProductPick,
  useDeleteProductPick,
} from "@/hooks/market-news/use-product-picks";
import { ProductPick } from "@/types/page/market-news";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

export default function ProductPicks() {
  const today = new Date().toISOString().split("T")[0];
  const { data, isLoading, error } = useGetProductPicks(today);
  const { mutateAsync: createPick } = useCreateProductPick();
  const { mutateAsync: updatePick } = useUpdateProductPick();
  const { mutateAsync: deletePick } = useDeleteProductPick();

  // Get permissions for market-news page
  const { canAdd, canUpdate, canDelete } = usePagePermissions();

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPick, setEditingPick] = useState<ProductPick | null>(null);
  const [ticker, setTicker] = useState("");
  const [pickDate, setPickDate] = useState(today);
  const [reason, setReason] = useState("");
  const [priority, setPriority] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pickToDelete, setPickToDelete] = useState<number | null>(null);

  const picks = data?.picks || [];

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingPick(null);
    setTicker("");
    setPickDate(today);
    setReason("");
    setPriority(0);
    setShowModal(true);
  };

  const handleOpenEdit = (pick: ProductPick) => {
    setIsEditing(true);
    setEditingPick(pick);
    setTicker(pick.ticker);
    setPickDate(pick.pick_date);
    setReason(pick.reason || "");
    setPriority(pick.priority);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingPick(null);
    setTicker("");
    setPickDate(today);
    setReason("");
    setPriority(0);
  };

  const handleSubmit = async () => {
    if (!ticker.trim()) {
      alert("Masukkan simbol ticker");
      return;
    }

    try {
      if (isEditing && editingPick) {
        await updatePick({
          id: editingPick.id,
          ticker: ticker.trim().toUpperCase(),
          pick_date: pickDate,
          reason: reason.trim() || undefined,
          priority,
        });
      } else {
        await createPick({
          ticker: ticker.trim().toUpperCase(),
          pick_date: pickDate,
          reason: reason.trim() || undefined,
          priority,
        });
      }
      handleCloseModal();
    } catch (err: any) {
      console.error("Failed to save product pick:", err);
      // Error will be handled by API interceptor and React Query onError
    }
  };

  const handleDelete = (id: number) => {
    setPickToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!pickToDelete) return;

    try {
      await deletePick(pickToDelete);
      toast.success("Product pick berhasil dihapus", {
        description: "Product pick telah dihapus dari sistem",
        duration: 3000,
      });
      setShowDeleteDialog(false);
      setPickToDelete(null);
    } catch (err) {
      // Error will be handled by API interceptor and React Query onError
      console.error("Failed to delete product pick:", err);
      setShowDeleteDialog(false);
      setPickToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setPickToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-gray-600 dark:text-gray-400">
        Memuat product pick...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-600 dark:text-red-400">
        Error memuat product pick
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
            Product Pick Hari Ini
          </h3>
          <Button
            onClick={handleOpenCreate}
            size="sm"
            className="h-7 px-2 text-xs"
            variant="outline"
          >
            <CirclePlus className="w-3 h-3 mr-1" />
            Tambah
          </Button>
        </div>

        {picks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            Tidak ada product pick untuk hari ini. Klik "Tambah" untuk membuat satu.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 flex-1">
            {picks.map((pick) => (
              <div
                key={pick.id}
                className="group relative rounded-xl flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-700 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
              >
                <span className="font-bold text-lg">{pick.ticker}</span>
                {pick.reason && (
                  <span className="text-xs mt-1 opacity-75 line-clamp-1">
                    {pick.reason}
                  </span>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(pick)}
                    className="p-1 rounded bg-gray-600 hover:bg-gray-500"
                    title="Edit"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(pick.id)}
                    className="p-1 rounded bg-red-600 hover:bg-red-500"
                    title="Hapus"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1D283A] rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {isEditing ? "Edit Product Pick" : "Tambah Product Pick"}
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
                    <Label htmlFor="ticker">Simbol Ticker *</Label>
                    <Input
                      id="ticker"
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value)}
                      placeholder="contoh: BBCA"
                      className="mt-1"
                      maxLength={20}
                    />
                  </div>

                  <div>
                    <Label htmlFor="pickDate">Tanggal Pick *</Label>
                    <div className="relative mt-1">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="pickDate"
                        type="date"
                        value={pickDate}
                        onChange={(e) => setPickDate(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reason">Alasan (Opsional)</Label>
                    <Textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Mengapa ini pilihan yang baik?"
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="priority">Prioritas (0 = tertinggi)</Label>
                    <Input
                      id="priority"
                      type="number"
                      value={priority}
                      onChange={(e) =>
                        setPriority(parseInt(e.target.value) || 0)
                      }
                      className="mt-1"
                      min={0}
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button
                    onClick={handleSubmit}
                    className="flex-1"
                    variant="default"
                  >
                    {isEditing ? "Perbarui" : "Buat"}
                  </Button>
                  <Button
                    onClick={handleCloseModal}
                    className="flex-1"
                    variant="outline"
                  >
                    Batal
                  </Button>
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
                Hapus Product Pick
              </DialogTitle>
            </div>
            <DialogDescription className="pt-2 text-sm text-gray-600 dark:text-gray-400">
              Apakah Anda yakin ingin menghapus product pick ini? Tindakan ini tidak dapat dibatalkan.
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
}
