import React, { useEffect, useState } from 'react';

import moment from 'moment';

import { Modal, ModalFooter, ModalBody, Button } from 'reactstrap';
import '../User/StoreVoucher.scss';
import { getAllVoucherByUserIdService } from '../../services/userService';
import CommonUtils from '../../utils/CommonUtils';
import VoucherItemSmall from '../User/VoucherItemSmall';


const VoucherModal = (props) => {
    const [dataVoucher, setdataVoucher] = useState([])
    let handleCloseModal = () => {
        props.closeModal()
    }
    function compareDates(d1, d2) {
        //  lon hon la false
        //  be hon la true

        const d1Parts = d1.split('/');
        const firstDateValue = Number(d1Parts[2] + d1Parts[1] + d1Parts[0]);
        const d2Parts = d2.split('/');
        const secondDateValue = Number(d2Parts[2] + d2Parts[1] + d2Parts[0]);
        if (firstDateValue <= secondDateValue) return true
        if (firstDateValue >= secondDateValue) return false

    }
    useEffect(() => {

        let id = props.id
        if (id) {
            let fetchData = async () => {
                let arrData = await getAllVoucherByUserIdService({

                    limit: '',
                    offset: '',
                    id: props.id
                })
                let arrTemp = []
                if (arrData && arrData.errCode === 0) {
                    let nowDate = moment.unix(Date.now() / 1000).format('DD/MM/YYYY')

                    for (let i = 0; i < arrData.data.length; i++) {
                        let fromDate = moment.unix(arrData.data[i].voucherData.fromDate / 1000).format('DD/MM/YYYY')
                        let toDate = moment.unix(arrData.data[i].voucherData.toDate / 1000).format('DD/MM/YYYY')
                        let amount = arrData.data[i].voucherData.amount
                        let usedAmount = arrData.data[i].voucherData.usedAmount
                        let minValue = arrData.data[i].voucherData.typeVoucherOfVoucherData.minValue

                        if (amount > usedAmount && compareDates(toDate, nowDate) === false && compareDates(fromDate, nowDate) === true && minValue <= props.price) {
                            arrTemp.push(arrData.data[i])

                        }
                    }
                    setdataVoucher(arrTemp)

                }
            }
            fetchData()
        }

    }, [props.id, props.isOpenModal, props.price])

    let closeModalFromVoucherItem = () => {
        props.closeModalFromVoucherItem()
    }
    return (
        <div className="">
            <Modal isOpen={props.isOpenModal} className={'booking-modal-container'}
                size="md" centered
            >
                <div className="modal-header">
                    <h5 className="modal-title">Chọn Eiser Voucher</h5>
                    <button onClick={handleCloseModal} type="button" className="btn btn-time" aria-label="Close">X</button>
                </div>
                <ModalBody>


                    <div style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden' }} className="container-voucher">
                        {dataVoucher && dataVoucher.length > 0 &&
                            dataVoucher.map((item, index) => {
                                let percent = ""
                                if (item.voucherData.typeVoucherOfVoucherData.typeVoucher === "percent") {
                                    percent = item.voucherData.typeVoucherOfVoucherData.value + "%"
                                }
                                if (item.voucherData.typeVoucherOfVoucherData.typeVoucher === "money") {
                                    percent = CommonUtils.formatter.format(item.voucherData.typeVoucherOfVoucherData.value)

                                }
                                let MaxValue = CommonUtils.formatter.format(item.voucherData.typeVoucherOfVoucherData.maxValue)

                                return (
                                    <VoucherItemSmall closeModalFromVoucherItem={closeModalFromVoucherItem} data={item} id={item.id} key={index} name={item.voucherData.codeVoucher} maxValue={MaxValue} usedAmount={Math.round((item.voucherData.usedAmount * 100 / item.voucherData.amount) * 10) / 10} typeVoucher={percent} />
                                )
                            })
                        }


                    </div>

                </ModalBody>
                <ModalFooter>

                    {' '}
                    <Button onClick={handleCloseModal}>
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>

        </div >
    )
}
export default VoucherModal;