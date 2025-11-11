import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const Header = () => {
    const [user, setUser] = useState({})
    let handleLogout = () => {
        localStorage.removeItem("userData");
        localStorage.removeItem("token");
        window.location.href = '/login'
    }
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        setUser(userData)
    }, [])


    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            {/* Navbar Brand*/}
            <Link className="navbar-brand ps-3" to="/admin">Trang quản trị</Link>
            {/* Sidebar Toggle*/}
            <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" type="button"><i className="fas fa-bars" /></button>
            {/* Navbar Search*/}
            <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                
            </form>
            {/* Navbar*/}
            <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li className="nav-item dropdown">
                    <button type="button" className="nav-link dropdown-toggle btn btn-link" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false"><i className="fas fa-user fa-fw" /></button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><Link to={`/admin/infor/${user.id}`} className="dropdown-item" >{user.firstName} {user.lastName}</Link></li>
                        <li><Link to={`/admin/change-password/${user.id}`} className="dropdown-item">Đổi mật khẩu</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><button type="button" className="dropdown-item" onClick={() => handleLogout()} >Đăng xuất</button></li>
                    </ul>
                </li>
            </ul>
        </nav>
    )
}
export default Header;