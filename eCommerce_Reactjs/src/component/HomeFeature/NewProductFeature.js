import React from 'react';
import ItemProduct from '../Product/ItemProduct';
import HeaderContent from '../Content/HeaderContent';
import './NewProductFeature.scss';

function NewProductFeature(props) {
    // Don't render if no data
    if (!props.data || props.data.length === 0) {
        return null;
    }

    return (
        <section className="new_product_area section_gap_bottom_custom">
            <div className="container">
                <HeaderContent mainContent={props.title}
                    infoContent={props.description}> </HeaderContent>
                <div className="new-product-grid">
                                {props.data && props.data.length > 0 &&
                                    props.data.map((item, index) => {
                                        const firstDetail = item && item.productDetail ? item.productDetail[0] : null;
                                        const firstImage =
                                            firstDetail && firstDetail.productImage && firstDetail.productImage[0]
                                                ? firstDetail.productImage[0].image
                                                : "";
                                        const discountPrice = firstDetail ? firstDetail.discountPrice : null;
                                        const price = firstDetail ? firstDetail.originalPrice : null;
                            return (
                                <div className="new-product-item" key={index}>
                                                <ItemProduct
                                                    id={item.id}
                                                    name={item.name}
                                                    img={firstImage}
                                                    discountPrice={discountPrice}
                                                    price={price}
                                                ></ItemProduct>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    );
}

export default NewProductFeature;