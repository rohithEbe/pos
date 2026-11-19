import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Package } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import './Products.css';

export const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct, categories } = usePOS();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'burgers',
    price: '',
    stock: '',
    description: '',
    image: ''
  });

  const filtered = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'burgers',
      price: '',
      stock: '25',
      description: '',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: (product.stock || 20).toString(),
      description: product.description || '',
      image: product.image || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        description: formData.description,
        image: formData.image
      });
    } else {
      addProduct({
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        description: formData.description,
        image: formData.image
      });
    }

    setIsModalOpen(false);
  };

  const columns = [
    {
      header: 'Product',
      key: 'name',
      render: (name, item) => (
        <div className="product-table-cell">
          <img src={item.image} alt={name} className="product-table-thumb" />
          <div className="product-cell-info">
            <span className="product-cell-name">{name}</span>
            <span className="product-cell-desc">{item.description}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Category',
      key: 'category',
      render: (cat) => <span className="cat-chip">{cat}</span>
    },
    {
      header: 'Price',
      key: 'price',
      render: (price) => <span className="price-tag">${parseFloat(price).toFixed(2)}</span>
    },
    {
      header: 'Stock Status',
      key: 'stock',
      render: (stock) => (
        <span className={`stock-pill ${stock < 15 ? 'low' : 'good'}`}>
          {stock || 20} in stock
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, item) => (
        <div className="table-actions">
          <button
            className="action-icon-btn edit"
            title="Edit product"
            onClick={() => handleOpenEdit(item)}
          >
            <Edit size={16} />
          </button>
          <button
            className="action-icon-btn delete"
            title="Delete product"
            onClick={() => deleteProduct(item.id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="pos-page-container">
      <Header
        title="Menu & Products"
        subtitle="Manage food items, pricing, inventory stock, and descriptions"
      />

      <div className="products-page-content">
        <div className="products-toolbar">
          <div className="toolbar-left">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Filter menu items..."
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="cat-select-filter"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button className="add-product-btn" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>Add New Item</span>
          </button>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="No menu products match the selected criteria"
        />
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Menu Item' : 'Create New Menu Item'}
        maxWidth="520px"
        footer={
          <>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="product-form"
              className="btn-primary"
            >
              {editingProduct ? 'Save Changes' : 'Add Item'}
            </button>
          </>
        }
      >
        <form id="product-form" onSubmit={handleSubmit} className="product-modal-form">
          <div className="form-group">
            <label>Item Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Truffle Cheeseburger"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="burgers">Burgers</option>
                <option value="pizzas">Pizzas</option>
                <option value="beverages">Beverages</option>
                <option value="desserts">Desserts</option>
                <option value="sides">Sides & Salads</option>
              </select>
            </div>

            <div className="form-group">
              <label>Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="9.99"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Initial Stock Units</label>
              <input
                type="number"
                min="0"
                placeholder="25"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description & Ingredients</label>
            <textarea
              rows="3"
              placeholder="Brief description of the dish..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
