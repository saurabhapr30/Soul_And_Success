import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/layouts';
import { HomePage } from '@/pages';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminCoursesPage } from '@/pages/admin/AdminCoursesPage';
import { AdminBooksPage } from '@/pages/admin/AdminBooksPage';
import { AdminMerchandisePage } from '@/pages/admin/AdminMerchandisePage';
import { AdminTestimonialsPage } from '@/pages/admin/AdminTestimonialsPage';
import { AdminCouponsPage } from '@/pages/admin/AdminCouponsPage';
import { AdminContactPage } from '@/pages/admin/AdminContactPage';
import { AdminNewsletterPage } from '@/pages/admin/AdminNewsletterPage';
import { AdminBlogsPage } from '@/pages/admin/AdminBlogsPage';

/* ================================================== */
/* ROUTER CONFIGURATION                                 */
/* ================================================== */
/* All routes use the RootLayout (Navbar + Footer).     */
/* Non-home pages are lazy-loaded for code-splitting.   */
/* ================================================== */

/* --- Lazy-loaded Pages --- */
const AboutPage = lazy(() => import('@/pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ServicesPage = lazy(() => import('@/pages/ServicesPage').then((m) => ({ default: m.ServicesPage })));
const ServiceDetailPage = lazy(() => import('@/pages/ServiceDetailPage').then((m) => ({ default: m.ServiceDetailPage })));
const CoursesPage = lazy(() => import('@/pages/CoursesPage').then((m) => ({ default: m.CoursesPage })));
const BooksPage = lazy(() => import('@/pages/BooksPage').then((m) => ({ default: m.BooksPage })));
const ShopPage = lazy(() => import('@/pages/ShopPage').then((m) => ({ default: m.ShopPage })));
const ProductDetailsPage = lazy(() => import('@/pages/ProductDetailsPage').then((m) => ({ default: m.ProductDetailsPage })));
const CartPage = lazy(() => import('@/pages/CartPage').then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const OrderConfirmationPage = lazy(() => import('@/pages/OrderConfirmationPage').then((m) => ({ default: m.OrderConfirmationPage })));
const BlogPage = lazy(() => import('@/pages/BlogPage').then((m) => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage').then((m) => ({ default: m.BlogPostPage })));
const ContactPage = lazy(() => import('@/pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const VerifyEmailPage = lazy(() => import('@/pages/VerifyEmailPage').then((m) => ({ default: m.VerifyEmailPage })));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));
const BookSessionPage = lazy(() => import('@/pages/BookSessionPage').then((m) => ({ default: m.BookSessionPage })));

/* --- Suspense Wrapper --- */
function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="section" style={{ paddingTop: 'calc(var(--space-14) + var(--space-12))' }}>
          <div className="container flex-center" style={{ minHeight: '40vh' }}>
            <span className="text-body text-muted">Loading…</span>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <SuspenseWrapper><AboutPage /></SuspenseWrapper> },
      { path: 'services', element: <SuspenseWrapper><ServicesPage /></SuspenseWrapper> },
      { path: 'services/:slug', element: <SuspenseWrapper><ServiceDetailPage /></SuspenseWrapper> },
      { path: 'courses', element: <SuspenseWrapper><CoursesPage /></SuspenseWrapper> },
      { path: 'courses/:slug', element: <SuspenseWrapper><ProductDetailsPage type="course" /></SuspenseWrapper> },
      { path: 'books', element: <SuspenseWrapper><BooksPage /></SuspenseWrapper> },
      { path: 'books/:slug', element: <SuspenseWrapper><ProductDetailsPage type="book" /></SuspenseWrapper> },
      { path: 'shop', element: <SuspenseWrapper><ShopPage /></SuspenseWrapper> },
      { path: 'merchandise/:slug', element: <SuspenseWrapper><ProductDetailsPage type="merchandise" /></SuspenseWrapper> },
      { path: 'shop/cart', element: <SuspenseWrapper><CartPage /></SuspenseWrapper> },
      { path: 'shop/checkout', element: <SuspenseWrapper><CheckoutPage /></SuspenseWrapper> },
      { path: 'shop/order-confirmation', element: <SuspenseWrapper><OrderConfirmationPage /></SuspenseWrapper> },
      { path: 'blog', element: <SuspenseWrapper><BlogPage /></SuspenseWrapper> },
      { path: 'blog/:slug', element: <SuspenseWrapper><BlogPostPage /></SuspenseWrapper> },
      { path: 'contact', element: <SuspenseWrapper><ContactPage /></SuspenseWrapper> },
      { path: 'verify-email', element: <SuspenseWrapper><VerifyEmailPage /></SuspenseWrapper> },
      { path: 'forgot-password', element: <SuspenseWrapper><ForgotPasswordPage /></SuspenseWrapper> },
      { path: 'reset-password', element: <SuspenseWrapper><ResetPasswordPage /></SuspenseWrapper> },
      { path: 'book-session', element: <SuspenseWrapper><BookSessionPage /></SuspenseWrapper> },
      { path: '*', element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper> },
    ],
  },
  {
    path: '/login',
    element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'orders', element: <AdminOrdersPage /> },
      { path: 'courses', element: <AdminCoursesPage /> },
      { path: 'books', element: <AdminBooksPage /> },
      { path: 'merchandise', element: <AdminMerchandisePage /> },
      { path: 'testimonials', element: <AdminTestimonialsPage /> },
      { path: 'blogs', element: <AdminBlogsPage /> },
      { path: 'coupons', element: <AdminCouponsPage /> },
      { path: 'contact', element: <AdminContactPage /> },
      { path: 'newsletter', element: <AdminNewsletterPage /> },
    ],
  }
]);
