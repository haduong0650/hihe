// pages/api/products/index.js
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  const { method } = req;

  const { user } = await supabase.auth.getUser(req.headers.authorization);
  if (!user && method === 'POST') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  switch (method) {
    case 'GET':
      try {
        const { data: products, error } = await supabase.from('products').select('*');
        if (error) throw error;
        res.status(200).json({ success: true, data: products });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message || 'Error fetching products' });
      }
      break;

    case 'POST':
      try {
        const { name, description, price, image } = req.body;
        const { data, error } = await supabase
          .from('products')
          .insert([{ name, description, price, image }])
          .select();
        if (error) throw error;
        res.status(201).json({ success: true, data: data[0] });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message || 'Error creating product' });
      }
      break;

    case 'PUT':
      try {
        const { id, ...updates } = req.body;
        const { data, error } = await supabase
          .from('products')
          .update(updates)
          .eq('id', id)
          .select();
        if (error) throw error;
        res.status(200).json({ success: true, data: data[0] });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message || 'Error updating product' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.body;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        res.status(200).json({ success: true, message: 'Product deleted' });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message || 'Error deleting product' });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method ${method} Not Allowed' });
      break;
  }
}