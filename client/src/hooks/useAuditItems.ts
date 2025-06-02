import { useState, useEffect } from 'react';

interface AuditItem {
  id: number;
  category_id: number;
  item_text: string;
  points: number;
  is_mandatory: number;
  category_name: string;
}

interface AuditCategory {
  id: number;
  name: string;
  description: string | null;
  weight: number;
}

export function useAuditItems() {
  const [auditItems, setAuditItems] = useState<AuditItem[]>([]);
  const [categories, setCategories] = useState<AuditCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Fetching audit items and categories...');
        
        const [itemsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/audit-items'),
          fetch('/api/audit-categories')
        ]);

        const items = await itemsResponse.json();
        const categoriesData = await categoriesResponse.json();

        console.log('Audit items received:', items.length);
        console.log('Categories received:', categoriesData.length);

        setAuditItems(items);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching audit data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { auditItems, categories, loading };
}
