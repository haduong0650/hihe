// pages/products/[id].js
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '../../lib/SupabaseAuthContext';
import Link from 'next/link';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSupabaseAuth();

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch product');
        setProduct(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete product');
      router.push('/');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="product-detail">
      <Head>
        <title>{product.name}</title>
        <meta name="description" content={product.description} />
      </Head>

      <h1 className="product-title">{product.name}</h1>
      <img src={product.image || '/placeholder.png'} alt={product.name} className="product-image" />
      <p className="product-price">${product.price.toFixed(2)}</p>
      <p className="product-description">{product.description}</p>
      {user && (
        <div className="product-actions">
          <Link href={`/products/edit/${id}`} className="button edit-button">
            Edit
          </Link>
          <button onClick={handleDelete} className="button delete-button">
            Delete
          </button>
        </div>
      )}

      <style jsx>{`
        .product-detail {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        .product-title {
          font-size: 2rem;
          color: #333;
          margin-bottom: 1rem;
        }
        .product-image {
          width: 100%;
          height: 400px;
          object-fit: contain;
          margin-bottom: 1rem;
        }
        .product-price {
          font-size: 1.5rem;
          color: #27ae60;
          font-weight: bold;
          margin-bottom: 1rem;
        }
        .product-description {
          font-size: 1.1rem;
          color: #555;
          margin-bottom: 2rem;
        }
        .product-actions {
          display: flex;
          gap: 1rem;
        }
        .button {
          padding: 0.6rem 1.2rem;
          border-radius: 5px;
          text-decoration: none;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s ease;
          border: none;
        }
        .edit-button {
          background-color: #3498db;
          color: white;
        }
        .edit-button:hover {
          background-color: #2980b9;
        }
        .delete-button {
          background-color: #e74c3c;
          color: white;
        }
        .delete-button:hover {
          background-color: #c0392b;
        }
        .error-message {
          color: red;
          text-align: center;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}