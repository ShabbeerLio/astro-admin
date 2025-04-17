import React, { useContext, useEffect, useState } from "react";
import NoteContext from "../../Context/NoteContext";
import Host from "../Host/Host";
import "../../Pages/Remedy/Remedy.css"

const AddItem = ({ closeModal, planData }) => {
    // console.log(planData, "planData")
    const { addRemedy, editRemedy } = useContext(NoteContext);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        isGlobal: "",
        user: ""
    });

    useEffect(() => {
        if (planData) {
            setFormData(planData);
        } else {
            setFormData({
                title: "",
                message: "",
                isGlobal: "",
                user: ""
            });
        }
    }, [planData]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${Host}/api/auth/getallusers`, {
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
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "isGlobal") {
            const isGlobalValue = value === "true";
            setFormData((prev) => ({
                ...prev,
                isGlobal: value,
                user: isGlobalValue ? null : prev.user,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (planData) {
            editRemedy(planData._id, formData);
        } else {
            addRemedy(formData);
        }
        closeModal();
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    // Filtered users based on search query
    const filteredUsers = users.filter((user) => {
        const fullText = `${user.name} ${user.email}`.toLowerCase();
        return fullText.includes(searchQuery.toLowerCase());
    });

    return (
        <div className="modal-container">
            <div className="modal-body">
                <div className="modal-header">
                    <h3>{planData ? "Edit Plan" : "Add New Plan"}</h3>
                    <button className="close-btn" onClick={closeModal}>
                        ×
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="frm-input-box">
                        <label htmlFor="title">Title</label>
                        <input type="text" name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required />

                    </div>
                    <div className="frm-input-box">
                        <label htmlFor="message">message</label>
                        <input type="text" name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required />

                    </div>
                    <div className="frm-input-box">
                        <label htmlFor="isGlobal">Remedy For</label>
                        <select name="isGlobal" value={formData.isGlobal} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="true">Global</option>
                            <option value="false">User</option>
                        </select>

                    </div>
                    <div className="frm-input-box">
                        <label htmlFor="user">Select User</label>
                        {!formData.isGlobal || formData.isGlobal === "false" ? (
                            <div className="custom-dropdown">
                                <input
                                    type="text"
                                    placeholder="Search by name or email"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setShowDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // delay to allow click
                                />
                                {showDropdown && (
                                    <div className="search-menu">
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                                <div
                                                    key={user._id}
                                                    className="search-item"
                                                    onClick={() => {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            user: user._id,
                                                        }));
                                                        setSearchQuery(`${user.name}, ${user.email}`);
                                                        setShowDropdown(false);
                                                    }}
                                                >
                                                    {user.name}, {user.email}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="dropdown-item">No users found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <input
                                type="text"
                                disabled
                                placeholder="Select User in Remedy for"
                            />
                        )}
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {planData ? "Update" : "Add"}
                        </button>
                    </div>
                </form>
            </div>
            <div
                className="modal-backdrop"
                onClick={closeModal}
                style={{ background: "#c1c1c179" }}
            ></div>
        </div>
    );
};

export default AddItem;
