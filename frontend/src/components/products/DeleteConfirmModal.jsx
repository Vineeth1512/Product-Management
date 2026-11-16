import React from "react";
import { AlertTriangle, X } from "lucide-react";
import Button from "../ui/Button";

/**
 * Confirmation Dialog for Deleting Products
 */
const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  productName = "this product",
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              Delete Product
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-slate-900">
                &ldquo;{productName}&rdquo;
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={onConfirm}
            isLoading={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Permanently"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
