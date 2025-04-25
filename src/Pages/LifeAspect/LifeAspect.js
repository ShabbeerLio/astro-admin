import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddItem from "../../Components/LifeAspectItem/AddItem";
import { MdDelete, MdEdit } from "react-icons/md";
import NoteContext from "../../Context/NoteContext";

const LifeAspect = () => {
  const { notes, getDetails, deleteLifeAspect } = useContext(NoteContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGochar, setSelectedGochar] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState(""); // Planet filter
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 80;
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      getDetails();
    }
  }, [navigate]);

  const openModal = (life_aspect = null) => {
    setSelectedGochar(life_aspect);
    setModalOpen(true);
  };

  const deleteItems = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteLifeAspect(id);
    }
  };

  // Extract unique planets for dropdown
  const planetOptions = [
    ...new Set(notes.flatMap((note) => note.life_aspect?.map((j) => j.planet_name) || [])),
  ];

  // Filter data based on selected planet
  const filteredData = notes.flatMap((note) =>
    note.life_aspect?.filter((j) => (selectedPlanet ? j.planet_name === selectedPlanet : true)) || []
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="Gochar">
      <div className="Gochar-main">
        <div className="Gochar-button">
          <h3>LifeAspect</h3>
        <div className="planet-filter">
          <p>Select Planet:</p>
          <select value={selectedPlanet} onChange={(e) => setSelectedPlanet(e.target.value)}>
            <option value="">All</option>
            {planetOptions.map((planet, index) => (
              <option key={index} value={planet}>
                {planet}
              </option>
            ))}
          </select>
        </div>
          <button type="button" className="btn btn-primary" onClick={() => openModal()}>
            Add LifeAspect
          </button>
        </div>

        <div className="Gochar-box">
          {paginatedData.length > 0 ? (
            paginatedData.map((j) => (
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
                  <p>
                    Results: <span>{j.results}</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No data available.</p>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </button>
          </div>
        )}
      </div>

      {modalOpen && <AddItem closeModal={() => setModalOpen(false)} life_aspect={selectedGochar} />}
    </div>
  );
};

export default LifeAspect;