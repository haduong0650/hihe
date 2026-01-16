// pages/products/edit/[id].js
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '../../../lib/SupabaseAuthContext';
import { CldUploadWidget } from 'next-cloudinary';

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useSupabaseAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch product');
        const product = data.data;
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price.toString());
        setImage(product.image || '');
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProduct();
  }, [id]);

  if (!user) {
    return <p>You must be logged in to edit a product.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price: parseFloat(price), image }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update product');
      router.push(`/products/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <Head>
        <title>Edit {name}</title>
      </Head>
      <h1 className="form-title">Edit Product</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Image</label>
          <CldUploadWidget
            uploadPreset="your_upload_preset"
            onUpload={(result) => setImage(result.info.secure_url)}
          >
            {({ open }) => (
              <button type="button" onClick={open} className="upload-button">
                Upload Image
              </button>
            )}
          </CldUploadWidget>
          {image && <img src={image} alt="Preview" className="image-preview" />}
        </div>
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
      <style jsx>{`
        .form-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
        }
        .form-title {
          font-size: 2rem;
          color: #333;
          margin-bottom: 2rem;
        }
        .product-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-input {
          padding: 0.8rem;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 1rem;
        }
        .upload-button {
          padding: 0.8rem;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
        }
        .upload-button:hover {
          background-color: #2980b9;
        }
        .image-preview {
          max-width: 200px;
          margin-top: 1rem;
        }
        .submit-button {
          padding: 1rem;
          background-color: #27ae60;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: bold;
        }
        .submit-button:hover {
          background-color: #219a52;
        }
        .submit-button:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }
        .error-message {
          color: red;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}