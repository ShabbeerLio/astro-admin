import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddItem from "../../Components/RemedyItem/AddItem";
import { MdDelete, MdEdit } from "react-icons/md";
import NoteContext from "../../Context/NoteContext";
import Host from "../../Components/Host/Host";
import "./Remedy.css"

const Remedy = () => {
  const { notes, getDetails, deleteRemedy } = useContext(NoteContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGochar, setSelectedGochar] = useState(null);
  const [filterUser, setFilterUser] = useState([]); // instead of {}

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      getDetails();
    }
  }, [navigate, getDetails]);

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
        setFilterUser(json);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const openModal = (remedy = null) => {
    setSelectedGochar(remedy);
    setModalOpen(true);
  };

  const deleteItems = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteRemedy(id);
    }
  };


  return (
    <div className="Gochar">
      <div className="Gochar-main">
        <div className="Gochar-button">
          <h3>Remedy</h3>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openModal()}
          >
            Add Remedy
          </button>
        </div>

        <h5 className="remedies-head">Global Remedies</h5>
        <div className="Gochar-box">
          {/* GLOBAL REMEDIES */}
          {notes.map((j) =>
            j?.remedy
              ?.filter((k) => k.isGlobal === true)
              .map((k) => (
                <div className="Gochar-card" key={k._id}>
                  <div className="Gochar-card-head">
                    <h5>Global</h5>
                    <div className="gochar-card-button">
                      <p onClick={() => openModal(k)}>
                        <MdEdit />
                      </p>
                      <p onClick={() => deleteItems(k._id)}>
                        <MdDelete />
                      </p>
                    </div>
                  </div>
                  <div className="gochar-card-box">
                    <p>
                      Title: <span>{k.title}</span>
                    </p>
                    <p>
                      Message: <span>{k.message}</span>
                    </p>
                  </div>
                </div>
              ))
          )}
          {/* USER REMEDIES */}
        </div>
        <h5 className="remedies-head">User Remedies</h5>
        <div className="Gochar-box">
          {notes.map((j) =>
            j?.remedy
              ?.filter((k) => !k.isGlobal)
              .map((k) => {
                const userName = filterUser.find((u) => u._id === k.user)?.name || "-";
                return (
                  <div className="Gochar-card" key={k._id}>
                    <div className="Gochar-card-head">
                      <h5>{userName}</h5>
                      <div className="gochar-card-button">
                        <p onClick={() => openModal(k)}>
                          <MdEdit />
                        </p>
                        <p onClick={() => deleteItems(k._id)}>
                          <MdDelete />
                        </p>
                      </div>
                    </div>
                    <div className="gochar-card-box">
                      <p>
                        Title: <span>{k.title}</span>
                      </p>
                      <p>
                        Message: <span>{k.message}</span>
                      </p>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>

      {modalOpen && (
        <AddItem
          closeModal={() => setModalOpen(false)}
          planData={selectedGochar}
        />
      )}
    </div>
  );
};

export default Remedy;
