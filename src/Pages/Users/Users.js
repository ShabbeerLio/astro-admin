import React, { useEffect, useState } from "react";
import Host from "../../Components/Host/Host";
import "./Users.css";
import { MdDelete } from "react-icons/md";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const handleKundaliClick = async (userId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${Host}/api/detail/fetchuserdetails/${userId}`,
      {
        method: "GET",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      if (response.status === 404) {
        alert("Detail not found");
      } else {
        throw new Error("Failed to fetch user details");
      }
      return;
    }

    const queryParams = new URLSearchParams({
      token: token,
      userIds: userId,
    });
    window.location.href = `https://www.astronivesh.com/kundali.html?${queryParams.toString()}`;
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
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Delete failed");
    }
  };

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
                  <p onClick={() => deleteUser(j._id)}>
                    <MdDelete />
                  </p>
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
                    <p onClick={() => handleKundaliClick(j._id)}>Kundali</p>
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
