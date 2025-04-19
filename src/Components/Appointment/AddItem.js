import React, { useContext, useEffect, useState } from "react";
import NoteContext from "../../Context/NoteContext";

const AddItem = ({ closeModal, planData }) => {
    // console.log(planData, "planData")
    const { addGochar, editPlan } = useContext(NoteContext);
    const [formData, setFormData] = useState({
        plan: "",
        price: "",
        slprice: "",
        duration: "",
    });

    useEffect(() => {
        if (planData) {
            setFormData(planData);
        } else {
            setFormData({
                plan: "",
                price: "",
                slprice: "",
                duration: "",
            });
        }
    }, [planData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (planData) {
            editPlan(planData._id, formData);
        } else {
            addGochar(formData);
        }
        closeModal();
    };

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
                        <label htmlFor="planet_name">Plan:</label>
                        <input type="text" name="plan"
                            value={formData.plan}
                            onChange={handleChange}
                            required />

                    </div>
                    <div className="frm-input-box">
                        <label htmlFor="rashi">Price:</label>
                        <input type="text" name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required />

                    </div>
                    <div className="frm-input-box">
                        <label htmlFor="slprice">Sales Price:</label>
                        <input type="text" name="slprice"
                            value={formData.slprice}
                            onChange={handleChange}
                            required />

                    </div>
                    <div className="frm-input-box">
                        <label htmlFor="pada">Duration (in min)</label>
                        <input type="text" name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            required />
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
