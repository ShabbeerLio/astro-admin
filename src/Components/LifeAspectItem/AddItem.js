import React, { useContext, useEffect, useState } from "react";
import NoteContext from "../../Context/NoteContext";

const AddItem = ({ closeModal, life_aspect }) => {
  const { addLifeAspect, editLifeAspect } = useContext(NoteContext);
  const [formData, setFormData] = useState({
    planet_name: "",
    nakshatra: "",
    pada: "",
    combust: false,
    motion: "direct",
  });

  const nakshatras = [
    "Ashvini",
    "Bharani",
    "Krittika",
    "Rohini",
    "Mrigashira",
    "Ardra",
    "Punarvasu",
    "Pushya",
    "Ashlesha",
    "Magha",
    "Purva Phalguni",
    "UttaraPhalguni",
    "Hasta",
    "Chitra",
    "Svati",
    "Vishakha",
    "Anuradha",
    "Jyeshtha",
    "Mula",
    "PurvaShadha",
    "Uttara Ashadha",
    "Sravana",
    "Dhanista",
    "Shatabhisaj",
    "Purva Bhadrapada",
    "UttaraBhadra",
    "Revati",
  ];

  useEffect(() => {
    if (life_aspect) {
      setFormData(life_aspect);
    } else {
      setFormData({
        planet_name: "",
        nakshatra: "",
        pada: "",
        combust: false,
        motion: "direct",
      });
    }
  }, [life_aspect]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (life_aspect) {
      editLifeAspect(life_aspect._id, formData);
    } else {
      addLifeAspect(formData);
    }
    closeModal();
  };

  return (
    <div className="modal-container">
      <div className="modal-body">
        <div className="modal-header">
          <h3>{life_aspect ? "Edit Life Aspect" : "Add New Life Aspect"}</h3>
          <button className="close-btn" onClick={closeModal}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="frm-input-box">
            <label htmlFor="planet_name">Planet:</label>
            <select
              name="planet_name"
              value={formData.planet_name}
              onChange={handleChange}
              required
            >
              <option value="">Select Planet</option>
              <option value="Sun">Sun</option>
              <option value="Moon">Moon</option>
              <option value="Mars">Mars</option>
              <option value="Mercury">Mercury</option>
              <option value="Jupiter">Jupiter</option>
              <option value="Venus">Venus</option>
              <option value="Saturn">Saturn</option>
              <option value="Rahu">Rahu</option>
              <option value="Ketu">Ketu</option>
            </select>
          </div>
          <div className="frm-input-box">
            <label htmlFor="nakshatra">Nakshatra:</label>
            <select
              name="nakshatra"
              value={formData.nakshatra}
              onChange={handleChange}
              required
            >
              <option value="">Select Nakshatra</option>
              {nakshatras.map((nakshatra) => (
                <option key={nakshatra} value={nakshatra}>
                  {nakshatra}
                </option>
              ))}
            </select>
          </div>
          <div className="frm-input-box">
            <label htmlFor="pada">Pada:</label>
            <select
              name="pada"
              value={formData.pada}
              onChange={handleChange}
              required
            >
              <option value="">Select Pada</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>

          <div className="frm-input-box">
            <label htmlFor="motion">Motion:</label>
            <select
              name="motion"
              value={formData.motion}
              onChange={handleChange}
            >
              <option value="direct">Direct</option>
              <option value="retrograde">Retrograde</option>
            </select>
          </div>
          <div className="frm-input-box">
            <label>
              Combust:
              <input
                type="checkbox"
                name="combust"
                checked={formData.combust}
                onChange={handleChange}
              />
            </label>
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
              {life_aspect ? "Update" : "Add"}
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
