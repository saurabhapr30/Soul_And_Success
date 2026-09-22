import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { X, UploadCloud, Edit3, Image as ImageIcon, Trash2, CheckCircle2, ChevronDown } from 'lucide-react';
import api from '../../services/api';
import { resolveImageUrl } from '../../utils';
import './BlogEditorModal.css';

interface BlogEditorModalProps {
  onClose: () => void;
  onSuccess: () => void;
  existingPost?: any;
}

const BLOG_CATEGORIES = [
  'Relationships',
  'The Inner Work',
  'Attraction',
  'Communication',
  'Dating',
  'Feminine Energy',
  'Intimacy',
  'Masculine Energy',
];

export function BlogEditorModal({ onClose, onSuccess, existingPost }: BlogEditorModalProps) {
  const [categories, setCategories] = useState<any[]>(
    BLOG_CATEGORIES.map(name => ({ id: name, name }))
  );

  const [formData, setFormData] = useState({
    title: existingPost?.title || '',
    slug: existingPost?.slug || '',
    excerpt: existingPost?.excerpt || '',
    content: existingPost?.content || '',
    categoryId: existingPost?.categoryId || existingPost?.category?.id || existingPost?.category?.name || '',
    featuredImage: existingPost?.featuredImage || '',
    galleryImages: existingPost?.galleryImages || [],
    seoTitle: existingPost?.seoTitle || '',
    seoDescription: existingPost?.seoDescription || '',
    canonicalUrl: existingPost?.canonicalUrl || '',
  });

  const [tags, setTags] = useState<string[]>(
    existingPost?.tags?.map((t: any) => typeof t === 'string' ? t : t.name) || []
  );
  const [seoKeywords, setSeoKeywords] = useState<string[]>(existingPost?.seoKeywords || []);

  const [tagInput, setTagInput] = useState('');
  const [seoKeywordInput, setSeoKeywordInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSeoSettings, setShowSeoSettings] = useState(false);

  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/blog/categories');
        const apiCats = res.data?.data || (Array.isArray(res.data) ? res.data : []);

        // Merge API categories with specified blog categories so all 8 are always available
        const merged = BLOG_CATEGORIES.map(name => {
          const found = apiCats.find((c: any) => c.name?.toLowerCase() === name.toLowerCase());
          return found || { id: name, name };
        });

        // Add any other existing categories from API not in default list if editing
        apiCats.forEach((c: any) => {
          if (!merged.some(m => m.name.toLowerCase() === c.name.toLowerCase())) {
            merged.push(c);
          }
        });

        setCategories(merged);
      } catch (err) {
        console.error('Failed to fetch categories', err);
        setCategories(BLOG_CATEGORIES.map(name => ({ id: name, name })));
      }
    };
    fetchCategories();
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generate slug from title if empty or unchanged from generated
    if (name === 'title' && !existingPost) {
      setFormData((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append('image', file);
    const res = await api.post('/uploads/image', data);
    return res.data?.data?.url || res.data?.url;
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadFile(file);
      setFormData(prev => ({ ...prev, featuredImage: url }));
    } catch (err) {
      console.error('Failed to upload image', err);
      alert('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadFile(files[i]);
        urls.push(url);
      }
      setFormData(prev => ({ ...prev, galleryImages: [...prev.galleryImages, ...urls] }));
    } catch (err) {
      console.error('Failed to upload gallery images', err);
      alert('Failed to upload gallery images.');
    } finally {
      setIsUploading(false);
    }
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      try {
        const url = await uploadFile(file);
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection();
          if (range) {
            quill.insertEmbed(range.index, 'image', url);
          }
        }
      } catch (err) {
        console.error('Editor image upload failed', err);
        alert('Failed to upload image.');
      }
    };
  }, []);

  const modules = React.useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), [imageHandler]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    else if (formData.content.length > 50000) newErrors.content = 'Content must not exceed 50,000 characters';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status: string) => {
    if (!validate()) return;

    try {
      setIsSaving(true);
      const payload = {
        ...formData,
        status,
        tags: tags.map(tag => ({ name: tag })), // Adjust based on your tag handling if needed
        seoKeywords
      };

      if (existingPost?.id) {
        await api.put(`/blog/${existingPost.id}`, payload);
      } else {
        await api.post('/blog', payload);
      }

      if (status === 'PUBLISHED') {
        alert('Your article has been published.');
      } else {
        alert('Your draft has been saved.');
      }

      onSuccess();
    } catch (err: any) {
      console.error('Failed to save blog', err);
      alert(err.response?.data?.message || 'Failed to save blog post.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: 'tag' | 'seoKeyword') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = type === 'tag' ? tagInput.trim() : seoKeywordInput.trim();
      if (!val) return;

      if (type === 'tag' && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput('');
      } else if (type === 'seoKeyword' && !seoKeywords.includes(val)) {
        setSeoKeywords([...seoKeywords, val]);
        setSeoKeywordInput('');
      }
    }
  };

  const removeArrayItem = (type: 'tag' | 'seoKeyword' | 'gallery', index: number) => {
    if (type === 'tag') {
      setTags(tags.filter((_: string, i: number) => i !== index));
    } else if (type === 'seoKeyword') {
      setSeoKeywords(seoKeywords.filter((_: string, i: number) => i !== index));
    } else if (type === 'gallery') {
      setFormData(prev => ({
        ...prev,
        galleryImages: prev.galleryImages.filter((_: string, i: number) => i !== index)
      }));
    }
  };

  return (
    <div className="blog-editor-overlay" onClick={onClose}>
      <div className="blog-editor-modal" onClick={e => e.stopPropagation()}>
        <div className="blog-editor-header">
          <h2 className="blog-editor-title">NEW BLOG ARTICLE</h2>
          <div className="blog-editor-title-divider" />
          <button className="blog-editor-close" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="blog-editor-content">
          <div className="editor-two-column">
            {/* Left Column */}
            <div>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTextChange}
                  className="form-input"
                  placeholder="Enter an engaging title for your blog..."
                  maxLength={150}
                />
                <div className="input-footer">
                  {errors.title && <span className="error-message">{errors.title}</span>}
                  <span>{formData.title.length}/150</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Excerpt *</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleTextChange}
                  className="form-textarea"
                  placeholder="Write a short excerpt (summary) for your article..."
                  maxLength={250}
                />
                <div className="input-footer">
                  {errors.excerpt && <span className="error-message">{errors.excerpt}</span>}
                  <span>{formData.excerpt.length}/250</span>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label">Tags</label>
                <div className="tags-container">
                  {tags.map((t, i) => (
                    <span key={i} className="tag-pill">
                      {t} <button type="button" onClick={() => removeArrayItem('tag', i)}><X size={12} /></button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => handleKeyDown(e, 'tag')}
                    className="tag-input"
                    placeholder="Add tags and press Enter..."
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="form-group">
                <label className="form-label">Slug *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleTextChange}
                    className="form-input"
                    placeholder="enter-slug-here"
                    style={{ paddingRight: '2.5rem', width: '100%' }}
                  />
                  <Edit3 size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
                <div className="slug-preview">URL: /blog/{formData.slug || 'enter-slug-here'}</div>
                {errors.slug && <span className="error-message">{errors.slug}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select name="categoryId" value={formData.categoryId} onChange={handleTextChange} className="form-select">
                  <option value="">Select a category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.categoryId && <span className="error-message">{errors.categoryId}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Featured Image</label>
                {formData.featuredImage ? (
                  <div className="image-preview" style={{ height: '180px' }}>
                    <img src={resolveImageUrl(formData.featuredImage)} alt="Featured" style={{ height: '100%', objectFit: 'cover' }} />
                    <div className="image-preview-overlay">
                      <label className="icon-btn">
                        <UploadCloud size={18} />
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFeaturedImageUpload} />
                      </label>
                      <button type="button" className="icon-btn danger" onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="upload-dropzone" style={{ height: '180px' }}>
                    <UploadCloud className="upload-icon" />
                    <div className="upload-text"><strong>Click to upload</strong> or drag and drop</div>
                    <div className="upload-subtext">JPG, PNG, WebP (Max 5MB)<br />Recommended: 1200 x 630px</div>
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFeaturedImageUpload} />
                  </label>
                )}
                {isUploading && <div className="slug-preview">Uploading...</div>}
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="editor-section">
            <h3 className="editor-section-title">Content *</h3>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={formData.content}
              onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
              modules={modules}
            />
            <div className="input-footer">
              {errors.content && <span className="error-message">{errors.content}</span>}
              <span>{formData.content.length}/50000</span>
            </div>
          </div>

          <div className="editor-two-column">
            {/* Gallery Images */}
            <div className="editor-section">
              <h3 className="editor-section-title">Gallery Images</h3>
              <label className="upload-dropzone">
                <ImageIcon className="upload-icon" />
                <div className="upload-text"><strong>Upload multiple images</strong></div>
                <div className="upload-subtext">or drag and drop files here<br />JPG, PNG, WebP (Max 5MB each)</div>
                <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleGalleryUpload} />
              </label>

              {formData.galleryImages.length > 0 && (
                <div className="gallery-grid">
                  {formData.galleryImages.map((url: string, i: number) => (
                    <div key={i} className="gallery-item">
                      <img src={resolveImageUrl(url)} alt={`Gallery ${i}`} />
                      <div className="image-preview-overlay">
                        <button type="button" className="icon-btn danger" onClick={() => removeArrayItem('gallery', i)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tips Panel */}
            <div className="editor-section" style={{ paddingTop: '2.5rem' }}>
              <div className="tips-panel">
                <div className="tips-title"><Edit3 size={18} /> Tips</div>
                <ul className="tips-list">
                  <li><CheckCircle2 size={16} className="check-icon" /> Use high-quality images for better engagement</li>
                  <li><CheckCircle2 size={16} className="check-icon" /> Add relevant tags to help readers find your article</li>
                  <li><CheckCircle2 size={16} className="check-icon" /> Write a compelling excerpt to increase clicks</li>
                  <li><CheckCircle2 size={16} className="check-icon" /> Optimize your content for readability</li>
                </ul>
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="editor-section">
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
              onClick={() => setShowSeoSettings(!showSeoSettings)}
            >
              <h3 className="editor-section-title" style={{ marginBottom: 0, border: 'none' }}>SEO Settings</h3>
              <ChevronDown size={18} style={{ transform: showSeoSettings ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {showSeoSettings && (
              <div className="editor-two-column" style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">SEO Title</label>
                  <input
                    type="text"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleTextChange}
                    className="form-input"
                    placeholder="Enter SEO Title"
                    maxLength={60}
                  />
                  <div className="input-footer"><span>{formData.seoTitle.length}/60</span></div>
                </div>

                <div className="form-group">
                  <label className="form-label">SEO Keywords</label>
                  <div className="tags-container">
                    {seoKeywords.map((k, i) => (
                      <span key={i} className="tag-pill">
                        {k} <button type="button" onClick={() => removeArrayItem('seoKeyword', i)}><X size={12} /></button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={seoKeywordInput}
                      onChange={e => setSeoKeywordInput(e.target.value)}
                      onKeyDown={e => handleKeyDown(e, 'seoKeyword')}
                      className="tag-input"
                      placeholder="Add keywords..."
                    />
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">SEO Description</label>
                  <textarea
                    name="seoDescription"
                    value={formData.seoDescription}
                    onChange={handleTextChange}
                    className="form-textarea"
                    placeholder="Enter SEO Description"
                    maxLength={160}
                  />
                  <div className="input-footer"><span>{formData.seoDescription.length}/160</span></div>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Canonical URL</label>
                  <input
                    type="text"
                    name="canonicalUrl"
                    value={formData.canonicalUrl}
                    onChange={handleTextChange}
                    className="form-input"
                    placeholder="https://example.com/canonical-url"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="blog-editor-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={isSaving}>Cancel</button>
          <button type="button" className="btn btn-outline" onClick={() => handleSubmit('DRAFT')} disabled={isSaving}>
            Save Draft
          </button>
          <button type="button" className="btn btn-primary" onClick={() => handleSubmit('PUBLISHED')} disabled={isSaving}>
            Publish Article
          </button>
        </div>
      </div>
    </div>
  );
}
