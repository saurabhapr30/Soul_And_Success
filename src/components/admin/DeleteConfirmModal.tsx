import React from 'react';
import { AlertTriangle } from 'lucide-react';
const toast = { error: (msg: string) => alert(msg), success: (msg: string) => alert(msg) };

interface DeleteConfirmModalProps {
  isOpen: boolean;
  itemName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  itemName,
  onClose,
  onConfirm
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
      <div className="bg-[#1a1310] border border-red-500/20 rounded-xl w-full max-w-md shadow-2xl overflow-hidden p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-4 mx-auto">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        
        <h3 className="text-xl font-['Cinzel'] text-center text-white mb-2">Confirm Deletion</h3>
        <p className="text-gray-400 text-center mb-8">
          Are you sure you want to delete <strong className="text-white">"{itemName}"</strong>? This action cannot be undone.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-6 py-2 rounded-full border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-6 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
