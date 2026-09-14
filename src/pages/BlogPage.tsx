import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/ui';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { blogService } from '@/services/blogService';
import heroPortrait from '@/assets/standing.webp';
import logoImg from '@/assets/logo.webp';
import leafSvg from '@/assets/leaf.svg';
import blogDefaultImg from '@/assets/Blogs.webp';
import './BlogPage.css';

/* ================================================== */
/* BLOG PAGE                                          */
/* ================================================== */

export function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        const [postsRes, categoriesRes] = await Promise.all([
           blogService.getPosts({ status: 'PUBLISHED' }),
           blogService.getCategories()
        ]);
        const allPosts = postsRes.data || postsRes || [];
        const publishedPosts = Array.isArray(allPosts) ? allPosts.filter((p: any) => !p.status || p.status === 'PUBLISHED') : [];
        setPosts(publishedPosts);
        
        if (categoriesRes.data && categoriesRes.data.length > 0) {
            setCategories(categoriesRes.data.map((c: any) => c.name));
        } else {
            setCategories([
              'Relationships',
              'The Inner Work',
              'Attraction',
              'Communication',
              'Dating',
              'Feminine Energy',
              'Intimacy',
              'Masculine Energy',
            ]);
        }
      } catch(err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogData();
  }, []);

  // Filter posts based on category and search
  const filteredPosts = posts.filter(post => {
    const isPublished = !post.status || post.status === 'PUBLISHED';
    if (!isPublished) return false;
    const matchesCategory = activeCategory === 'All' || post.category?.name === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <SEOHead
        title="Blog | SandS"
        description="Read our latest articles on wellness, mindfulness, personal growth, and purposeful living."
      />
      <main className="blog-page">
        {/* 1. HERO SECTION */}
        <section className="blog-page__hero">
          <div className="blog-page__hero-content">
            <div className="blog-page__hero-text">
              <h1 className="blog-page__hero-title">
                Welcome To <span className="blog-page__hero-title-script">My Blogs</span>
              </h1>
              <p className="blog-page__hero-subtitle">
                &rarr; Empowering people to heal deeply, grow confidently, and live with purpose.
              </p>
            </div>
            <OptimizedImage src={heroPortrait} alt="Author" className="blog-page__hero-image" priority={true} decoding="async" />
          </div>
        </section>

        {/* 2. CATEGORY NAVIGATION & SEARCH */}
        <div className="blog-page__categories-bar">
          <div className="blog-page__categories-container">
            <ul className="blog-page__categories-list">
              <li>
                <button 
                  className={`blog-page__category-btn ${activeCategory === 'All' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('All')}
                >
                  All
                </button>
              </li>
              {categories.map(category => (
                <li key={category}>
                  <button 
                    className={`blog-page__category-btn ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
            <div className="blog-page__search-form">
              <input 
                type="text" 
                className="blog-page__search-input" 
                placeholder="SEARCH" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 3. FEATURED POST (Only show when 'All' is selected and no search) */}
        {activeCategory === 'All' && !searchQuery && (
          <section className="blog-page__featured">
            <div className="blog-page__featured-card">
              <h2 className="blog-page__featured-title">Unveiling Some Life's Secrets Which You Must Know</h2>
              <p className="blog-page__featured-excerpt">
                Get Clarity on Life and Create the Results You want To Achieve In Major Areas Of Life Like Relationships, Wealth, Career and Health
              </p>
              <Link to={`/blog/unveiling-some-lifes-secrets`} className="blog-page__featured-btn">
                READ MORE
              </Link>
            </div>
          </section>
        )}

        {/* 4. BLOG GRID */}
        <section className="blog-page__grid-section">
          <div className="blog-page__grid-container">
            {loading ? (
               <div style={{ textAlign: 'center', padding: '100px 0' }}>Loading blogs...</div>
            ) : (
              <div className="blog-page__grid">
                {filteredPosts.map(post => (
                  <article key={post.id} className="blog-page__card">
                    <Link to={`/blog/${post.slug}`} className="blog-page__card-image-link">
                      <OptimizedImage
                        src={post.featuredImage}
                        fallback={blogDefaultImg}
                        alt={post.title}
                        className="blog-page__card-image"
                        loading="lazy"
                      />
                    </Link>
                    <div className="blog-page__card-content">
                      <h3 className="blog-page__card-title">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <div className="blog-page__card-divider"></div>
                      <span className="blog-page__card-meta">
                        BY JAWEDAN SEHAR • {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() : 'JAN 12, 2026'}
                      </span>
                      <p className="blog-page__card-excerpt">{post.excerpt}</p>
                      <Link to={`/blog/${post.slug}`} className="blog-page__card-readmore">READ MORE</Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 5. CTA SECTION */}
        <section className="blog-cta-section" data-node-id="546:383">
          <div className="blog-cta">
            <img src={logoImg} alt="Soul & Success Logo" className="blog-cta-logo" />
            
            <div className="blog-cta-content">
              <h3>
                <span>YOUR JOURNEY TOWARDS PEACE,</span>
                <span>CLARITY AND SUCCESS BEGINS TODAY.</span>
              </h3>
              <p>LET'S TAKE THE FIRST STEP TOGETHER.</p>
            </div>

            <div className="blog-cta-action">
              <Link to="/courses" className="blog-cta-btn">
                <span>CHOOSE YOUR PROGRAM</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M3.33337 8H12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 3.33334L12.6667 8.00001L8 12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <p className="blog-cta-action-text">Begin your transformation today.</p>
            </div>
            
            <img src={leafSvg} alt="" className="blog-cta-leaf" aria-hidden="true" />
          </div>
        </section>

      </main>
    </>
  );
}
