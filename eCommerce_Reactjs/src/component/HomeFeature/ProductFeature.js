import React from 'react';
import ItemProduct from '../Product/ItemProduct';
import HeaderContent from '../Content/HeaderContent';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './ProductFeature.scss';
function ProductFeature(props) {
    let settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    }

    return (

        <section className="feature_product_area section_gap_bottom_custom">
            <div className="container">
                <HeaderContent mainContent={props.title}
                    infoContent="Bạn sẽ không thất vọng khi lựa chọn"> </HeaderContent>

                <div className="box-productFeature">
                    {props.data && props.data.length > 0 ? (
                        <Slider {...settings}>
                            {props.data.map((item, index) => {
                                    const firstDetail = item && item.productDetail ? item.productDetail[0] : null;
                                    const firstImage =
                                        firstDetail && firstDetail.productImage && firstDetail.productImage[0]
                                            ? firstDetail.productImage[0].image
                                            : "";
                                    const discountPrice = firstDetail ? firstDetail.discountPrice : null;
                                    const price = firstDetail ? firstDetail.originalPrice : null;
                                    return (
                                        <div className="slider-item" key={index}>
                                            <ItemProduct
                                                id={item.id}
                                                name={item.name}
                                                img={firstImage}
                                                discountPrice={discountPrice}
                                                price={price}
                                            >
                                            </ItemProduct>
                                        </div>
                                    )
                            })}
                        </Slider>
                    ) : (
                        <div style={{width: '100%', textAlign: 'center', padding: '40px', color: '#80868b'}}>
                            <p style={{fontSize: '16px', marginBottom: '10px'}}>Chưa có sản phẩm gợi ý</p>
                            <p style={{fontSize: '14px'}}>Đăng nhập để nhận gợi ý sản phẩm phù hợp với bạn</p>
                        </div>
                    )}
                </div>



            </div>
        </section>



    );
}

export default ProductFeature;