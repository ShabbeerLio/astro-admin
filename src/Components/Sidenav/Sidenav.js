import React, { useEffect, useState } from "react";
import "./Sidenav.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../Assets/astrology.png";
import { MdDelete, MdEdit, MdExpandMore, MdExpandLess } from "react-icons/md";


const Sidenav = () => {
    let history = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        history("/login");
    };
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isCollapsed2, setIsCollapsed2] = useState(true);

    useEffect(() => {
        const collapseElement = document.getElementById("collapseExample");

        const handleShow = () => setIsCollapsed(false);
        const handleHide = () => setIsCollapsed(true);

        collapseElement.addEventListener("show.bs.collapse", handleShow);
        collapseElement.addEventListener("hide.bs.collapse", handleHide);

        return () => {
            collapseElement.removeEventListener("show.bs.collapse", handleShow);
            collapseElement.removeEventListener("hide.bs.collapse", handleHide);
        };
    }, []);

    useEffect(() => {
        const collapseElement = document.getElementById("collapseExample2");

        const handleShow = () => setIsCollapsed2(false);
        const handleHide = () => setIsCollapsed2(true);

        collapseElement.addEventListener("show.bs.collapse", handleShow);
        collapseElement.addEventListener("hide.bs.collapse", handleHide);

        return () => {
            collapseElement.removeEventListener("show.bs.collapse", handleShow);
            collapseElement.removeEventListener("hide.bs.collapse", handleHide);
        };
    }, []);

    return (
        <div className="Sidenav">
            <div className="Sidenav-icon">
                <Link to={"/"}>
                    <img src={logo} alt="" />
                    <p>Astro Nivish</p>
                </Link>
            </div>
            <div className="Sidenav-box">
                <ul>
                    <li>
                        <Link to={"/"}>Home</Link>
                    </li>
                    <li>
                        <Link to={"/gochar"}>Gochar</Link>
                    </li>
                    <li>
                        <Link to={"/lifeaspect"}>Life Aspect</Link>
                    </li>
                    <li>
                        <Link to={"/coupon"}>Coupons</Link>
                    </li>
                    <li>
                        <a
                            data-bs-toggle="collapse"
                            href="#collapseExample3"
                            role="button"
                            aria-expanded={!isCollapsed}
                            aria-controls="collapseExample3"
                        >
                            Blogs
                            <span>{isCollapsed ? <MdExpandMore /> : <MdExpandLess />}</span>
                        </a>
                    </li>
                    <div className="collapse" id="collapseExample3">
                        <div className="card card-body">
                            <li>
                                <Link to={"/blog"}>Blog</Link>
                            </li>
                            <li>
                                <Link to={"/blog/add"}>Add Blog</Link>
                            </li>
                        </div>
                    </div>
                    <li>
                        <a
                            data-bs-toggle="collapse"
                            href="#collapseExample"
                            role="button"
                            aria-expanded={!isCollapsed}
                            aria-controls="collapseExample"
                        >
                            User Details
                            <span>{isCollapsed ? <MdExpandMore /> : <MdExpandLess />}</span>
                        </a>
                    </li>
                    <div className="collapse" id="collapseExample">
                        <div className="card card-body">
                            <li>
                                <Link to={"/users"}>Users</Link>
                            </li>
                            <li>
                                <Link to={"/subscription"}>Subscription</Link>
                            </li>
                            <li>
                                <Link to={"/appointments"}>Appointments</Link>
                            </li>
                            <li>
                                <Link to={"/remedy"}>Remedy</Link>
                            </li>
                            <li>
                                <Link to={"/delete-request"}>Delete Request</Link>
                            </li>
                        </div>
                    </div>
                    <li>
                        <a
                            data-bs-toggle="collapse"
                            href="#collapseExample2"
                            role="button"
                            aria-expanded={!isCollapsed2}
                            aria-controls="collapseExample2"
                        >
                            Ecommerce
                            <span>{isCollapsed2 ? <MdExpandMore /> : <MdExpandLess />}</span>
                        </a>
                    </li>
                    <div className="collapse" id="collapseExample2">
                        <div className="card card-body">
                            <li>
                                <Link to="/products/add">Add Products</Link>
                            </li>
                            <li>
                                <Link to="/products">Products</Link>
                            </li>
                            <li>
                                <Link to="/orders">Orders</Link>
                            </li>
                        </div>
                    </div>
                    <li>
                        <Link to={"/apiupdate"}>API KEY</Link>
                    </li>
                </ul>
            </div>
            <div className="Sidenav-logout">
                <Link to={"/login"} onClick={handleLogout}>
                    Logout
                </Link>
            </div>
        </div>
    );
};

export default Sidenav;
