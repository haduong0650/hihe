// pages/api/products/[id].js
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  const { user } = await supabase.auth.getUser(req.headers.authorization);
  if (!user && (method === 'PUT' || method === 'DELETE')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  switch (method) {
    case 'GET':
      try {
        const { data, error } = await supabase.from('products').select('*').eq('id', id);
        if (error) throw error;
        if (!data || data.length === 0) {
          return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: data[0] });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case 'PUT':
      try {
        const { ...updates } = req.body;
        const { data, error } = await supabase
          .from('products')
          .update(updates)
          .eq('id', id)
          .select();
        if (error) throw error;
        if (!data || data.length === 0) {
          return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: data[0] });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case 'DELETE':
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message || 'Product not found' });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method ${method} Not Allowed'});
      break;
  }
}