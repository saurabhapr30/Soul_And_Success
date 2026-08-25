import { useEffect, useState } from 'react';
import { testimonialService } from '../../services/testimonialService';
import { resolveImageUrl } from '../../utils';
import { AdminCrudModal } from '../../components/admin/AdminCrudModal';
import type { FieldDef } from '../../components/admin/AdminCrudModal';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';
const toast = { error: (msg: string) => alert(msg), success: (msg: string) => alert(msg) };
import { Edit2, Trash2, Star } from 'lucide-react';

export function AdminTestimonialsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT'>('ADD');
  const [editingItem, setEditingItem] = useState<any>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await testimonialService.getTestimonials();
      setItems(data?.data || data || []);
    } catch (err) {
      console.error('Failed to fetch items', err);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = () => {
    setModalMode('ADD');
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setModalMode('EDIT');
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setIsDeleteOpen(true);
  };

  const handleSave = async (data: any) => {
    if (modalMode === 'ADD') {
      await testimonialService.createTestimonial(data);
      toast.success('Testimonial created successfully');
    } else {
      await testimonialService.updateTestimonial(editingItem.id, data);
      toast.success('Testimonial updated successfully');
    }
    fetchItems();
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await testimonialService.deleteTestimonial(itemToDelete.id);
      toast.success('Testimonial deleted successfully');
      fetchItems();
    }
  };

  const fields: FieldDef[] = [
    { name: 'name', label: 'Customer Name', type: 'text', required: true },
    { name: 'quote', label: 'Review / Quote', type: 'textarea', required: true },
    { name: 'rating', label: 'Rating (1-5)', type: 'number', required: true, min: 1, max: 5 },
    { name: 'avatar', label: 'Avatar URL', type: 'text' },
    { name: 'isApproved', label: 'Approved / Published', type: 'checkbox' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display-secondary)", fontWeight: 700, fontSize: '2rem', color: '#fff', margin: '0 0 0.5rem' }}>
            Testimonials
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', margin: 0 }}>
            Manage customer reviews and testimonials.
          </p>
        </div>
        <button 
          onClick={handleAdd}
          style={{ background: 'linear-gradient(135deg, #E27D60, #D4A96A)', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-body)" }}>
          + Add New
        </button>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.75rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr>
                {['Avatar', 'Name', 'Rating', 'Quote Preview', 'Approved', 'Actions'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem', fontFamily: "var(--font-body)", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                    Loading testimonials...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
                    No testimonials found
                  </td>
                </tr>
              ) : (
                items.map((item: any) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      {item.avatar ? (
                         <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: '#000' }}>
                           <img src={resolveImageUrl(item.avatar)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                         </div>
                      ) : (
                         <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                           {item.name?.charAt(0)}
                         </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem 0.75rem', color: 'rgba(255,255,255,0.8)' }}>
                      <strong>{item.name}</strong>
                    </td>
                    <td style={{ padding: '1rem 0.75rem', color: '#E27D60', display: 'flex', alignItems: 'center', gap: '2px', height: '4rem' }}>
                      {item.rating} <Star size={14} fill="currentColor" />
                    </td>
                    <td style={{ padding: '1rem 0.75rem', color: 'rgba(255,255,255,0.6)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      "{item.quote}"
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      {item.isApproved ? (
                        <span style={{ color: '#4ade80', fontSize: '0.75rem' }}>Yes</span>
                      ) : (
                        <span style={{ color: '#f87171', fontSize: '0.75rem' }}>No</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEdit(item)} style={{ background: 'transparent', border: 'none', color: '#60a5fa', cursor: 'pointer', padding: '4px' }}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteClick(item)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminCrudModal
        isOpen={isModalOpen}
        mode={modalMode}
        title="Testimonial"
        fields={fields}
        initialData={editingItem}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        itemName={itemToDelete?.name ? `Testimonial by ${itemToDelete.name}` : 'Unknown Item'}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
