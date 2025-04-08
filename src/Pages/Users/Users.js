import React, { useEffect, useState } from "react";
import Host from "../../Components/Host/Host";
import "./Users.css"

const Users = () => {
    const [users, setUsers] = useState([]);
    const handleKundaliClick = (userId) => {
        const token = localStorage.getItem("token")

        const queryParams = new URLSearchParams({
            token: token,
            userIds: userId
        });

        window.location.href = `http://127.0.0.1:5502/kundali.html?${queryParams.toString()}`;
    };

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

    return (
        <div className="Gochar">
            <div className="Gochar-main">
                <div className="Gochar-button">
                    <h3>Users</h3>
                </div>
                <div className="Gochar-box">
                    {users &&
                        users.length > 0 &&
                        users?.map((j) => (
                            <div className="Gochar-card" key={j._id}>
                                <div className="Gochar-card-head">
                                    <h5>{j.name}</h5>
                                </div>
                                <div className="gochar-card-box">
                                    <p>
                                        Email: <span>{j.email}</span>
                                    </p>
                                    <p>
                                        DOB: <span>{j.dob}</span>
                                    </p>
                                    <p>
                                        Birth Time: <span>{j.birthtime}</span>
                                    </p>
                                    <p>
                                        Birthplace: <span>{j.birthplace}</span>
                                    </p>
                                    <p>
                                        Consonent: <span>{j.consonent}</span>
                                    </p>
                                    <p>
                                        Vowel: <span>{j.vowel}</span>
                                    </p>
                                    <div className="users-button">
                                        <p
                                            onClick={() => handleKundaliClick(j._id)}
                                        >
                                            Kundali
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Users;
