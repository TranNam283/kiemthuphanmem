import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './VerifyEmail.scss';
import { handleVerifyEmail } from '../../../services/userService';
const VerifyEmail = () => {

    const [status, setstatus] = useState(false)

    useEffect(() => {
        const fetchVerifyEmail = async () => {
            try {
                const url = new URL(window.location.href);
                const token = url.searchParams.get('token');
                const id = url.searchParams.get('userId');
                const res = await handleVerifyEmail({
                    token: token,
                    id: id
                })
                console.log(res.errCode)
                if (res.errCode === 0) {
                    setstatus(true)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchVerifyEmail()
    }, [])
    console.log("check status", status)
    return (
        <div className="container-verify-email">
            <h3 className="text-verify-email">
                {status === true && "Xác thực email thành công !"}
                {status === false && "Email đã được xác thực hoặc không tồn tại !"}
            </h3>
        </div>
    )
}
export default VerifyEmail;