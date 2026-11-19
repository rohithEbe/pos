import React, { useState } from 'react';
import { Plus, Grid, Layers, UtensilsCrossed, Beef, Pizza, Coffee, CakeSlice, Salad } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import Header from '../components/Header';
import Modal from '../components/Modal';
import './Categories.css';

const iconMap = {
  UtensilsCrossed,
  Beef,
  Pizza,
  Coffee,
  CakeSlice,
  Salad
};

export const Categories = () => {
  const { categories, setCategories, products } = usePOS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('UtensilsCrossed');

  const getProductCount = (catId) => {
    if (catId === 'all') return products.length;
    return products.filter((p) => p.category.toLowerCase() === catId.toLowerCase()).length;
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName) return;

    const newId = newCatName.toLowerCase().replace(/\s+/g, '-');
    const newCategory = {
      id: newId,
      name: newCatName,
      icon: newCatIcon,
      count: 0
    };

    setCategories((prev) => [...prev, newCategory]);
    setNewCatName('');
    setIsModalOpen(false);
  };

  return (
    <div className="pos-page-container">
      <Header
        title="Food & Menu Categories"
        subtitle="Organize dishes and drinks into easily accessible kitchen sections"
      />

      <div className="categories-page-content">
        <div className="categories-toolbar">
          <div className="cat-count-summary">
            <Layers size={18} />
            <span>Total Categories: {categories.length}</span>
          </div>

          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            <span>Add New Category</span>
          </button>
        </div>

        <div className="categories-cards-grid">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || UtensilsCrossed;
            const count = getProductCount(cat.id);
            return (
              <div key={cat.id} className="category-card">
                <div className="cat-icon-wrapper">
                  <Icon size={28} />
                </div>
                <div className="cat-info">
                  <h4 className="cat-name">{cat.name}</h4>
                  <span className="cat-slug">id: {cat.id}</span>
                </div>
                <div className="cat-footer">
                  <span className="cat-badge">{count} Items</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Menu Category"
        maxWidth="440px"
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
              form="cat-form"
              className="btn-primary"
            >
              Create Category
            </button>
          </>
        }
      >
        <form id="cat-form" onSubmit={handleAddCategory} className="cat-modal-form">
          <div className="form-group">
            <label>Category Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Seafood & Grills"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Icon Style</label>
            <select
              value={newCatIcon}
              onChange={(e) => setNewCatIcon(e.target.value)}
            >
              <option value="UtensilsCrossed">Cutlery / General</option>
              <option value="Beef">Burgers / Meat</option>
              <option value="Pizza">Pizza / Bakery</option>
              <option value="Coffee">Coffee & Beverages</option>
              <option value="CakeSlice">Desserts & Sweets</option>
              <option value="Salad">Salads & Healthy</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
