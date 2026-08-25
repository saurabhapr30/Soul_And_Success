import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { CartProvider } from '@/context/CartContext';

/* ================================================== */
/* APP — Root Component                                 */
/* ================================================== */

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}
