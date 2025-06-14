import React, { useContext, useEffect, useState } from "react";
import NoteContext from "../../Context/NoteContext";
import "./GorchaItem.css";

const AddItem = ({ closeModal, gochar }) => {
  const { addGochar, editGochar } = useContext(NoteContext);
  const [formData, setFormData] = useState({
    planet_name: "",
    rashi: "",
    nakshatra: "",
    pada: "",
    combust: false,
    motion: "direct",
    date_of_entry: "",
    date_of_exit: "",
  });

  const rashis = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  const nakshatras = [
    "Ashvini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "PurvaPhalguni", "UttaraPhalguni",
    "Hasta", "Chitra", "Svati", "Vishakha", "Anuradha", "Jyeshtha", "Mula",
    "PurvaShadha", "UttraShadha", "Sravana", "Dhanista", "Shatabhisha",
    "PurvaBhadra", "UttaraBhadra", "Revati"
  ];

  useEffect(() => {
    if (gochar) {
      setFormData(gochar);
    } else {
      setFormData({
        planet_name: "",
        rashi: "",
        nakshatra: "",
        pada: "",
        combust: false,
        motion: "direct",
        date_of_entry: "",
        date_of_exit: "",
      });
    }
  }, [gochar]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gochar) {
      editGochar(gochar._id, formData);
    } else {
      addGochar(formData);
    }
    closeModal();
  };

  return (
    <div className="modal-container">
      <div className="modal-body">
        <div className="modal-header">
          <h3>{gochar ? "Edit Gochar" : "Add New Gochar"}</h3>
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
              <option value="Uranus">Uranus</option>
            </select>
          </div>
          <div className="frm-input-box">
            <label htmlFor="rashi">Rashi:</label>
            <select
              name="rashi"
              value={formData.rashi}
              onChange={handleChange}
              required
            >
              <option value="">Select Rashi</option>
              {rashis.map((rashi) => (
                <option key={rashi} value={rashi}>
                  {rashi}
                </option>
              ))}
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
          <div className="frm-input-box">
            <label htmlFor="motion">Motion:</label>
            <select name="motion" value={formData.motion} onChange={handleChange}>
              <option value="direct">Direct</option>
              <option value="retrograde">Retrograde</option>
            </select>
          </div>
          <div className="frm-input-box">
            <label htmlFor="date_of_entry">Date of Entry:</label>
            <input
              type="date"
              name="date_of_entry"
              value={formData.date_of_entry}
              onChange={handleChange}
              required
            />
          </div>
          <div className="frm-input-box">
            <label htmlFor="date_of_exit">Date of Exit:</label>
            <input
              type="date"
              name="date_of_exit"
              value={formData.date_of_exit}
              onChange={handleChange}
              required
            />
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
              {gochar ? "Update" : "Add"}
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
