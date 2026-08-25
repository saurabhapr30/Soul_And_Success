import { useEffect, useState } from 'react';
import { promotionService } from '@/services/promotionService';

export function PromoBanner() {
  const [promotions, setPromotions] = useState<any[]>([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await promotionService.getActivePromotions();
        setPromotions(res.data || []);
      } catch (err) {
        console.error('Failed to fetch promotions', err);
      }
    };
    fetchPromotions();
  }, []);

  if (promotions.length === 0) return null;

  const promo = promotions[0]; // Display the first active promotion

  return (
    <div style={{ backgroundColor: '#BC957B', color: 'white', textAlign: 'center', padding: '10px', fontSize: '14px', zIndex: 1000, position: 'relative' }}>
      <strong>{promo.title}</strong>
      {promo.subtitle && <span style={{ marginLeft: '10px' }}>{promo.subtitle}</span>}
      {promo.buttonUrl && (
        <a href={promo.buttonUrl} style={{ color: 'white', textDecoration: 'underline', marginLeft: '15px', fontWeight: 'bold' }}>
          {promo.buttonText || 'Learn More'}
        </a>
      )}
    </div>
  );
}
