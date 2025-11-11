import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    createNewReceiptService,
    getAllProductAdmin,
    getAllSupplier
} from '../../../services/userService';

const AddReceipt = () => {
    const [user, setUser] = useState({});
    const [dataSupplier, setDataSupplier] = useState([]);
    const [dataProduct, setDataProduct] = useState([]);
    const [dataProductDetail, setDataProductDetail] = useState([]);
    const [dataProductDetailSize, setDataProductDetailSize] = useState([]);
    const [productDetailId, setProductDetailId] = useState('');
    const [productDetailSizeId, setProductDetailSizeId] = useState('');
    const [inputValues, setInputValues] = useState({
        supplierId: '',
        quantity: '',
        price: '',
        productId: ''
    });

    const loadDataSupplier = useCallback(async () => {
        const response = await getAllSupplier({
            limit: '',
            offset: '',
            keyword: ''
        });
        if (response && response.errCode === 0) {
            setDataSupplier(response.data);
        }
    }, []);

    const loadProduct = useCallback(async () => {
        const response = await getAllProductAdmin({
            sortName: '',
            sortPrice: '',
            categoryId: 'ALL',
            brandId: 'ALL',
            limit: '',
            offset: '',
            keyword: ''
        });
        if (response && response.errCode === 0) {
            setDataProduct(response.data);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            await Promise.all([loadDataSupplier(), loadProduct()]);
            const storedUser = JSON.parse(localStorage.getItem('userData'));
            setUser(storedUser || {});
        };
        void init();
    }, [loadDataSupplier, loadProduct]);

    useEffect(() => {
        if (dataSupplier.length === 0) {
            return;
        }
        setInputValues((prevState) => {
            if (prevState.supplierId) {
                return prevState;
            }
            return { ...prevState, supplierId: dataSupplier[0].id };
        });
    }, [dataSupplier]);

    useEffect(() => {
        if (dataProduct.length === 0) {
            return;
        }
        setInputValues((prevState) => {
            if (prevState.productId) {
                return prevState;
            }
            return { ...prevState, productId: dataProduct[0].id };
        });
    }, [dataProduct]);

    useEffect(() => {
        const selectedProduct = dataProduct.find(
            (product) => product.id === inputValues.productId
        );
        if (!selectedProduct) {
            setDataProductDetail([]);
            return;
        }
        setDataProductDetail(selectedProduct.productDetail || []);
    }, [dataProduct, inputValues.productId]);

    useEffect(() => {
        if (dataProductDetail.length === 0) {
            setProductDetailId('');
            setDataProductDetailSize([]);
            setProductDetailSizeId('');
            return;
        }
        setProductDetailId((prevState) => {
            if (prevState && dataProductDetail.some((detail) => detail.id === prevState)) {
                return prevState;
            }
            return dataProductDetail[0].id;
        });
    }, [dataProductDetail]);

    useEffect(() => {
        const selectedDetail = dataProductDetail.find(
            (detail) => detail.id === productDetailId
        );
        if (!selectedDetail) {
            setDataProductDetailSize([]);
            setProductDetailSizeId('');
            return;
        }
        const sizes = selectedDetail.productDetailSize || [];
        setDataProductDetailSize(sizes);
        setProductDetailSizeId((prevState) => {
            if (prevState && sizes.some((size) => size.id === prevState)) {
                return prevState;
            }
            return sizes.length > 0 ? sizes[0].id : '';
        });
    }, [dataProductDetail, productDetailId]);

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setInputValues((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleOnChangeProduct = (event) => {
        const { value } = event.target;
        setInputValues((prevState) => ({ ...prevState, productId: value }));
    };

    const handleOnChangeProductDetail = (event) => {
        setProductDetailId(event.target.value);
    };

    const handleOnChangeProductDetailSize = (event) => {
        setProductDetailSizeId(event.target.value);
    };

    const handleSaveReceipt = async () => {
        const response = await createNewReceiptService({
            supplierId: inputValues.supplierId,
            userId: user.id,
            productDetailSizeId,
            quantity: inputValues.quantity,
            price: inputValues.price
        });

        if (response && response.errCode === 0) {
            toast.success('Thêm nhập hàng thành công');
            setInputValues((prevState) => ({
                ...prevState,
                quantity: '',
                price: ''
            }));
            return;
        }
        if (response && response.errCode === 2) {
            toast.error(response.errMessage);
            return;
        }
        toast.error('Thêm nhập hàng thất bại');
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý nhập hàng</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Thêm mới nhập hàng
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="inputSupplier">Nhà cung cấp</label>
                                <select
                                    value={inputValues.supplierId}
                                    name="supplierId"
                                    onChange={handleOnChange}
                                    id="inputSupplier"
                                    className="form-control"
                                >
                                    {dataSupplier.length > 0 &&
                                        dataSupplier.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="inputProduct">Sản phẩm</label>
                                <select
                                    value={inputValues.productId}
                                    name="productId"
                                    onChange={handleOnChangeProduct}
                                    id="inputProduct"
                                    className="form-control"
                                >
                                    {dataProduct.length > 0 &&
                                        dataProduct.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="inputProductDetail">Loại sản phẩm</label>
                                <select
                                    value={productDetailId}
                                    onChange={handleOnChangeProductDetail}
                                    id="inputProductDetail"
                                    className="form-control"
                                >
                                    {dataProductDetail.length > 0 &&
                                        dataProductDetail.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.nameDetail}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="inputProductSize">Size sản phẩm</label>
                                <select
                                    value={productDetailSizeId}
                                    name="productDetailSizeId"
                                    onChange={handleOnChangeProductDetailSize}
                                    id="inputProductSize"
                                    className="form-control"
                                >
                                    {dataProductDetailSize.length > 0 &&
                                        dataProductDetailSize.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.sizeId}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputQuantity">Số lượng</label>
                                <input
                                    type="number"
                                    value={inputValues.quantity}
                                    name="quantity"
                                    onChange={handleOnChange}
                                    className="form-control"
                                    id="inputQuantity"
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputPrice">Đơn giá</label>
                                <input
                                    type="number"
                                    value={inputValues.price}
                                    name="price"
                                    onChange={handleOnChange}
                                    className="form-control"
                                    id="inputPrice"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleSaveReceipt}
                            className="btn btn-primary"
                        >
                            Lưu thông tin
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddReceipt;