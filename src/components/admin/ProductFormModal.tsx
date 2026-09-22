import React, { useEffect, useRef, useState } from 'react';
import api from '../../services/api';
import { resolveImageUrl } from '../../utils';

// ─── Types ─────────────────────────────────────────────────────────────────

export type ProductFormType = 'course' | 'book' | 'merchandise';

interface CourseFormData {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: string;
  compareAtPrice: string;
  duration: string;
  level: string;
  thumbnail: string;
  images: string[];
  bestOffers: string[];
  termsAndConditions: string[];
  productDetails: string[];
  isPublished: boolean;
  isFeatured: boolean;
  date: string;
  time: string;
  categoryId: string;
  meetLink: string;
}

interface BookFormData {
  title: string;
  slug: string;
  author: string;
  shortDescription: string;
  description: string;
  price: string;
  compareAtPrice: string;
  isbn: string;
  format: string;
  coverImage: string;
  images: string[];
  bestOffers: string[];
  termsAndConditions: string[];
  productDetails: string[];
  isActive: boolean;
  featured: boolean;
  categoryId: string;
  downloadLink: string;
}

interface MerchFormData {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: string;
  compareAtPrice: string;
  sku: string;
  stock: string;
  categoryId: string;
  image: string;
  images: string[];
  bestOffers: string[];
  termsAndConditions: string[];
  productDetails: string[];
  isActive: boolean;
  isFeatured: boolean;
}

interface ProductFormModalProps {
  isOpen: boolean;
  mode: 'ADD' | 'EDIT';
  type: ProductFormType;
  initialData?: any;
  categories?: { id: string; name: string }[] | Record<string, { id: string; name: string }[]>;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
const FORMATS = ['Hardcover', 'Paperback', 'E-Book', 'Audiobook', 'Bundle'];

// ─── Multi Image Upload Field ───────────────────────────────────────────────

const MultiImageUploadField: React.FC<{
  label: string;
  images: string[];
  onChange: (imgs: string[]) => void;
  hint?: string;
}> = ({ label, images, onChange, hint }) => {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const fd = new FormData();
        fd.append('image', files[i]);
        const res = await api.post('/uploads/image', fd);
        const url = res.data?.data?.url || res.data?.url || res.data?.path;
        if (url) uploadedUrls.push(url);
      }
      if (uploadedUrls.length > 0) {
        onChange([...images, ...uploadedUrls]);
      }
    } catch {
      alert('One or more image uploads failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    onChange([...images, trimmed]);
    setUrlInput('');
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleSetMain = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const rest = images.filter((_, i) => i !== index);
    onChange([target, ...rest]);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const newIdx = direction === 'left' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= images.length) return;
    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;
    onChange(copy);
  };

  return (
    <div className="pf-field-group pf-span2">
      <div className="pf-multi-header">
        <label className="pf-label">{label}</label>
        <span className="pf-img-count">
          {images.length} {images.length === 1 ? 'image' : 'images'} added
        </span>
      </div>

      {/* Upload actions row */}
      <div className="pf-multi-actions">
        <div className="pf-image-row pf-flex1">
          <input
            type="text"
            className="pf-input pf-flex1"
            placeholder="Paste image URL and press Enter or Add…"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddUrl();
              }
            }}
          />
          <button
            type="button"
            className="pf-add-url-btn"
            onClick={handleAddUrl}
            disabled={!urlInput.trim()}
          >
            + Add URL
          </button>
        </div>

        <button
          type="button"
          className={`pf-upload-btn pf-upload-btn--multi ${uploading ? 'pf-upload-btn--loading' : ''}`}
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <span className="pf-spinner" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          )}
          {uploading ? 'Uploading…' : 'Upload Images'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFiles}
        />
      </div>

      {/* Gallery Cards Grid */}
      {images.length > 0 ? (
        <div className="pf-gallery-grid">
          {images.map((imgUrl, idx) => (
            <div key={`${imgUrl}-${idx}`} className={`pf-gallery-card ${idx === 0 ? 'pf-gallery-card--primary' : ''}`}>
              <div className="pf-gallery-thumb">
                <img
                  src={resolveImageUrl(imgUrl)}
                  alt={`Product img ${idx + 1}`}
                  onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
                />
                {idx === 0 && <span className="pf-primary-badge">★ Main Cover</span>}
              </div>
              <div className="pf-gallery-footer">
                <span className="pf-gallery-order">#{idx + 1}</span>
                <div className="pf-gallery-btns">
                  {idx > 0 && (
                    <button
                      type="button"
                      className="pf-card-btn"
                      title="Move Left"
                      onClick={() => handleMove(idx, 'left')}
                    >
                      ←
                    </button>
                  )}
                  {idx < images.length - 1 && (
                    <button
                      type="button"
                      className="pf-card-btn"
                      title="Move Right"
                      onClick={() => handleMove(idx, 'right')}
                    >
                      →
                    </button>
                  )}
                  {idx !== 0 && (
                    <button
                      type="button"
                      className="pf-card-btn pf-card-btn--main"
                      title="Set as Main Cover Image"
                      onClick={() => handleSetMain(idx)}
                    >
                      Main
                    </button>
                  )}
                  <button
                    type="button"
                    className="pf-card-btn pf-card-btn--delete"
                    title="Remove Image"
                    onClick={() => handleRemove(idx)}
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="pf-empty-gallery" onClick={() => fileRef.current?.click()}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <p>No images added yet. Click to select multiple images from your computer or enter URLs above.</p>
        </div>
      )}

      <div className="pf-media-hint">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        {hint || 'The first image (#1) is used as the primary thumbnail/cover across the store. Reorder or upload multiple angles and views for the product gallery.'}
      </div>
    </div>
  );
};

// ─── Toggle ──────────────────────────────────────────────────────────────────

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string; subtitle?: string }> = ({
  checked, onChange, label, subtitle,
}) => (
  <div className="pf-toggle-row" onClick={() => onChange(!checked)}>
    <div>
      <div className="pf-toggle-label">{label}</div>
      {subtitle && <div className="pf-toggle-sub">{subtitle}</div>}
    </div>
    <div className={`pf-toggle ${checked ? 'pf-toggle--on' : ''}`}>
      <div className="pf-toggle-knob" />
    </div>
  </div>
);

// ─── Section Header ───────────────────────────────────────────────────────────

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="pf-section">
    <div className="pf-section-header">
      <span className="pf-section-icon">{icon}</span>
      <span className="pf-section-title">{title}</span>
    </div>
    <div className="pf-section-body">{children}</div>
  </div>
);

const EMPTY_CATEGORIES: { id: string; name: string }[] = [];

// Helper to get flat category array from either array or object prop
function flatCategories(cat: any): { id: string; name: string }[] {
  if (!cat) return [];
  if (Array.isArray(cat)) return cat;
  // It's a keyed map — return first array found
  const vals = Object.values(cat);
  if (vals.length > 0 && Array.isArray(vals[0])) return vals[0] as { id: string; name: string }[];
  return [];
}

// ─── Main Component ───────────────────────────────────────────────────────────


const StringListInput: React.FC<{
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}> = ({ label, items, onChange, placeholder }) => {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim()) {
      onChange([...items, input.trim()]);
      setInput('');
    }
  };

  const handleRemove = (index: number) => {
    const copy = [...items];
    copy.splice(index, 1);
    onChange(copy);
  };

  return (
    <div className="pf-field-group pf-span2" style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px' }}>
      <label className="pf-label">{label}</label>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <input 
          className="pf-input pf-flex1" 
          value={input} 
          onChange={e => setInput(e.target.value)}
          placeholder={placeholder || "Add bullet point..."}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <button type="button" onClick={handleAdd} className="pf-add-url-btn" style={{ padding: '0 1rem' }}>Add</button>
      </div>
      {items.length > 0 && (
        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', margin: 0, fontSize: '0.9rem', color: '#555' }}>
          {items.map((item, i) => (
            <li key={i} style={{ marginBottom: '4px' }}>
              <span>{item}</span>
              <button type="button" onClick={() => handleRemove(i)} style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', marginLeft: '8px', padding: 0 }}>&times;</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen, mode, type, initialData, categories: categoriesProp = EMPTY_CATEGORIES, onClose, onSave,
}) => {
  const categories = flatCategories(categoriesProp);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'media' | 'settings' | 'details'>('basic');

  // ── Course state ─────────────────────────────────────────────────────────
  const [course, setCourse] = useState<CourseFormData>({
    title: '', slug: '', shortDescription: '', description: '',
    price: '', compareAtPrice: '', duration: '', level: '',
    thumbnail: '', images: [], isPublished: false, isFeatured: false,
    date: '', time: '', categoryId: '', meetLink: '', bestOffers: [], termsAndConditions: [], productDetails: [],
  });

  // ── Book state ───────────────────────────────────────────────────────────
  const [book, setBook] = useState<BookFormData>({
    title: '', slug: '', author: '', shortDescription: '', description: '',
    price: '', compareAtPrice: '', isbn: '', format: '',
    coverImage: '', images: [], isActive: true, featured: false, categoryId: '', downloadLink: '', bestOffers: [], termsAndConditions: [], productDetails: [],
  });

  // ── Merch state ──────────────────────────────────────────────────────────
  const [merch, setMerch] = useState<MerchFormData>({
    name: '', slug: '', shortDescription: '', description: '',
    price: '', compareAtPrice: '', sku: '', stock: '0',
    categoryId: '', image: '', images: [], isActive: true, isFeatured: false, bestOffers: [], termsAndConditions: [], productDetails: [],
  });

  // ── Reset on open ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    setActiveTab('basic');

    if (mode === 'EDIT' && initialData) {
      if (type === 'course') {
        const rawImgs = Array.isArray(initialData.images) && initialData.images.length > 0
          ? initialData.images.map((i: any) => typeof i === 'string' ? i : i.url)
          : (initialData.thumbnail ? [initialData.thumbnail] : []);
        setCourse({
          title: initialData.title ?? '',
          slug: initialData.slug ?? '',
          shortDescription: initialData.shortDescription ?? '',
          description: initialData.description ?? '',
          price: initialData.price !== undefined && initialData.price !== null ? String(initialData.price) : '',
          compareAtPrice: initialData.compareAtPrice !== undefined && initialData.compareAtPrice !== null ? String(initialData.compareAtPrice) : '',
          duration: initialData.duration ?? '',
          level: initialData.level ?? '',
          thumbnail: rawImgs[0] || initialData.thumbnail || '',
          images: rawImgs,
          isPublished: !!initialData.isPublished,
          isFeatured: !!initialData.isFeatured,
          date: initialData.date ?? '',
          time: initialData.time ?? '',
          categoryId: initialData.categoryId ?? '',
          meetLink: initialData.meetLink ?? '',
            bestOffers: Array.isArray(initialData.bestOffers) ? initialData.bestOffers : [],
            termsAndConditions: Array.isArray(initialData.termsAndConditions) ? initialData.termsAndConditions : [],
            productDetails: Array.isArray(initialData.productDetails) ? initialData.productDetails : [],
        });
      } else if (type === 'book') {
        const rawImgs = Array.isArray(initialData.images) && initialData.images.length > 0
          ? initialData.images.map((i: any) => typeof i === 'string' ? i : i.url)
          : (initialData.coverImage ? [initialData.coverImage] : []);
        setBook({
          title: initialData.title ?? '',
          slug: initialData.slug ?? '',
          author: initialData.author ?? '',
          shortDescription: initialData.shortDescription ?? '',
          description: initialData.description ?? '',
          price: initialData.price !== undefined && initialData.price !== null ? String(initialData.price) : '',
          compareAtPrice: initialData.compareAtPrice !== undefined && initialData.compareAtPrice !== null ? String(initialData.compareAtPrice) : '',
          isbn: initialData.isbn ?? '',
          format: initialData.format ?? '',
          coverImage: rawImgs[0] || initialData.coverImage || '',
          images: rawImgs,
          isActive: initialData.isActive !== false,
          featured: !!initialData.featured,
          categoryId: initialData.categoryId ?? '',
          downloadLink: initialData.downloadLink ?? '',
            bestOffers: Array.isArray(initialData.bestOffers) ? initialData.bestOffers : [],
            termsAndConditions: Array.isArray(initialData.termsAndConditions) ? initialData.termsAndConditions : [],
            productDetails: Array.isArray(initialData.productDetails) ? initialData.productDetails : [],
          });
      } else {
        const rawImgs = Array.isArray(initialData.images) && initialData.images.length > 0
          ? initialData.images.map((i: any) => typeof i === 'string' ? i : i.url)
          : (initialData.image ? [initialData.image] : []);
        setMerch({
          name: initialData.name ?? '',
          slug: initialData.slug ?? '',
          shortDescription: initialData.shortDescription ?? '',
          description: initialData.description ?? '',
          price: initialData.price !== undefined && initialData.price !== null ? String(initialData.price) : '',
          compareAtPrice: initialData.compareAtPrice !== undefined && initialData.compareAtPrice !== null ? String(initialData.compareAtPrice) : '',
          sku: initialData.sku ?? '',
          stock: String(initialData.stock ?? 0),
          categoryId: initialData.categoryId ?? (categories[0]?.id ?? ''),
          image: rawImgs[0] || initialData.image || '',
          images: rawImgs,
          isActive: initialData.isActive !== false,
          isFeatured: !!initialData.isFeatured,
            bestOffers: Array.isArray(initialData.bestOffers) ? initialData.bestOffers : [],
            termsAndConditions: Array.isArray(initialData.termsAndConditions) ? initialData.termsAndConditions : [],
            productDetails: Array.isArray(initialData.productDetails) ? initialData.productDetails : [],
          });
      }
    } else {
      setCourse({ title: '', slug: '', shortDescription: '', description: '', price: '', compareAtPrice: '', duration: '', level: '', thumbnail: '', images: [], isPublished: false, isFeatured: false, date: '', time: '', categoryId: '', meetLink: '', bestOffers: [], termsAndConditions: [], productDetails: [] });
      setBook({ title: '', slug: '', author: '', shortDescription: '', description: '', price: '', compareAtPrice: '', isbn: '', format: '', coverImage: '', images: [], isActive: true, featured: false, categoryId: '', downloadLink: '', bestOffers: [], termsAndConditions: [], productDetails: [] });
      setMerch({ name: '', slug: '', shortDescription: '', description: '', price: '', compareAtPrice: '', sku: '', stock: '0', categoryId: categories && Array.isArray(categories) ? (categories[0]?.id ?? '') : '', image: '', images: [], isActive: true, isFeatured: false, bestOffers: [], termsAndConditions: [], productDetails: [] });
    }
  }, [isOpen, mode, type, initialData]);

  // ── Auto-slug ────────────────────────────────────────────────────────────
  const handleTitleChange = (val: string) => {
    if (type === 'course') setCourse(p => ({ ...p, title: val, slug: mode === 'ADD' ? slugify(val) : p.slug }));
    else if (type === 'book') setBook(p => ({ ...p, title: val, slug: mode === 'ADD' ? slugify(val) : p.slug }));
    else setMerch(p => ({ ...p, name: val, slug: mode === 'ADD' ? slugify(val) : p.slug }));
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let payload: any;
      if (type === 'course') {
        payload = {
          ...course,
          thumbnail: course.images[0] || course.thumbnail || '',
          images: course.images,
          price: Number(course.price),
          compareAtPrice: course.compareAtPrice ? Number(course.compareAtPrice) : null,
          date: course.date || null,
          time: course.time || null,
          categoryId: course.categoryId || null,
          meetLink: course.meetLink || null,
        };
      } else if (type === 'book') {
        payload = {
          ...book,
          coverImage: book.images[0] || book.coverImage || '',
          images: book.images,
          price: Number(book.price),
          compareAtPrice: book.compareAtPrice ? Number(book.compareAtPrice) : null,
          categoryId: book.categoryId || null,
          downloadLink: book.downloadLink || null,
        };
      } else {
        payload = {
          ...merch,
          images: merch.images,
          price: Number(merch.price),
          compareAtPrice: merch.compareAtPrice ? Number(merch.compareAtPrice) : null,
          stock: Number(merch.stock),
        };
        delete payload.image;
      }
      await onSave(payload);
      onClose();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const tabs = [
      { id: 'basic', label: 'Basic Info', icon: '📝' },
      { id: 'pricing', label: 'Pricing', icon: '💰' },
      { id: 'media', label: 'Media', icon: '🖼️' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
      { id: 'details', label: 'Cards Content', icon: '📋' }
    ] as const;

  const typeLabel = type === 'course' ? 'Course' : type === 'book' ? 'Book' : 'Product';

  return (
    <div className="pf-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pf-modal">
        {/* ── Header ── */}
        <div className="pf-header">
          <div className="pf-header-left">
            <div className="pf-header-badge">{typeLabel}</div>
            <h2 className="pf-header-title">{mode === 'ADD' ? `New ${typeLabel}` : `Edit ${type === 'merchandise' ? (merch.name || 'Product') : type === 'book' ? (book.title || 'Book') : (course.title || 'Course')}`}</h2>
          </div>
          <button type="button" className="pf-close-btn" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="pf-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`pf-tab ${activeTab === tab.id ? 'pf-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="pf-form">
          <div className="pf-body">

            {/* ══ BASIC INFO ══ */}
            {activeTab === 'basic' && (
              <>
                <Section
                  title="Product Identity"
                  icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>}
                >
                  {type === 'course' && (
                    <>
                      <div className="pf-field-group pf-span2">
                        <label className="pf-label pf-required">Title</label>
                        <input required className="pf-input" placeholder="e.g. Life Coaching Masterclass" value={course.title} onChange={e => handleTitleChange(e.target.value)} />
                      </div>
                      <div className="pf-field-group">
                        <label className="pf-label">Slug <span className="pf-label-hint">(auto-generated)</span></label>
                        <input className="pf-input pf-input--mono" placeholder="life-coaching-masterclass" value={course.slug} onChange={e => setCourse(p => ({ ...p, slug: slugify(e.target.value) }))} />
                      </div>
                      <div className="pf-field-group">
                        <label className="pf-label">Level</label>
                        <select className="pf-input" value={course.level} onChange={e => setCourse(p => ({ ...p, level: e.target.value }))}>
                          <option value="">Select level…</option>
                          {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                      <div className="pf-field-group pf-span2">
                        <label className="pf-label">Subtitle <span className="pf-label-hint">(shown below title on the product page)</span></label>
                        <input className="pf-input" placeholder="e.g. Talk to yourself like someone you love." value={course.shortDescription} onChange={e => setCourse(p => ({ ...p, shortDescription: e.target.value }))} />
                      </div>
                      <div className="pf-field-group pf-span2">
                        <label className="pf-label pf-required">Full Description</label>
                        <textarea required rows={5} className="pf-input pf-textarea" placeholder="Describe what students will learn, the course structure, and expected outcomes…" value={course.description} onChange={e => setCourse(p => ({ ...p, description: e.target.value }))} />
                      </div>
                      <div className="pf-field-group">
                        <label className="pf-label">Duration</label>
                        <input className="pf-input" placeholder="e.g. 6 Weeks" value={course.duration} onChange={e => setCourse(p => ({ ...p, duration: e.target.value }))} />
                      </div>
                      <div className="pf-field-group">
                        <label className="pf-label">Date of Event</label>
                        <input type="date" className="pf-input" value={course.date} onChange={e => setCourse(p => ({ ...p, date: e.target.value }))} />
                      </div>
                      <div className="pf-field-group">
                        <label className="pf-label">Time of Event</label>
                        <input type="time" className="pf-input" value={course.time} onChange={e => setCourse(p => ({ ...p, time: e.target.value }))} />
                      </div>
                      {categories.length > 0 && (
                        <div className="pf-field-group">
                          <label className="pf-label">Category</label>
                          <select className="pf-input" value={course.categoryId} onChange={e => setCourse(p => ({ ...p, categoryId: e.target.value }))}>
                            <option value="">Select category…</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                      )}
                      <div className="pf-field-group pf-span2">
                        <label className="pf-label">Zoom / Meet Link <span className="pf-label-hint">(sent to student after purchase)</span></label>
                        <input
                          type="url"
                          className="pf-input"
                          placeholder="https://meet.google.com/xxx-yyyy-zzz"
                          value={course.meetLink}
                          onChange={e => setCourse(p => ({ ...p, meetLink: e.target.value }))}
                        />
                      </div>
                    </>
                  )}

                  {type === 'book' && (
                    <>
                      <div className="pf-field-group pf-span2">
                        <label className="pf-label pf-required">Title</label>
                        <input required className="pf-input" placeholder="e.g. The Inner Alignment" value={book.title} onChange={e => handleTitleChange(e.target.value)} />
                      </div>
                      <div className="pf-field-group">
                        <label className="pf-label pf-required">Author</label>
                        <input required className="pf-input" placeholder="e.g. Jawedan Sehar" value={book.author} onChange={e => setBook(p => ({ ...p, author: e.target.value }))} />
                      </div>
                      <div className="pf-field-group">
                        <label className="pf-label">Slug <span className="pf-label-hint">(auto-generated)</span></label>
                        <input className="pf-input pf-input--mono" placeholder="the-inner-alignment" value={book.slug} onChange={e => setBook(p => ({ ...p, slug: slugify(e.target.value) }))} />
                      </div>
                      <div className="pf-field-group pf-span2">
                        <label className="pf-label">Subtitle <span className="pf-label-hint">(shown below title on the product page)</span></label>
                        <input className="pf-input" placeholder="e.g. A guide to finding your inner peace." value={book.shortDescription} onChange={e => setBook(p => ({ ...p, shortDescription: e.target.value }))} />
                      </div>
                      <div className="pf-field-group pf-span2">
                        <label className="pf-label pf-required">Full Description</label>
                        <textarea required rows={5} className="pf-input pf-textarea" placeholder="Describe the book — themes, what readers will gain, target audience…" value={book.description} onChange={e => setBook(p => ({ ...p, description: e.target.value }))} />
                      </div>
                      <div className="pf-field-group">
                        <label className="pf-label">Format</label>
                        <select className="pf-input" value={book.format} onChange={e => setBook(p => ({ ...p, format: e.target.value }))}>
                          <option value="">Select format…</option>
                          {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                      <div className="pf-field-group">
                        <label className="pf-label">ISBN</label>
                        <input className="pf-input pf-input--mono" placeholder="978-0-000000-00-0" value={book.isbn} onChange={e => setBook(p => ({ ...p, isbn: e.target.value }))} />
                      </div>
                      {categories.length > 0 && (
                        <div className="pf-field-group">
                          <label className="pf-label">Category</label>
                          <select className="pf-input" value={book.categoryId} onChange={e => setBook(p => ({ ...p, categoryId: e.target.value }))}>
                            <option value="">Select category…</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                      )}
                      <div className="pf-field-group pf-span2">
                        <label className="pf-label">Download Link <span className="pf-label-hint">(sent to buyer after purchase)</span></label>
                        <input
                          type="url"
                          className="pf-input"
                          placeholder="https://drive.google.com/file/d/..."
                          value={book.downloadLink}
                          onChange={e => setBook(p => ({ ...p, downloadLink: e.target.value }))}
                        />
                      </div>
                    </>
                  )}

                  {type === 'merchandise' && (
                    <>
                      <div className="pf-field-group pf-span2">
                        <label className="pf-label pf-required">Product Name</label>
                        <input required className="pf-input" placeholder="e.g. Soul Compass Journal" value={merch.name} onChange={e => handleTitleChange(e.target.value)} />
                      </div>
                      <div className="pf-field-group">
                        <label className="pf-label">Slug <span className="pf-label-hint">(auto-generated)</span></label>
                        <input className="pf-input pf-input--mono" placeholder="soul-compass-journal" value={merch.slug} onChange={e => setMerch(p => ({ ...p, slug: slugify(e.target.value) }))} />
                      </div>
                      <div className="pf-field-group">
                        <label className="pf-label pf-required">SKU</label>
                        <input required className="pf-input pf-input--mono" placeholder="e.g. SAS-JRN-001" value={merch.sku} onChange={e => setMerch(p => ({ ...p, sku: e.target.value }))} />
                      </div>
                      <div className="pf-field-group pf-span2">
                        <label className="pf-label">Subtitle <span className="pf-label-hint">(shown below title on the product page)</span></label>
                        <input className="pf-input" placeholder="e.g. Wear what reminds you who you are." value={merch.shortDescription} onChange={e => setMerch(p => ({ ...p, shortDescription: e.target.value }))} />
                      </div>
                      <div className="pf-field-group pf-span2">
                        <label className="pf-label pf-required">Full Description</label>
                        <textarea required rows={5} className="pf-input pf-textarea" placeholder="Describe the product — material, purpose, what makes it meaningful…" value={merch.description} onChange={e => setMerch(p => ({ ...p, description: e.target.value }))} />
                      </div>
                      <div className="pf-field-group">
                        <label className="pf-label pf-required">Category</label>
                        <select required className="pf-input" value={merch.categoryId} onChange={e => setMerch(p => ({ ...p, categoryId: e.target.value }))}>
                          <option value="">Select category…</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                    </>
                  )}
                </Section>
              </>
            )}

            {/* ══ PRICING ══ */}
            {activeTab === 'pricing' && (
              <Section
                title="Pricing & Inventory"
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
              >
                <div className="pf-field-group">
                  <label className="pf-label pf-required">Sale Price (₹)</label>
                  <div className="pf-input-prefix-wrap">
                    <span className="pf-prefix">₹</span>
                    <input
                      required type="number" min="0" step="0.01"
                      className="pf-input pf-input--prefixed"
                      placeholder="0.00"
                      value={type === 'course' ? course.price : type === 'book' ? book.price : merch.price}
                      onChange={e => {
                        if (type === 'course') setCourse(p => ({ ...p, price: e.target.value }));
                        else if (type === 'book') setBook(p => ({ ...p, price: e.target.value }));
                        else setMerch(p => ({ ...p, price: e.target.value }));
                      }}
                    />
                  </div>
                </div>

                <div className="pf-field-group">
                  <label className="pf-label">Original Price (₹) <span className="pf-label-hint">(for strike-through)</span></label>
                  <div className="pf-input-prefix-wrap">
                    <span className="pf-prefix">₹</span>
                    <input
                      type="number" min="0" step="0.01"
                      className="pf-input pf-input--prefixed"
                      placeholder="0.00"
                      value={type === 'course' ? course.compareAtPrice : type === 'book' ? book.compareAtPrice : merch.compareAtPrice}
                      onChange={e => {
                        if (type === 'course') setCourse(p => ({ ...p, compareAtPrice: e.target.value }));
                        else if (type === 'book') setBook(p => ({ ...p, compareAtPrice: e.target.value }));
                        else setMerch(p => ({ ...p, compareAtPrice: e.target.value }));
                      }}
                    />
                  </div>
                </div>

                {/* Discount preview */}
                {(() => {
                  const sale = Number(type === 'course' ? course.price : type === 'book' ? book.price : merch.price);
                  const orig = Number(type === 'course' ? course.compareAtPrice : type === 'book' ? book.compareAtPrice : merch.compareAtPrice);
                  const discount = sale > 0 && orig > sale ? Math.round((1 - sale / orig) * 100) : 0;
                  return discount > 0 ? (
                    <div className="pf-span2 pf-discount-badge">
                      🎉 {discount}% discount — saves ₹{(orig - sale).toFixed(0)}
                    </div>
                  ) : null;
                })()}

                {type === 'merchandise' && (
                  <div className="pf-field-group">
                    <label className="pf-label">Stock Quantity</label>
                    <input
                      type="number" min="0"
                      className="pf-input"
                      placeholder="0"
                      value={merch.stock}
                      onChange={e => setMerch(p => ({ ...p, stock: e.target.value }))}
                    />
                  </div>
                )}
              </Section>
            )}

            {/* ══ MEDIA ══ */}
            {activeTab === 'media' && (
              <Section
                title="Images & Gallery"
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
              >
                {type === 'course' && (
                  <MultiImageUploadField
                    label="Course Images & Thumbnail"
                    images={course.images}
                    onChange={imgs => setCourse(p => ({ ...p, images: imgs, thumbnail: imgs[0] || '' }))}
                    hint="The first image is the course card thumbnail. Additional images appear in the course presentation gallery."
                  />
                )}
                {type === 'book' && (
                  <MultiImageUploadField
                    label="Book Images & Cover"
                    images={book.images}
                    onChange={imgs => setBook(p => ({ ...p, images: imgs, coverImage: imgs[0] || '' }))}
                    hint="The first image is the book cover. Additional images (back cover, inside pages) appear in the product gallery."
                  />
                )}
                {type === 'merchandise' && (
                  <MultiImageUploadField
                    label="Product Gallery & Main Image"
                    images={merch.images}
                    onChange={imgs => setMerch(p => ({ ...p, images: imgs, image: imgs[0] || '' }))}
                    hint="The first image is the main catalog image. Additional images (angles, details, packaging) appear in the product gallery."
                  />
                )}
              </Section>
            )}

            {/* ══ SETTINGS ══ */}
            {activeTab === 'settings' && (
              <Section
                title="Visibility & Flags"
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 20v2M12 2v2"/></svg>}
              >
                {type === 'course' && (
                  <>
                    <div className="pf-span2">
                      <Toggle
                        checked={course.isPublished}
                        onChange={v => setCourse(p => ({ ...p, isPublished: v }))}
                        label="Published"
                        subtitle="Make this course visible on the public Courses page"
                      />
                    </div>
                    <div className="pf-span2">
                      <Toggle
                        checked={course.isFeatured}
                        onChange={v => setCourse(p => ({ ...p, isFeatured: v }))}
                        label="Featured"
                        subtitle="Pin this course to the top of the listing"
                      />
                    </div>
                  </>
                )}
                {type === 'book' && (
                  <>
                    <div className="pf-span2">
                      <Toggle
                        checked={book.isActive}
                        onChange={v => setBook(p => ({ ...p, isActive: v }))}
                        label="Active / Published"
                        subtitle="Make this book visible on the public Books page"
                      />
                    </div>
                    <div className="pf-span2">
                      <Toggle
                        checked={book.featured}
                        onChange={v => setBook(p => ({ ...p, featured: v }))}
                        label="Featured"
                        subtitle="Pin this book to the top of the listing"
                      />
                    </div>
                  </>
                )}
                {type === 'merchandise' && (
                  <>
                    <div className="pf-span2">
                      <Toggle
                        checked={merch.isActive}
                        onChange={v => setMerch(p => ({ ...p, isActive: v }))}
                        label="Active / Published"
                        subtitle="Make this product visible on the Shop page"
                      />
                    </div>
                    <div className="pf-span2">
                      <Toggle
                        checked={merch.isFeatured}
                        onChange={v => setMerch(p => ({ ...p, isFeatured: v }))}
                        label="Featured"
                        subtitle="Pin this product to the top of the listing"
                      />
                    </div>
                  </>
                )}
              </Section>
            )}

        
            {/* 📋 DETAILS */}
            {activeTab === 'details' && (
              <Section
                title="Dynamic Info Cards"
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>}
              >
                <StringListInput 
                  label="BEST OFFERS" 
                  items={type === 'course' ? course.bestOffers : type === 'book' ? book.bestOffers : merch.bestOffers}
                  onChange={items => {
                    if (type === 'course') setCourse(p => ({ ...p, bestOffers: items }));
                    else if (type === 'book') setBook(p => ({ ...p, bestOffers: items }));
                    else setMerch(p => ({ ...p, bestOffers: items }));
                  }}
                  placeholder="e.g. Applicable on: Orders above Rs. 300"
                />
                <StringListInput 
                  label="TERMS & CONDITION" 
                  items={type === 'course' ? course.termsAndConditions : type === 'book' ? book.termsAndConditions : merch.termsAndConditions}
                  onChange={items => {
                    if (type === 'course') setCourse(p => ({ ...p, termsAndConditions: items }));
                    else if (type === 'book') setBook(p => ({ ...p, termsAndConditions: items }));
                    else setMerch(p => ({ ...p, termsAndConditions: items }));
                  }}
                />
                <StringListInput 
                  label="PRODUCT DETAILS" 
                  items={type === 'course' ? course.productDetails : type === 'book' ? book.productDetails : merch.productDetails}
                  onChange={items => {
                    if (type === 'course') setCourse(p => ({ ...p, productDetails: items }));
                    else if (type === 'book') setBook(p => ({ ...p, productDetails: items }));
                    else setMerch(p => ({ ...p, productDetails: items }));
                  }}
                />
              </Section>
            )}

          
          </div>

          {/* ── Footer ── */}
          <div className="pf-footer">
            <div className="pf-tab-nav">
              {tabs.map((tab) => (
                <button key={tab.id} type="button" className={`pf-tab-dot ${activeTab === tab.id ? 'pf-tab-dot--active' : ''}`} onClick={() => setActiveTab(tab.id)} title={tab.label} />
              ))}
            </div>
            <div className="pf-footer-actions">
              <button type="button" className="pf-btn-cancel" onClick={onClose} disabled={saving}>Cancel</button>
              {activeTab !== 'details' ? (
                <button type="button" className="pf-btn-next" onClick={() => {
                  const idx = tabs.findIndex(t => t.id === activeTab);
                  if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id);
                }}>Next →</button>
              ) : (
                <button type="submit" className="pf-btn-save" disabled={saving}>
                  {saving ? <><span className="pf-spinner" /> Saving…</> : `${mode === 'ADD' ? 'Create' : 'Save'} ${typeLabel}`}
                </button>
              )}
            </div>
          </div>
          </form>
      </div>
    </div>
  );
};
