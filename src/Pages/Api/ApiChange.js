import React, { useContext, useEffect, useState } from "react";
import NoteContext from "../../Context/NoteContext";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaCheck, FaTimes } from "react-icons/fa";
import "./ApiChange.css"

const ApiChange = () => {
    const { notes, getDetails, editApiKey } = useContext(NoteContext);
    const [editingId, setEditingId] = useState(null);
    const [updatedApiKey, setUpdatedApiKey] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        } else {
            getDetails();
        }
    }, [navigate]);
    const handleEditClick = (key) => {
        setEditingId(key._id);
        setUpdatedApiKey(key.apiKey);
    };

    const handleUpdate = async (id) => {
        await editApiKey(id, updatedApiKey);
        setEditingId(null);
    };
    const handleCancel = () => {
        setEditingId(null);
        setUpdatedApiKey(""); // Reset input value
    };

    return (
        <div className="Gochar">
            <div className="Gochar-main">
                <div className="Gochar-button">
                    <h3>API KEY</h3>
                </div>
                {notes &&
                    notes.length > 0 &&
                    notes?.map((note) =>
                        note.apiKey?.map((key) => (
                            <div className="apikey-box" key={key._id} >
                                {editingId === key._id ? (
                                    <input
                                        type="text"
                                        value={updatedApiKey}
                                        onChange={(e) => setUpdatedApiKey(e.target.value)}
                                        autoFocus
                                    />
                                ) : (
                                    <p>{key.apiKey}</p>
                                )}

                                {editingId === key._id ? (
                                   <div>
                                   <button onClick={() => handleUpdate(key._id)} className="save-btn">
                                       <FaCheck />
                                   </button>
                                   <button onClick={handleCancel} className="cancel-btn">
                                       <FaTimes />
                                   </button>
                               </div>
                                ) : (
                                    <button onClick={() => handleEditClick(key)}><MdEdit /> Edit</button>
                                )}
                            </div>
                        ))
                    )}
            </div>
        </div>
    );
};

export default ApiChange;
