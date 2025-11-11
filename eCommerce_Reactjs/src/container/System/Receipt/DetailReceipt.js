import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

import {
    createNewReceiptDetailService,
    getAllProductAdmin,
    getDetailReceiptByIdService
} from '../../../services/userService';
import CommonUtils from '../../../utils/CommonUtils';

const DetailReceipt = (props) => {
    const { id } = useParams();
    const [dataProduct, setDataProduct] = useState([]);
    const [dataProductDetail, setDataProductDetail] = useState([]);
    const [dataProductDetailSize, setDataProductDetailSize] = useState([]);
    const [productDetailId, setProductDetailId] = useState('');
    const [productDetailSizeId, setProductDetailSizeId] = useState('');
    const [dataReceiptDetail, setDataReceiptDetail] = useState([]);
    const [inputValues, setInputValues] = useState({
        quantity: '',
        price: '',
        productId: ''
    });
    useEffect(() => {
        if (dataProduct.length === 0) {
            return;
        }
        setInputValues((prev) => {
            if (prev.productId) {
                return prev;
            }
            return { ...prev, productId: dataProduct[0].id };
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
        setProductDetailId((prev) => {
            if (prev && dataProductDetail.some((detail) => detail.id === prev)) {
                return prev;
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
        setProductDetailSizeId((prev) => {
            if (prev && sizes.some((size) => size.id === prev)) {
                return prev;
            }
            return sizes.length > 0 ? sizes[0].id : '';
        });
    }, [dataProductDetail, productDetailId]);

    const loadReceiptDetail = useCallback(async (receiptId) => {
        const res = await getDetailReceiptByIdService(receiptId);
        if (res && res.errCode === 0) {
            setDataReceiptDetail(res.data.receiptDetail || []);
        }
    }, []);

    const loadProduct = useCallback(async () => {
        const arrData = await getAllProductAdmin({
            sortName: '',
            sortPrice: '',
            categoryId: 'ALL',
            brandId: 'ALL',
            limit: '',
            offset: '',
            keyword: ''
        });
        if (arrData && arrData.errCode === 0) {
            setDataProduct(arrData.data || []);
        }
    }, []);

    useEffect(() => {
        // load products and receipt details when component mounts or id changes
        void loadProduct();
        void loadReceiptDetail(id);
    }, [id, loadProduct, loadReceiptDetail]);
    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setInputValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleOnChangeProduct = (event) => {
        const { value } = event.target;
        setInputValues((prev) => ({ ...prev, productId: value }));
    };

    const handleOnChangeProductDetail = (event) => {
        const { value } = event.target;
        setProductDetailId(value);
    };
    const handleOnChangeProductDetailSize = (event) => {
        setProductDetailSizeId(event.target.value);
    };

    const handleSaveReceiptDetail = async () => {
        const res = await createNewReceiptDetailService({
            receiptId: id,
            productDetailSizeId: productDetailSizeId,
            quantity: inputValues.quantity,
            price: inputValues.price
        });
        if (res && res.errCode === 0) {
            toast.success('Thêm nhập chi tiết hàng thành công');
            setInputValues((prev) => ({ ...prev, quantity: '', price: '' }));
            await loadReceiptDetail(id);
        } else if (res && res.errCode === 2) {
            toast.error(res.errMessage);
        } else toast.error('Thêm nhập hàng thất bại');
    };


    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý chi tiết nhập hàng</h1>


            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Thêm mới chi tiết nhập hàng
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Sản phẩm</label>
                                <select value={inputValues.productId} name="productId" onChange={handleOnChangeProduct} id="inputState" className="form-control">
                                    {dataProduct && dataProduct.length > 0 &&
                                        dataProduct.map((item) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                </select>
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Loại sản phẩm</label>
                                <select value={productDetailId} onChange={handleOnChangeProductDetail} id="inputState" className="form-control">
                                    {dataProductDetail && dataProductDetail.length > 0 &&
                                        dataProductDetail.map((item) => (
                                            <option key={item.id} value={item.id}>{item.nameDetail}</option>
                                        ))}
                                </select>
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Size sản phẩm</label>
                                <select value={productDetailSizeId} name="productDetailSizeId" onChange={handleOnChangeProductDetailSize} id="inputState" className="form-control">
                                    {dataProductDetailSize && dataProductDetailSize.length > 0 &&
                                        dataProductDetailSize.map((item) => (
                                            <option key={item.id} value={item.id}>{item.sizeId}</option>
                                        ))}
                                </select>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputEmail4">Số lượng</label>
                                <input type="number" value={inputValues.quantity} name="quantity" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputEmail4">Đơn giá</label>
                                <input type="number" value={inputValues.price} name="price" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                        </div>

                        <button type="button" onClick={handleSaveReceiptDetail} className="btn btn-primary">Lưu thông tin</button>
                    </form>
                </div>
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách chi tiết nhập hàng
                </div>
                <div className="card-body">

                    <div className='row'>

                        <div className='col-12'>
                            {/* <button  style={{float:'right'}} onClick={() => handleOnClickExport()} className="btn btn-success mb-2" >Xuất excel <i className="fa-solid fa-file-excel"></i></button> */}
                        </div>
                    </div>
                        <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellSpacing={0}>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã đơn</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Đơn giá</th>

                                </tr>
                            </thead>

                            <tbody>
                                {dataReceiptDetail && dataReceiptDetail.length > 0 &&
                                    dataReceiptDetail.map((item, index) => {
                                        const name = `${item.productData.name} - ${item.productDetailData.nameDetail} - ${item.productDetailSizeData.sizeData.value}`;
                                        return (
                                            <tr key={item.id || index}>
                                                <td>{index + 1}</td>
                                                <td>{item.receiptId}</td>
                                                <td>{name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{CommonUtils.formatter.format(item.price)}</td>
                                            </tr>
                                        );
                                    })}


                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default DetailReceipt;