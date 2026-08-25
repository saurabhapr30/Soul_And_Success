import { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatINR } from '../../utils/helpers';
import { ProductFormModal } from '../../components/admin/ProductFormModal';
import '../../components/admin/ProductFormModal.css';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';
import { OrderListModal } from '../../components/admin/OrderListModal';
const toast = { error: (msg: string) => alert(msg), success: (msg: string) => alert(msg) };
import { Edit2, Trash2 } from 'lucide-react';

const badgeStyle = (active: boolean): React.CSSProperties => ({
  background: active ? 'rgba(76,175,80,0.15)' : 'rgba(229,115,115,0.15)',
  color: active ? '#4CAF50' : '#E57373',
  borderRadius: 100,
  padding: '0.2rem 0.75rem',
  fontSize: '0.7rem',
  fontFamily: 'var(--font-body)',
  fontWeight: 700,
  letterSpacing: '0.08em',
  whiteSpace: 'nowrap' as const,
  display: 'inline-block',
});

export function AdminMerchandisePage() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterCategoryId, setFilterCategoryId] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT'>('ADD');
  const [editingItem, setEditingItem] = useState<any>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const [orderProduct, setOrderProduct] = useState<any>(null);

  // Dashboard metrics
  const totalProducts = items.length;
  const [totalOrders, setTotalOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      setItems(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Failed to fetch items', err);
      toast.error('Failed to load merchandise');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data?.data || res.data || []);
    } catch {}
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
    api.get('/orders').then(res => {
      const orders: any[] = res.data?.data || [];
      const paidOrders = orders.filter((o: any) => ['PAID', 'DELIVERED', 'CONFIRMED'].includes(o.paymentStatus));
      setTotalOrders(paidOrders.length);
      setRevenue(paidOrders.reduce((acc: number, o: any) => acc + Number(o.total || 0), 0));
    }).catch(() => {});
  }, []);

  const handleAdd = () => { setModalMode('ADD'); setEditingItem(null); setIsModalOpen(true); };

  const handleEdit = (item: any) => {
    setModalMode('EDIT');
    const images = Array.isArray(item.images) && item.images.length > 0
      ? item.images.map((img: any) => typeof img === 'string' ? img : img.url)
      : (item.image ? [item.image] : []);
    setEditingItem({ ...item, images, image: images[0] || item.image || '' });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: any) => { setItemToDelete(item); setIsDeleteOpen(true); };

  const handleSave = async (data: any) => {
    if (modalMode === 'ADD') {
      await api.post('/products', data);
      toast.success('Product created successfully');
    } else {
      await api.patch(`/products/${editingItem.id}`, data);
      toast.success('Product updated successfully');
    }
    fetchItems();
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await api.delete(`/products/${itemToDelete.id}`);
      toast.success('Product deleted successfully');
      fetchItems();
    }
  };

  const filteredItems = items.filter(item => {
    const matchSearch = !search ||
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.sku?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' ||
      (filterStatus === 'ACTIVE' && item.isActive) ||
      (filterStatus === 'STOPPED' && !item.isActive);
    const matchCategory = filterCategoryId === 'ALL' ||
      item.categoryId === filterCategoryId ||
      item.category === filterCategoryId;
    return matchSearch && matchStatus && matchCategory;
  });

  const metrics = [
    { label: 'TOTAL ORDERS', value: totalOrders.toString(), icon: '📦' },
    { label: 'REVENUE', value: formatINR(revenue), icon: '💰' },
    { label: 'PRODUCTS', value: totalProducts.toString(), icon: '🛍️' },
  ];

  const thStyle: React.CSSProperties = {
    textAlign: 'left', padding: '0.75rem', fontFamily: 'var(--font-body)',
    fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display-secondary)', fontWeight: 700, fontSize: '2rem', color: '#fff', margin: '0 0 0.25rem' }}>
            Merchandise
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: 0 }}>Manage your products and merchandise.</p>
        </div>
        <button onClick={handleAdd} style={{ background: 'linear-gradient(135deg, #E27D60, #D4A96A)', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          + Add New
        </button>
      </div>

      {/* Dashboard Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        {metrics.map(m => (
          <div key={m.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.25rem 1.5rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{m.icon}</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '0 0 0.35rem' }}>{m.label}</p>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1.6rem', color: '#fff', margin: 0, lineHeight: 1 }}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: '1 1 200px', minWidth: 160, padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontFamily: 'var(--font-body)', fontSize: '0.85rem', outline: 'none' }}
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)', fontSize: '0.82rem', outline: 'none' }}
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="STOPPED">Stopped</option>
        </select>
        <select
          value={filterCategoryId}
          onChange={e => setFilterCategoryId(e.target.value)}
          style={{ padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)', fontSize: '0.82rem', outline: 'none' }}
        >
          <option value="ALL">All Categories</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.75rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr>
                {['Product', 'Price', 'Stock', 'Status', 'Category', 'Featured', 'Orders', 'Actions'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading merchandise...</td></tr>
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>No products found</td></tr>
              ) : (
                filteredItems.map((item: any) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '1rem 0.75rem', color: 'rgba(255,255,255,0.85)' }}>
                      <strong>{item.name}</strong>
                      <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.35)' }}>{item.sku}</div>
                    </td>
                    <td style={{ padding: '1rem 0.75rem', color: '#fff', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {formatINR(item.price || 0)}
                    </td>
                    <td style={{ padding: '1rem 0.75rem', color: 'rgba(255,255,255,0.7)' }}>{item.stock}</td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <span style={badgeStyle(item.isActive)}>
                        {item.isActive ? 'ACTIVE' : 'STOPPED'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.75rem', color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem' }}>
                      {typeof item.category === 'string' ? item.category : (item.category?.name || '—')}
                    </td>
                    <td style={{ padding: '1rem 0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                      {item.isFeatured ? 'Yes' : 'No'}
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <button
                        onClick={() => setOrderProduct(item)}
                        style={{ background: 'rgba(226,125,96,0.12)', border: '1px solid rgba(226,125,96,0.3)', color: '#E27D60', borderRadius: 100, padding: '0.2rem 0.7rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' }}
                      >
                        {item._count?.orderItems ?? 'View'}
                      </button>
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEdit(item)} style={{ background: 'transparent', border: 'none', color: '#60a5fa', cursor: 'pointer', padding: 4 }}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteClick(item)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: 4 }}>
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

      <ProductFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        type="merchandise"
        initialData={editingItem}
        categories={categories}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        itemName={itemToDelete?.name || 'Unknown Item'}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
      />

      {orderProduct && (
        <OrderListModal
          entityId={orderProduct.id}
          entityTitle={orderProduct.name}
          entityType="product"
          onClose={() => setOrderProduct(null)}
        />
      )}
    </div>
  );
}
