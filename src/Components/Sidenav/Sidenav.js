import React from 'react'
import "./Sidenav.css"
import { Link, useNavigate } from 'react-router-dom'
import logo from "../../Assets/astrology.png"

const Sidenav = () => {
    let history = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        history("/login");
    };
    return (
        <div className='Sidenav'>
            <div className="Sidenav-icon">
                <Link to={"/"}>
                    <img src={logo} alt="" />
                    <p>Astro Nivish</p>
                </Link>
            </div>
            <div className='Sidenav-box'>
                <ul>
                    <li>
                        <Link to={"/"}>Home</Link>
                    </li>
                    <li>
                        <Link to={"/"}>Gochar</Link>
                    </li>
                    {/* <li>
                        <Link to={"/"}>User</Link>
                    </li> */}
                </ul>
            </div>
            <div className="Sidenav-logout">
                <Link to={"/login"} onClick={handleLogout}>Logout</Link>
            </div>
        </div>
    )
}

export default Sidenav
