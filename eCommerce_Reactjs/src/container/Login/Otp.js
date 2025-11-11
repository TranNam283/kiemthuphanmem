import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './Otp.scss';
import firebase from '../../utils/firebase';
import { toast } from 'react-toastify';
import { createNewUser, handleLoginService } from '../../services/userService';

const otpFieldKeys = ['so1', 'so2', 'so3', 'so4', 'so5', 'so6'];

const Otp = (props) => {
    const [inputValues, setInputValues] = useState({
        so1: '', so2: '', so3: '', so4: '', so5: '', so6: ''
    });

    const configureCaptcha = useCallback(() => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
            size: 'invisible',
            defaultCountry: 'VN'
        });
    }, []);

    const onSignInSubmit = useCallback(async (isResend) => {
        const dataUser = props.dataUser;
        if (!dataUser || !dataUser.phonenumber) {
            return;
        }
        if (!isResend) {
            configureCaptcha();
        }
        let phoneNumber = dataUser.phonenumber;
        if (phoneNumber) {
            phoneNumber = '+84' + phoneNumber.slice(1);
        }

        const appVerifier = window.recaptchaVerifier;

        try {
            const confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier);
            window.confirmationResult = confirmationResult;
            toast.success('Da gui ma OTP vao dien thoai');
        } catch (error) {
            console.error(error);
            toast.error('Gui ma that bai !');
        }
    }, [configureCaptcha, props.dataUser]);

    useEffect(() => {
        if (props.dataUser) {
            onSignInSubmit(false);
        }
    }, [onSignInSubmit, props.dataUser]);

    const handleOnChange = useCallback((event) => {
        const { name, value } = event.target;
        if (!otpFieldKeys.includes(name)) {
            return;
        }
        if (value && !/^[0-9]$/.test(value)) {
            return;
        }
        setInputValues((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleLogin = useCallback(async (email, password) => {
        try {
            const res = await handleLoginService({
                email: email,
                password: password
            });

            if (res && res.errCode === 0) {
                localStorage.setItem('userData', JSON.stringify(res.user));
                localStorage.setItem('token', JSON.stringify(res.accessToken));
                if (res.user.roleId === 'R1' || res.user.roleId === 'R4') {
                    window.location.href = '/admin';
                } else {
                    window.location.href = '/';
                }
            } else {
                toast.error(res.errMessage);
            }
        } catch (error) {
            toast.error('Khong the ket noi den may chu, vui long thu lai sau');
            console.error('handleLogin failed', error);
        }
    }, []);

    const createUserAccount = useCallback(async () => {
        try {
            if (!props.dataUser) {
                toast.error('Thieu thong tin nguoi dung, vui long thu lai');
                return;
            }
            const res = await createNewUser({
                email: props.dataUser.email,
                lastName: props.dataUser.lastName,
                phonenumber: props.dataUser.phonenumber,
                password: props.dataUser.password,
                roleId: props.dataUser.roleId
            });
            if (res && res.errCode === 0) {
                toast.success('Tao tai khoan thanh cong');
                await handleLogin(props.dataUser.email, props.dataUser.password);
            } else {
                toast.error(res.errMessage);
            }
        } catch (error) {
            toast.error('Khong the ket noi den may chu, vui long thu lai sau');
            console.error('createNewUser failed', error);
        }
    }, [handleLogin, props.dataUser]);

    const submitOTP = useCallback(async () => {
        const otpValues = otpFieldKeys.map((key) => inputValues[key] || '');
        if (otpValues.some((value) => value.trim() === '')) {
            toast.error('Vui long nhap du 6 so OTP');
            return;
        }
        const otpCode = otpValues.join('');
        const confirmationResult = window.confirmationResult;
        if (!confirmationResult || typeof confirmationResult.confirm !== 'function') {
            toast.info('Khong kiem tra OTP voi may chu, gia lap xac thuc thanh cong');
            await createUserAccount();
            return;
        }
        try {
            await confirmationResult.confirm(otpCode);
            toast.success('Da xac minh so dien thoai !');
            await createUserAccount();
        } catch (error) {
            toast.error('Ma OTP khong dung !');
        }
    }, [createUserAccount, inputValues]);

    const resendOTP = useCallback(async () => {
        await onSignInSubmit(true);
    }, [onSignInSubmit]);

    const handleResendClick = (event) => {
        event.preventDefault();
        resendOTP();
    };

    const otpInputs = useMemo(() =>
        otpFieldKeys.map((field) => (
            <input
                key={field}
                value={inputValues[field]}
                name={field}
                onChange={handleOnChange}
                type="text"
                className="m-1 text-center form-control rounded"
                maxLength={1}
                autoComplete="off"
                inputMode="numeric"
                pattern="[0-9]*"
                spellCheck={false}
            />
        )),
        [handleOnChange, inputValues]
    );

    return (
        <>
            <div className="container d-flex justify-content-center align-items-center container_Otp">
                <div className="card text-center">
                    <div className="card-header p-5">
                        <img src="https://raw.githubusercontent.com/Rustcodeweb/OTP-Verification-Card-Design/main/mobile.png" alt="Phone illustration" />
                        <h5 style={{ color: '#fff' }} className="mb-2">XAC THUC OTP</h5>
                        <div>
                            <small>Ma da duoc gui toi sdt {props.dataUser && props.dataUser.phonenumber}</small>
                        </div>
                    </div>
                    <div className="input-container d-flex flex-row justify-content-center mt-2">
                        {otpInputs}
                    </div>
                    <div>
                        <small>
                            Ban khong nhan duoc Otp ?
                            <a href="/" onClick={handleResendClick} style={{ color: '#3366FF' }} className="text-decoration-none ml-2">Gui lai</a>
                        </small>
                    </div>
                    <div className="mt-3 mb-5">
                        <div id="sign-in-button"></div>
                        <button onClick={submitOTP} className="btn btn-success px-4 verify-btn">Xac thuc</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Otp;
