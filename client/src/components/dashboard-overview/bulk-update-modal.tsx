"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useBulkUpdateCustomers } from "@/hooks/dashboard-overview/use-bulk-update";
import { useToast } from "@/hooks/use-toast";

interface BulkUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  selectedCustomerIDs: string[];
  onSuccess: () => void;
}

const RISK_PROFILES = [
  "Conservative",
  "Balanced",
  "Moderate",
  "Growth",
  "Aggressive",
];

const PROPENSITY_OPTIONS = ["low", "medium", "high", "qualified"];

const AUM_LABEL_OPTIONS = ["zero", "low", "medium", "high"];

const PRIORITY_OPTIONS = ["PRIORITY", "PRIVATE"];

const MARITAL_STATUS_OPTIONS = ["Married", "Single", "Divorced", "Widowed"];

export default function BulkUpdateModal({
  isOpen,
  onClose,
  selectedCount,
  selectedCustomerIDs,
  onSuccess,
}: BulkUpdateModalProps) {
  const { mutateAsync: bulkUpdate, isPending } = useBulkUpdateCustomers();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    risk_profile: "",
    aum_label: "",
    propensity: "",
    priority_private: "",
    customer_type: "",
    pekerjaan: "",
    status_nikah: "",
    usia: "",
    annual_income: "",
    assigned_rm: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build update data object with only filled fields
    const updateData: any = {};
    if (formData.risk_profile && formData.risk_profile.trim())
      updateData.risk_profile = formData.risk_profile;
    if (formData.aum_label && formData.aum_label.trim())
      updateData.aum_label = formData.aum_label;
    if (formData.propensity && formData.propensity.trim())
      updateData.propensity = formData.propensity;
    if (formData.priority_private && formData.priority_private.trim())
      updateData.priority_private = formData.priority_private;
    if (formData.customer_type && formData.customer_type.trim())
      updateData.customer_type = formData.customer_type;
    if (formData.pekerjaan && formData.pekerjaan.trim())
      updateData.pekerjaan = formData.pekerjaan;
    if (formData.status_nikah && formData.status_nikah.trim())
      updateData.status_nikah = formData.status_nikah;
    if (formData.usia && formData.usia.trim()) updateData.usia = formData.usia;
    if (formData.annual_income && formData.annual_income.trim()) {
      // Ensure annual_income is a valid number string
      const numValue = parseFloat(formData.annual_income);
      if (!isNaN(numValue)) {
        updateData.annual_income = formData.annual_income;
      }
    }
    if (formData.assigned_rm && formData.assigned_rm.trim())
      updateData.assigned_rm = formData.assigned_rm;

    if (Object.keys(updateData).length === 0) {
      toast({
        title: "Error",
        description: "Please fill at least one field to update",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await bulkUpdate({
        customerIDs: selectedCustomerIDs,
        ...updateData,
      });
      toast({
        title: "Success",
        description: `Successfully updated ${result.updated} customer(s)`,
      });
      onSuccess();
      handleClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update customers",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setFormData({
      risk_profile: "",
      aum_label: "",
      propensity: "",
      priority_private: "",
      customer_type: "",
      pekerjaan: "",
      status_nikah: "",
      usia: "",
      annual_income: "",
      assigned_rm: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Bulk Update {selectedCount} Customers
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Fill only the fields you want to update. Empty fields will be ignored.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Risk Profile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Risk Profile
              </label>
              <select
                name="risk_profile"
                value={formData.risk_profile}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                <option value="">Leave unchanged</option>
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
                AUM Label
              </label>
              <select
                name="aum_label"
                value={formData.aum_label}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                <option value="">Leave unchanged</option>
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
                <option value="">Leave unchanged</option>
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
                <option value="">Leave unchanged</option>
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
                Customer Type
              </label>
              <input
                type="text"
                name="customer_type"
                value={formData.customer_type}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Leave empty to skip"
              />
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Occupation
              </label>
              <input
                type="text"
                name="pekerjaan"
                value={formData.pekerjaan}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Leave empty to skip"
              />
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Marital Status
              </label>
              <select
                name="status_nikah"
                value={formData.status_nikah}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                <option value="">Leave unchanged</option>
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
                Age
              </label>
              <input
                type="number"
                name="usia"
                value={formData.usia}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Leave empty to skip"
                min="0"
                max="150"
              />
            </div>

            {/* Annual Income */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Annual Income
              </label>
              <input
                type="number"
                name="annual_income"
                value={formData.annual_income}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Leave empty to skip"
                min="0"
                step="0.01"
              />
            </div>

            {/* Assigned RM */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reassign RM
              </label>
              <input
                type="text"
                name="assigned_rm"
                value={formData.assigned_rm}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="RM Number (leave empty to skip)"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPending}
            >
              {isPending ? "Updating..." : `Update ${selectedCount} Customers`}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
