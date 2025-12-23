import React from 'react';
import { useCallback, useEffect, useState,useRef } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getItemCartStart } from '../../action/ShopCartAction'
import {listRoomOfUser} from '../../services/userService';
import './Header.scss';
import TopMenu from './TopMenu';
import socketIOClient from "socket.io-client";

const Header = props => {
    const [quantityMessage, setquantityMessage] = useState('')
    const [user, setUser] = useState({})
    const [showUserMenu, setShowUserMenu] = useState(false)
    const dispatch = useDispatch()
    const history = useHistory()
    let dataCart = useSelector(state => state.shopcart.listCartItem)
    const host =
        (typeof window !== "undefined" &&
            window.__APP_CONFIG__ &&
            window.__APP_CONFIG__.BACKEND_URL) ||
        process.env.REACT_APP_BACKEND_URL;
    const socketRef = useRef();

    const handleLogout = () => {
        // Clear user data and token
        localStorage.removeItem("userData");
        localStorage.removeItem("token");
        
        // Clear cart from redux persist
        localStorage.removeItem("persist:shopcart");
        
        // Dispatch clear cart action
        dispatch({ type: 'CLEAR_CART' });
        
        window.location.href = '/login'
    }

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu)
    }

    const closeUserMenu = () => {
        setShowUserMenu(false)
    }

    const navigateToPage = (path) => {
        setShowUserMenu(false)
        history.push(path)
    }

    const fetchListRoom = useCallback(async(userId) =>{
        const res = await listRoomOfUser(userId)
        if(res && res.errCode === 0 ){
            let count = 0;
            if(res.data && res.data.length> 0 && res.data[0].messageData && res.data[0].messageData.length > 0){
                res.data[0].messageData.forEach((item) =>{
                    if(item.unRead === 1 && item.userId !== userId) count = count +1;
                  })
            }
           
            setquantityMessage(count)
        }
       
      },[])

    useEffect(() => {
        socketRef.current = socketIOClient.connect(host)
        const userData = JSON.parse(localStorage.getItem('userData'));
        setUser(userData)
        if (userData) {
            dispatch(getItemCartStart(userData.id))
            fetchListRoom(userData.id)
    
            socketRef.current.on('sendDataServer', () => {
               
                fetchListRoom(userData.id)
    
                })  
             socketRef.current.on('loadRoomServer', () => {
                    
                    fetchListRoom(userData.id)
        
                    })  
              return () => {
                socketRef.current.disconnect();
              };
        } else {
            // Clear cart if user is not logged in
            dispatch({ type: 'CLEAR_CART' });
        }
       
    }, [dispatch, fetchListRoom, host])

    useEffect(() => {
        const handleScroll = () => {
            const header = document.querySelector(".main_menu");
            if (header) {
                header.classList.toggle("sticky", window.scrollY > 0)
            }
        }
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    return (

        < header className="header_area" >
            <TopMenu user={user && user} />
            <div className="main_menu">
                <div className="container">
                    <nav className="navbar navbar-expand-lg navbar-light w-100">
                        {/* Brand and toggle get grouped for better mobile display */}
                        <NavLink to="/" className="navbar-brand logo_h">
                            <img src="/resources/img/logo.png" alt="" />
                        </NavLink>
                        <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>
                        {/* Collect the nav links, forms, and other content for toggling */}
                        <div className="collapse navbar-collapse offset w-100" id="navbarSupportedContent">
                            <ul className="nav navbar-nav center_nav pull-right">
                                <li className="nav-item">
                                    <NavLink exact to="/" className="nav-link"
                                        activeClassName="selected" activeStyle={{ color: '#71cd14' }}>
                                        Trang chủ
                                    </NavLink>
                                </li>
                                <li className="nav-item ">
                                    <NavLink to="/shop" className="nav-link"
                                        activeClassName="selected" activeStyle={{ color: '#71cd14' }}>
                                        Cửa hàng
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/blog" className="nav-link" activeClassName="selected" activeStyle={{ color: '#71cd14' }}>
                                    Blog
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/about" className="nav-link" activeClassName="selected" activeStyle={{ color: '#71cd14' }}>
                                    Giới thiệu
                                    </NavLink>
                                </li>
                            </ul>
                            <ul className="nav navbar-nav navbar-right right_nav pull-right">
                                <li className="nav-item messenger-icon-wrapper">
                                    <Link to={"/user/messenger"} className="messenger-icon-link">
                                        <i className="fa-brands fa-facebook-messenger"></i>
                                        {quantityMessage > 0 && 
                                            <span className="messenger-badge">{quantityMessage}</span>
                                        }
                                    </Link>
                                </li>
                                <li className="nav-item cart-icon-wrapper">
                                    <Link to={"/shopcart"} className="cart-icon-link">
                                        <i className="ti-shopping-cart" />
                                        {user && user.id && dataCart && dataCart.length > 0 && 
                                            <span className="cart-badge">{dataCart.length}</span>
                                        }
                                    </Link>
                                </li>
                                <li className="nav-item login-button-wrapper">
                                    {user && user.id ? (
                                        <div className="user-menu-dropdown">
                                            <button 
                                                className="login-button" 
                                                onClick={toggleUserMenu}
                                                type="button"
                                            >
                                                <i className="ti-user" />
                                                <span>{user.firstName || 'Tài khoản'}</span>
                                                <i className="ti-angle-down" style={{ marginLeft: '5px', fontSize: '12px' }}></i>
                                            </button>
                                            {showUserMenu && (
                                                <>
                                                    <div className="dropdown-backdrop" onClick={closeUserMenu}></div>
                                                    <div className="user-dropdown-menu">
                                                        <button 
                                                            className="dropdown-item" 
                                                            onClick={() => navigateToPage(`/user/detail/${user.id}`)}
                                                            type="button"
                                                        >
                                                            <i className="ti-user"></i> Tài khoản của tôi
                                                        </button>
                                                        <button 
                                                            className="dropdown-item" 
                                                            onClick={() => navigateToPage(`/user/order/${user.id}`)}
                                                            type="button"
                                                        >
                                                            <i className="ti-package"></i> Đơn mua
                                                        </button>
                                                        <button 
                                                            className="dropdown-item" 
                                                            onClick={() => navigateToPage(`/user/voucher/${user.id}`)}
                                                            type="button"
                                                        >
                                                            <i className="ti-gift"></i> Voucher
                                                        </button>
                                                        <hr className="dropdown-divider" />
                                                        <button onClick={handleLogout} className="dropdown-item logout-btn" type="button">
                                                            <i className="ti-power-off"></i> Đăng xuất
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <Link to="/login" className="login-button">
                                            <i className="ti-user" />
                                            <span>Đăng nhập</span>
                                        </Link>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        </header >


    );
};

export default Header;