import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CommonUtils from '../../utils/CommonUtils';
import './ItemProduct.scss';
import AddToCartModal from './AddToCartModal';

// độ phân giải ảnh có thể làm vỡ layout
function ItemProduct(props) {
    const [isOpenModal, setIsOpenModal] = useState(false);

    const formatPrice = (value) => {
        if (typeof value !== 'number' || !Number.isFinite(value)) return '';
        return CommonUtils.formatter.format(value);
    }

    const openAddToCart = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.stopPropagation) e.stopPropagation();
        setIsOpenModal(true);
    }

    return (
        <div className={props.type || 'product-item-wrapper'}>
            <div className="product-card">
                <Link to={`/detail-product/${props.id}`} className="product-link">
                    <div className="product-image" style={{ width: props.width, height: props.height }}>
                        <img className="img-fluid" src={props.img} alt={props.name} />
                    </div>
                    <div className="product-info">
                        <h4 className="product-name">{props.name}</h4>
                        <div className="product-price-wrapper">
                            <div className="product-price">
                                <span className="current-price">{formatPrice(props.discountPrice)}</span>
                                {typeof props.price === 'number' && typeof props.discountPrice === 'number' && props.price !== props.discountPrice && (
                                    <del className="original-price">{formatPrice(props.price)}</del>
                                )}
                            </div>
                            <button className="btn-cart-icon" onClick={openAddToCart} title="Thêm vào giỏ hàng">
                                <i className="ti-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                </Link>
            </div>

            <AddToCartModal isOpen={isOpenModal} toggle={() => setIsOpenModal(false)} productId={props.id} />
        </div>
    );
}

export default ItemProduct;
