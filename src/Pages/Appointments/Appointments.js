import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import NoteContext from "../../Context/NoteContext";
import "./Appointment.css";
import AddItem from "../../Components/Appointment/AddItem";

const Appointments = () => {
    const { notes, getDetails, deleteLifeAspect } = useContext(NoteContext);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPlan, setSelectedGochar] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        } else {
            getDetails();
        }
    }, [navigate, getDetails]);

    const openModal = (plan = null) => {
        setSelectedGochar(plan);
        setModalOpen(true);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const filterAndSortAppointments = () => {
        const allAppointments = notes.flatMap((note) => note.appointment || []);
        return allAppointments
            .filter((item) => {
                const queryMatch =
                    item.name.toLowerCase().includes(searchQuery) ||
                    item.email.toLowerCase().includes(searchQuery) ||
                    item.transactionId.toLowerCase().includes(searchQuery);

                const statusMatch =
                    filterStatus === "All" || item.status === filterStatus;

                return queryMatch && statusMatch;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date))
    };

    const filteredAppointments = filterAndSortAppointments();

    return (
        <div className="Gochar">
            <div className="Gochar-main">
                <div className="Gochar-button">
                    <h3>Appointments</h3>
                </div>
                <div className="Gochar-button">
                    <h5>Plans</h5>
                </div>
                <div className="Gochar-box appointment-plan">
                    {notes?.length > 0 &&
                        notes.map((j) =>
                            j.plan.map((k) => (
                                <div className="Gochar-card" key={k._id}>
                                    <div className="Gochar-card-head">
                                        <h5>{k.plan}</h5>
                                        <div className="gochar-card-button">
                                            <p onClick={() => openModal(k)}>
                                                <MdEdit />
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gochar-card-box">
                                        <p>
                                            Price: <span>₹ {k.price}</span>
                                        </p>
                                        <p>
                                            Duration: <span>{k.duration} min</span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                </div>

                <div className="Gochar-button appointment-query">
                    <h5>Query</h5>
                    <div className="planet-filter">
                        <div className="group">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="search-icon">
                                <g>
                                    <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                                </g>
                            </svg>
                            <input
                                id="query"
                                className="input"
                                type="search"
                                placeholder="Search by name, email or transaction ID"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                    <div className="planet-filter">
                        <p>Filters:</p>
                        <select value={filterStatus} onChange={handleFilterChange}>
                            <option value="All">All</option>
                            <option value="Upcoming">Upcoming</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>

                {filteredAppointments.length > 0 && (
                    <div className="table-container">
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>S. No</th>
                                    <th>Date</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Amount</th>
                                    <th>Transaction ID</th>
                                    <th>Preferred Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAppointments.map((k, idx) => (
                                    <tr key={k._id}>
                                        <td>{idx + 1}</td>
                                        <td>{k.date}</td>
                                        <td>{k.name}</td>
                                        <td>{k.email}</td>
                                        <td>₹ {k.amount}</td>
                                        <td>{k.transactionId}</td>
                                        <td>{k.preferedTime}</td>
                                        <td>{k.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {modalOpen && (
                <AddItem
                    closeModal={() => setModalOpen(false)}
                    planData={selectedPlan}
                />
            )}
        </div>
    );
};

export default Appointments;