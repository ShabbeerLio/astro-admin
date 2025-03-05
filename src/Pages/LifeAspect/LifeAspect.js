import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddItem from "../../Components/LifeAspectItem/AddItem";
import { MdDelete, MdEdit } from "react-icons/md";
import NoteContext from "../../Context/NoteContext";

const LifeAspect = () => {
  const { notes, getGochar, deleteLifeAspect } = useContext(NoteContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGochar, setSelectedGochar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      getGochar();
    }
  }, [navigate, getGochar]);

  const openModal = (life_aspect = null) => {
    setSelectedGochar(life_aspect);
    setModalOpen(true);
  };

  const deleteItems = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
        deleteLifeAspect(id);
    }
  };
  return (
    <div className="Gochar">
      <div className="Gochar-main">
        <div className="Gochar-button">
          <h3>LifeAspect</h3>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openModal()}
          >
            Add LifeAspect
          </button>
        </div>

        <div className="Gochar-box">
          {notes &&
            notes.length > 0 &&
            notes?.map((note) =>
              note.life_aspect?.map((j) => (
                <div className="Gochar-card" key={j._id}>
                  <div className="Gochar-card-head">
                    <h5>{j.planet_name}</h5>
                    <div className="gochar-card-button">
                      <p onClick={() => openModal(j)}>
                        <MdEdit />
                      </p>
                      <p onClick={() => deleteItems(j._id)}>
                        <MdDelete />
                      </p>
                    </div>
                  </div>
                  <div className="gochar-card-box">
                    <p>
                      Nakshatra: <span>{j.nakshatra}</span>
                    </p>
                    <p>
                      Pada: <span>{j.pada}</span>
                    </p>
                    <p>
                      Combust: <span>{j.combust ? "Yes" : "No"}</span>
                    </p>
                    <p>
                      Motion: <span>{j.motion}</span>
                    </p>
                  </div>
                </div>
              ))
            )}
        </div>
      </div>

      {modalOpen && (
        <AddItem
          closeModal={() => setModalOpen(false)}
          life_aspect={selectedGochar}
        />
      )}
    </div>
  );
};
export default LifeAspect;
