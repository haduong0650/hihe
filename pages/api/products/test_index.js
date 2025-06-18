/ pages/api/products/index.js
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  const { method } = req;

  const { user } = await supabase.auth.getUser(req.headers.authorization);
  if (!user && method === 'POST') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    switch (method) {
      case 'GET':
        const { data: products, error: getError } = await supabase.from('products').select('*');
        if (getError) throw getError;
        res.status(200).json(products);
        break;

      case 'POST':
        const { name, description, price, image } = req.body;
        const { data, error: postError } = await supabase
          .from('products')
          .insert([{ name, description, price, image }])
          .select();
        if (postError) throw postError;
        res.status(201).json(data[0]);
        break;

      default:
        res.status(405).json({ error: 'Method ${method} Not Allowed' });
        break;
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}