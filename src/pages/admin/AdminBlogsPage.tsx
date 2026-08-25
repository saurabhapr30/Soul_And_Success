import { useEffect, useState } from 'react';
import api from '../../services/api';
import { resolveImageUrl } from '../../utils';
import { BlogEditorModal } from '../../components/admin/BlogEditorModal';

export function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/blog');
      setBlogs(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch blogs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await api.delete(`/blog/${id}`);
      await fetchBlogs();
    } catch (err) {
      console.error('Failed to delete blog', err);
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setShowModal(true);
  };

  const openNewModal = () => {
    setEditingPost(null);
    setShowModal(true);
  };

  const handleSuccess = () => {
    setShowModal(false);
    setEditingPost(null);
    fetchBlogs();
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display-secondary)", fontWeight: 700, fontSize: '2rem', color: '#fff', margin: '0 0 0.5rem' }}>
            Blogs & Articles
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', margin: 0 }}>
            Create, edit, and publish blog articles and resources.
          </p>
        </div>
        <button
          onClick={openNewModal}
          style={{
            background: 'linear-gradient(135deg, #E27D60, #D4A96A)',
            color: '#fff',
            border: 'none',
            borderRadius: '100px',
            padding: '0.75rem 1.75rem',
            fontFamily: "var(--font-body)",
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(226,125,96,0.3)',
          }}
        >
          + New Article
        </button>
      </div>

      {/* Blogs Table */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.75rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr>
                {['Article Title', 'Slug', 'Status', 'Published Date', 'Actions'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem', fontFamily: "var(--font-body)", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                    Loading articles...
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
                    No blog posts published
                  </td>
                </tr>
              ) : (
                blogs.map((post) => (
                  <tr key={post.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '1rem 0.75rem', color: '#fff', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {post.featuredImage && (
                          <img src={resolveImageUrl(post.featuredImage)} alt={post.title} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                        )}
                        {post.title}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0.75rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{post.slug}</td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <span style={{ background: post.status === 'PUBLISHED' ? 'rgba(76,175,80,0.15)' : 'rgba(255,183,77,0.15)', color: post.status === 'PUBLISHED' ? '#4CAF50' : '#FFB74D', padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700, fontFamily: "var(--font-body)" }}>
                        {post.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEdit(post)}
                          style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          style={{ background: 'rgba(229,115,115,0.15)', color: '#E57373', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          Delete
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

      {showModal && (
        <BlogEditorModal 
          onClose={() => {
            setShowModal(false);
            setEditingPost(null);
          }} 
          onSuccess={handleSuccess} 
          existingPost={editingPost}
        />
      )}
    </div>
  );
}
