"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useUpdateCustomer } from "@/hooks/dashboard-overview/use-update-customer";
import { CertainCustomerList } from "@/types/page/overview";
import { useToast } from "@/hooks/use-toast";

interface CustomerEditModalProps {
  customer: CertainCustomerList;
  isOpen: boolean;
  onClose: () => void;
}

const RISK_PROFILES = [
  "1 - Conservative",
  "2 - Balanced",
  "3 - Moderate",
  "4 - Growth",
  "5 - Aggressive",
];

const PROPENSITY_OPTIONS = ["low", "medium", "high", "qualified"];

const AUM_LABEL_OPTIONS = ["zero", "low", "medium", "high"];

const PRIORITY_OPTIONS = ["PRIORITY", "PRIVATE"];

const MARITAL_STATUS_OPTIONS = ["Married", "Single", "Divorced", "Widowed"];

export default function CustomerEditModal({
  customer,
  isOpen,
  onClose,
}: CustomerEditModalProps) {
  const { mutateAsync: updateCustomer, isPending } = useUpdateCustomer();
  const { toast } = useToast();

  // Normalize propensity and aum_label to lowercase to match option values
  const normalizePropensity = (value: string) => {
    if (!value) return "";
    const lower = value.toLowerCase();
    return PROPENSITY_OPTIONS.includes(lower) ? lower : value.toLowerCase();
  };

  const normalizeAumLabel = (value: string) => {
    if (!value) return "";
    const lower = value.toLowerCase();
    return AUM_LABEL_OPTIONS.includes(lower) ? lower : value.toLowerCase();
  };

  // Helper to normalize risk profile for form
  const normalizeRiskProfile = (value: string): string => {
    if (!value) return "";
    // If already formatted, return as is
    if (value.includes(" - ")) {
      return value;
    }
    // Map to formatted version
    const riskMap: Record<string, string> = {
      "1": "1 - Conservative",
      Conservative: "1 - Conservative",
      "2": "2 - Balanced",
      Balanced: "2 - Balanced",
      "3": "3 - Moderate",
      Moderate: "3 - Moderate",
      "4": "4 - Growth",
      Growth: "4 - Growth",
      "5": "5 - Aggressive",
      Aggressive: "5 - Aggressive",
    };
    return riskMap[value.trim()] || value;
  };

  const [formData, setFormData] = useState({
    risk_profile: normalizeRiskProfile(customer["Risk Profile"] || ""),
    aum_label: normalizeAumLabel(customer["AUM Label"] || ""),
    propensity: normalizePropensity(customer["Propensity"] || ""),
    priority_private: customer["Priority / Private"] || "",
    customer_type: customer["Customer Type"] || "",
    pekerjaan: customer["Pekerjaan"] || "",
    status_nikah: customer["Status Nikah"] || "",
    usia: customer["Usia"]?.toString() || "",
    annual_income: customer["Annual Income"]?.toString() || "",
  });

  useEffect(() => {
    if (isOpen && customer) {
      setFormData({
        risk_profile: normalizeRiskProfile(customer["Risk Profile"] || ""),
        aum_label: normalizeAumLabel(customer["AUM Label"] || ""),
        propensity: normalizePropensity(customer["Propensity"] || ""),
        priority_private: customer["Priority / Private"] || "",
        customer_type: customer["Customer Type"] || "",
        pekerjaan: customer["Pekerjaan"] || "",
        status_nikah: customer["Status Nikah"] || "",
        usia: customer["Usia"]?.toString() || "",
        annual_income: customer["Annual Income"]?.toString() || "",
      });
    }
  }, [isOpen, customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Extract risk profile number from formatted string (e.g., "1 - Conservative" -> "1")
      let riskProfileValue = formData.risk_profile;
      if (riskProfileValue && riskProfileValue.includes(" - ")) {
        riskProfileValue = riskProfileValue.split(" - ")[0].trim();
      }

      await updateCustomer({
        customerID: customer["Customer ID"],
        risk_profile: riskProfileValue || undefined,
        aum_label: formData.aum_label || undefined,
        propensity: formData.propensity || undefined,
        priority_private: formData.priority_private || undefined,
        customer_type: formData.customer_type || undefined,
        pekerjaan: formData.pekerjaan || undefined,
        status_nikah: formData.status_nikah || undefined,
        usia: formData.usia
          ? parseInt(formData.usia, 10).toString()
          : undefined,
        annual_income: formData.annual_income
          ? parseFloat(formData.annual_income).toString()
          : undefined,
      });

      toast({
        title: "Berhasil",
        description: "Informasi pelanggan berhasil diperbarui",
      });
      onClose();
    } catch (error: any) {
      // Always skip showing error for 403 status (permission denied)
      // API interceptor already handles 403 errors
      if (error?.response?.status === 403) {
        return; // API interceptor already showed the error
      }
      
      // Check if it's a permission error - if so, the interceptor already showed the error
      const errorMessage = error?.response?.data?.error || error?.message || "";
      const errorLower = errorMessage.toLowerCase();
      const isPermissionError =
        errorLower.includes("permission") ||
        errorLower.includes("access denied") ||
        errorLower.includes("akses ditolak") ||
        errorLower.includes("tidak memiliki izin") ||
        errorLower.includes("memperbarui di halaman ini");

      // Don't show error if it's a permission error (API interceptor already handles it)
      if (!isPermissionError) {
        // Only show custom error if it's not a permission error
        toast({
          title: "Kesalahan",
          description: errorMessage || "Gagal memperbarui informasi pelanggan",
          variant: "destructive",
        });
      }
      // If it's a permission error, the interceptor already showed the error message
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Ubah Nasabah: {customer["Customer ID"]}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Risk Profile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Profil Resiko
              </label>
              <select
                name="risk_profile"
                value={formData.risk_profile}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                <option value="">Pilih Profil Resiko</option>
                {RISK_PROFILES.map((profile) => (
                  <option key={profile} value={profile}>
                    {profile}
                  </option>
                ))}
              </select>
            </div>

            {/* AUM Label */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Label AUM
              </label>
              <select
                name="aum_label"
                value={formData.aum_label}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                <option value="">Pilih Label AUM</option>
                {AUM_LABEL_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Propensity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Propensity
              </label>
              <select
                name="propensity"
                value={formData.propensity}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                <option value="">Pilih Propensity</option>
                {PROPENSITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority/Private */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority / Private
              </label>
              <select
                name="priority_private"
                value={formData.priority_private}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                <option value="">Pilih Status</option>
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipe Nasabah
              </label>
              <input
                type="text"
                name="customer_type"
                value={formData.customer_type}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Tipe Nasabah"
              />
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pekerjaan
              </label>
              <input
                type="text"
                name="pekerjaan"
                value={formData.pekerjaan}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Pekerjaan"
              />
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status Nikah
              </label>
              <select
                name="status_nikah"
                value={formData.status_nikah}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                <option value="">Pilih Status Nikah</option>
                {MARITAL_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Usia
              </label>
              <input
                type="number"
                name="usia"
                value={formData.usia}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Usia"
                min="0"
                max="150"
              />
            </div>

            {/* Annual Income */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pendapatan Tahunan
              </label>
              <input
                type="number"
                name="annual_income"
                value={formData.annual_income}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Pendapatan Tahunan"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              disabled={isPending}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPending}
            >
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
