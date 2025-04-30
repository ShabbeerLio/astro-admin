import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdClose, MdCheck } from "react-icons/md";
import "./DeleteRequest.css"
import Host from "../../Components/Host/Host";

const DeleteRequest = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        } else {
            const fetchUsers = async () => {
                try {
                    const response = await fetch(`${Host}/api/auth/delete-requests`, {
                        method: "GET",
                        headers: {
                            "auth-token": localStorage.getItem("token"),
                            "Content-Type": "application/json",
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch users");
                    }

                    const json = await response.json();
                    setUsers(json);
                } catch (error) {
                    console.error("Error fetching users:", error);
                }
            };

            fetchUsers();
        }
    }, [navigate]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const cancelRequest = async (userId) => {
        try {
            const res = await fetch(`${Host}/api/auth/cancel-delete-request/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token"),
                },
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Delete failed");
            }
            setUsers(users.filter((user) => user.user !== userId));
        } catch (err) {
            console.error(err);
            setMessage(err.message || "Delete failed");
        }
    };
    const deleteUser = async (userId) => {
        // console.log(userId);
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${Host}/api/auth/deleteuser/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token"),
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Delete failed");
            }

            setMessage(data.message);
            alert(data.message);
            cancelRequest(userId)
            setUsers(users.filter((user) => user.user !== userId));
        } catch (err) {
            console.error(err);
            setMessage(err.message || "Delete failed");
        }
    };

    const filterAppointments = () => {
        const allAppointments = users.flatMap((note) => note || []);
        return allAppointments.filter((item) =>
            item.email.toLowerCase().includes(searchQuery)
        );
    };

    const filteredAppointments = filterAppointments();
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
    const paginatedAppointments = filteredAppointments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };
    return (
        <div className="Gochar">
            <div className="Gochar-main">
                <div className="Gochar-button">
                    <h3>Delete Requests</h3>
                </div>
                <div className="Gochar-button appointment-query">
                    <div className="planet-filter">
                        <div className="group">
                            <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="search-icon"
                            >
                                <g>
                                    <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                                </g>
                            </svg>
                            <input
                                id="query"
                                className="input"
                                type="search"
                                placeholder="Search by email"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                </div>

                {paginatedAppointments.length > 0 ? (
                    <div className="table-container">
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>S. No</th>
                                    <th>Date</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAppointments.map((k, idx) => (
                                    <tr key={k._id}>
                                        <td>{idx + 1}</td>
                                        <td>{k.createdAt}</td>
                                        <td>{k.email}</td>
                                        <td className="delete-request-button">
                                            <p onClick={() => cancelRequest(k.user)}>
                                                <MdClose />
                                            </p>
                                            <p onClick={() => deleteUser(k.user)}>
                                                <MdCheck />
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Pagination Controls */}
                        <div className="pagination-controls">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                ) : (
                    <p style={{ textAlign: "center", marginTop: "20px" }}>
                        No delete requests found.
                    </p>
                )}
            </div>
        </div>
    );
};

export default DeleteRequest;

// export default DeleteRequest
