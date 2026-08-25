import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { resolveImageUrl } from '../../utils';
const toast = { error: (msg: string) => alert(msg), success: (msg: string) => alert(msg) };

export interface FieldDef {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'checkbox' | 'select';
  required?: boolean;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  placeholder?: string;
}

interface AdminCrudModalProps {
  isOpen: boolean;
  mode: 'ADD' | 'EDIT';
  title: string;
  fields: FieldDef[];
  initialData: any;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export const AdminCrudModal: React.FC<AdminCrudModalProps> = ({
  isOpen,
  mode,
  title,
  fields,
  initialData,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'EDIT' && initialData) {
        setFormData({ ...initialData });
      } else {
        const defaultData: any = {};
        fields.forEach(f => {
          if (f.type === 'checkbox') defaultData[f.name] = false;
          else if (f.type === 'number') defaultData[f.name] = 0;
          else defaultData[f.name] = '';
        });
        setFormData(defaultData);
      }
    }
  }, [isOpen, mode, initialData, fields]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev: any) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev: any) => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(prev => ({ ...prev, [fieldName]: true }));
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const res = await api.post('/uploads/image', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const url = res.data?.data?.url || res.data?.url;
      if (url) {
        setFormData((prev: any) => ({ ...prev, [fieldName]: url }));
        toast.success('Image uploaded successfully!');
      }
    } catch (err: any) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const isImageField = (name: string) => {
    const n = name.toLowerCase();
    return n.includes('image') || n.includes('thumbnail') || n.includes('avatar') || n.includes('cover');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6">
      <div className="bg-[#1a1310] border border-[#E27D60]/20 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-[#E27D60]/20">
          <h2 className="text-2xl font-['Cinzel'] text-[#E27D60]">
            {mode === 'ADD' ? 'Add New' : 'Edit'} {title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-[#E27D60] transition-colors">
            X
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {fields.map((field) => (
              <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {field.label} {field.required && <span className="text-[#E27D60]">*</span>}
                </label>
                
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    rows={4}
                    className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E27D60] transition-colors"
                  />
                ) : field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E27D60] transition-colors"
                  >
                    <option value="" disabled>Select {field.label}</option>
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <div className="flex items-center h-[42px]">
                    <input
                      type="checkbox"
                      name={field.name}
                      checked={!!formData[field.name]}
                      onChange={handleChange}
                      className="w-5 h-5 accent-[#E27D60] rounded border-gray-800 bg-black/50"
                    />
                    <span className="ml-3 text-gray-300">Enable {field.label}</span>
                  </div>
                ) : isImageField(field.name) && field.type === 'text' ? (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        required={field.required}
                        placeholder="Enter URL or upload ->"
                        className="flex-1 w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E27D60] transition-colors"
                      />
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleFileUpload(e, field.name)} 
                          disabled={isUploading[field.name]}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                        />
                        <button type="button" disabled={isUploading[field.name]} className="bg-[#E27D60] text-white px-4 py-2 rounded-lg hover:bg-[#c66b50] transition-colors whitespace-nowrap disabled:opacity-50">
                          {isUploading[field.name] ? 'Uploading...' : 'Upload'}
                        </button>
                      </div>
                    </div>
                    {formData[field.name] && (
                      <div className="mt-2 h-20 w-20 rounded border border-gray-700 overflow-hidden bg-black/50">
                        <img src={resolveImageUrl(formData[field.name])} alt="preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] === undefined ? (field.type === 'number' ? 0 : '') : formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    min={field.min}
                    max={field.max}
                    placeholder={field.placeholder}
                    className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E27D60] transition-colors placeholder:text-gray-600"
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end gap-4 pt-6 border-t border-[#E27D60]/20 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-2 rounded-full border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 rounded-full bg-[#E27D60] text-white hover:bg-[#c66b50] transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
