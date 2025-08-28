import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface OrderSpec {
  column: string;
  ascending?: boolean;
}

export function useSupabaseQuery<T = any>(
  table: string,
  select: string = '*',
  orders: OrderSpec[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!supabase) {
      setError(new Error('Supabase not configured'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase.from(table).select(select);
      for (const ord of orders) {
        query = query.order(ord.column, { ascending: ord.ascending ?? false });
      }
      const { data, error } = await query;
      if (error) throw error;
      setData((data as T[]) || []);
    } catch (e) {
      setError(e as Error);
      console.error(`Error fetching ${table}:`, e);
    } finally {
      setLoading(false);
    }
  }, [table, select, JSON.stringify(orders)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData } as const;
}


