import React from 'react';
import { useEffect, useState } from 'react';
import { useFetchAllcode } from '../../../customize/fetch';
import { Modal, ModalFooter, ModalBody, Button } from 'reactstrap';
import { getProductDetailSizeByIdService } from '../../../../services/userService';



const AddSizeModal = (props) => {
    const { data: dataSize } = useFetchAllcode('SIZE')
    const [inputValues, setInputValues] = useState({
        sizeId: '', width: '', height: '', isActionUpdate: false, id: '', weight: ''
    });
    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues(prev => ({ ...prev, [name]: value }));

    };
    useEffect(() => {
        if (dataSize && dataSize.length > 0 && inputValues.sizeId === '') {
            setInputValues(prev => ({ ...prev, sizeId: dataSize[0].code }));
        }
    }, [dataSize, inputValues.sizeId])
    useEffect(() => {
        const id = props.productSizeId

        if (props.isOpenModal && id) {
            const fetchDetailProductSize = async () => {
                const res = await getProductDetailSizeByIdService(id)
                if (res && res.errCode === 0) {
                    setInputValues(prev => ({
                        ...prev,
                        isActionUpdate: true,
                        sizeId: res.data.sizeId,
                        width: res.data.width,
                        height: res.data.height,
                        weight: res.data.weight
                    }))

                }
            }
            fetchDetailProductSize()
        } else if (!props.isOpenModal) {
            setInputValues(prev => ({ ...prev, isActionUpdate: false }))
        }
    }, [props.isOpenModal, props.productSizeId])
    let handleSaveInfor = () => {
        props.sendDataFromModalSize({
            sizeId: inputValues.sizeId,
         
            width: inputValues.width,
            height: inputValues.height,
            isActionUpdate: inputValues.isActionUpdate,
            id: props.productSizeId,
            weight: inputValues.weight
        })
        setInputValues(prev => ({ ...prev, sizeId: '',  width: '', height: '', weight: '', isActionUpdate: false }))
    }
    let handleCloseModal = () => {
        props.closeModal()
        setInputValues(prev => ({ ...prev, sizeId: '', width: '', height: '', weight: '', isActionUpdate: false }))

    }
    return (
        <div className="">
            <Modal isOpen={props.isOpenModal} className={'booking-modal-container'}
                size="md" centered
            >
                <div className="modal-header">
                    <h5 className="modal-title">Thêm kích thước chi tiết sản phẩm</h5>
                    <button onClick={handleCloseModal} type="button" className="btn btn-time" aria-label="Close">X</button>
                </div>
                <ModalBody>
                    <div className="row">
                        <div className="col-12 form-group">
                            <label>Kích thước</label>
                            <select value={inputValues.sizeId} name="sizeId" onChange={(event) => handleOnChange(event)} id="inputState" className="form-control">
                                {dataSize && dataSize.length > 0 &&
                                    dataSize.map((item, index) => {
                                        return (
                                            <option key={index} value={item.code}>{item.value}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="col-12 form-group">
                            <label>Chiều rộng</label>
                            <input value={inputValues.width} name="width" onChange={(event) => handleOnChange(event)} type="text" className="form-control"
                            />
                        </div>
                        <div className="col-12 form-group">
                            <label>Chiều dài</label>
                            <input value={inputValues.height} name="height" onChange={(event) => handleOnChange(event)} type="text" className="form-control"
                            />
                        </div>
                        <div className="col-12 form-group">
                            <label>Khối lượng</label>
                            <input value={inputValues.weight} name="weight" onChange={(event) => handleOnChange(event)} type="text" className="form-control"
                            />
                        </div>
                        
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={handleSaveInfor}
                    >
                        Lưu thông tin
                    </Button>
                    {' '}
                    <Button onClick={handleCloseModal}>
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>

        </div >
    )
}
export default AddSizeModal;