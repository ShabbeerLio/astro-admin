import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Gochar.css";
import AddItem from "../../Components/GocharItems/AddItem";
import { MdDelete, MdEdit } from "react-icons/md";
import NoteContext from "../../Context/NoteContext";

const Gochar = () => {
  const { notes, getDetails, deleteGochar } = useContext(NoteContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGochar, setSelectedGochar] = useState(null);
  const [filterPlanet, setFilterPlanet] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      getDetails();
    }
  }, [navigate]);

  const openModal = (gochar = null) => {
    setSelectedGochar(gochar);
    setModalOpen(true);
  };

  const deleteItems = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteGochar(id);
    }
  };

  // Get unique planet names
  const uniquePlanetNames = [
    "All",
    ...new Set(
      notes
        .flatMap((note) => note.gochar || [])
        .map((g) => g.planet_name)
    ),
  ];

  // Filtered Gochar Data
  const filteredGochar = notes
    .flatMap((note) => note.gochar || [])
    .filter((item) => filterPlanet === "All" || item.planet_name === filterPlanet);

  return (
    <div className="Gochar">
      <div className="Gochar-main">
        <div className="Gochar-button">
          <h3>Gochar</h3>
          <div className="planet-filter">
            <p>Select Planet:</p>
            <select
              id="planetFilter"
              value={filterPlanet}
              onChange={(e) => setFilterPlanet(e.target.value)}
            >
              {uniquePlanetNames.map((planet, index) => (
                <option key={index} value={planet}>
                  {planet}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => openModal()}>
            Add Gochar
          </button>
        </div>



        <div className="Gochar-box">
          {filteredGochar.length > 0 ? (
            filteredGochar.map((j) => (
              <div className="Gochar-card" key={j._id}>
                <div className="Gochar-card-head">
                  <h5>{j.planet_name}</h5>
                  <div className="gochar-card-button">
                    <p onClick={() => openModal(j)}><MdEdit /></p>
                    <p onClick={() => deleteItems(j._id)}><MdDelete /></p>
                  </div>
                </div>
                <div className="gochar-card-box">
                  <p>Rashi: <span>{j.rashi}</span></p>
                  <p>Nakshatra: <span>{j.nakshatra}</span></p>
                  <p>Pada: <span>{j.pada}</span></p>
                  <p>Combust: <span>{j.combust ? "Yes" : "No"}</span></p>
                  <p>Motion: <span>{j.motion}</span></p>
                  <p>Start Date: <span>{j.date_of_entry}</span></p>
                  <p>End Date: <span>{j.date_of_exit}</span></p>
                </div>
              </div>
            ))
          ) : (
            <p>No Gochar data found for the selected planet.</p>
          )}
        </div>
      </div>

      {modalOpen && <AddItem closeModal={() => setModalOpen(false)} gochar={selectedGochar} />}
    </div>
  );
};

export default Gochar;