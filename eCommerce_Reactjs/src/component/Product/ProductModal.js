import React, { useState } from 'react';
import './ProductModal.css';

const ProductModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Đen');
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-body">
          <div className="modal-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="modal-info">
            <h2>{product.name}</h2>
            <p className="product-code">Mã sản phẩm: <strong>{product.code}</strong></p>
            <p className="product-brand">Thương hiệu: <strong>{product.brand}</strong></p>

            <div className="price-section">
              <span className="price-discount">{product.discountPrice}đ</span>
              <span className="price-original">{product.originalPrice}đ</span>
              <span className="discount-percent">-{product.discount}%</span>
            </div>

            <div className="form-group">
              <label>Kích thước:</label>
              <div className="size-options">
                {['S', 'M', 'L', 'XL'].map(size => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Màu sắc:</label>
              <div className="color-options">
                <button
                  className={`color-btn ${selectedColor === 'Đen' ? 'active' : ''}`}
                  style={{ backgroundColor: 'black' }}
                  onClick={() => setSelectedColor('Đen')}
                  title="Đen"
                />
                <button
                  className={`color-btn ${selectedColor === 'Trắng' ? 'active' : ''}`}
                  style={{ backgroundColor: 'white', border: '1px solid #ccc' }}
                  onClick={() => setSelectedColor('Trắng')}
                  title="Trắng"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Số lượng:</label>
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <input type="number" value={quantity} readOnly />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <button className="btn-add-to-cart" onClick={handleAddToCart}>
              THÊM VÀO GIỎ
            </button>

            <div className="share-section">
              <span>Chia sẻ:</span>
              <a href="#" className="share-btn facebook">f</a>
              <a href="#" className="share-btn twitter">𝕏</a>
              <a href="#" className="share-btn pinterest">P</a>
              <a href="#" className="share-btn copy">🔗</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;