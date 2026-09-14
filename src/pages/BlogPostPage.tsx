import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEOHead } from '@/components/ui';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { blogService } from '@/services/blogService';
import DOMPurify from 'dompurify';
import './BlogPage.css';

/* ================================================== */
/* BLOG POST PAGE                                     */
/* ================================================== */

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await blogService.getPostBySlug(slug);
        setPost(res.data);
      } catch (err) {
        console.error('Failed to fetch post', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <section className="section" style={{ paddingTop: 'calc(var(--space-14) + var(--space-12))' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="text-body-lg">Loading article...</p>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="section" style={{ paddingTop: 'calc(var(--space-14) + var(--space-12))' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 className="text-display-xl">Article Not Found</h1>
          <p className="text-body-lg" style={{ marginTop: 'var(--space-4)' }}>
            We couldn't find the article you were looking for.
          </p>
          <Link to="/blog" className="btn btn-outline" style={{ marginTop: 'var(--space-8)' }}>
            Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  const sanitizedContent = DOMPurify.sanitize(post.content);

  return (
    <>
      <SEOHead
        title={post.seoTitle || post.title || 'Blog Post'}
        description={post.seoDescription || post.excerpt || ''}
      />
      <section className="section" style={{ paddingTop: 'calc(var(--space-14) + var(--space-6))', paddingBottom: 'var(--space-12)' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', textDecoration: 'none', marginBottom: 'var(--space-8)', fontWeight: 600 }}>
            ← Back to Articles
          </Link>

          <header style={{ marginBottom: 'var(--space-10)' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: 'var(--space-4)' }}>
              {post.category && (
                <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', color: 'var(--color-accent)' }}>
                  {post.category.name}
                </span>
              )}
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h1 className="text-display-lg" style={{ marginBottom: 'var(--space-4)', lineHeight: 1.2 }}>{post.title}</h1>
            
            {post.excerpt && (
              <p className="text-body-lg" style={{ color: 'var(--color-text-secondary)', fontSize: '1.25rem', lineHeight: 1.6 }}>
                {post.excerpt}
              </p>
            )}
          </header>

          {post.featuredImage && (
            <div style={{ marginBottom: 'var(--space-10)', borderRadius: '12px', overflow: 'hidden' }}>
              <OptimizedImage src={post.featuredImage} alt={post.title} priority={true} decoding="async" style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover' }} />
            </div>
          )}

          <div 
            className="blog-content-html" 
            style={{ 
              lineHeight: 1.8, 
              fontSize: '1.1rem', 
              color: 'var(--color-text-primary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }} 
            dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
          />

          {post.galleryImages && post.galleryImages.length > 0 && (
            <div style={{ marginTop: 'var(--space-12)' }}>
              <h3 className="text-display-sm" style={{ marginBottom: 'var(--space-6)' }}>Gallery</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {post.galleryImages.map((img: string, i: number) => (
                  <div key={i} style={{ borderRadius: '8px', overflow: 'hidden', aspectRatio: '1' }}>
                    <OptimizedImage src={img} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div style={{ marginTop: 'var(--space-10)', paddingTop: 'var(--space-8)', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {post.tags.map((tag: any) => (
                  <span key={tag.id} style={{ background: 'rgba(44, 24, 16, 0.05)', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    </>
  );
}
