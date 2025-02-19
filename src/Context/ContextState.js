import react from "react";
import NoteContext from "./NoteContext";
import { useState } from "react";
import Host from "../Components/Host/Host";

const ContextState = (props) => {
  const notesData = [];

  const [notes, setNotes] = useState(notesData);

  // ................................. gochar.......................................//
  // Get all gochar
  const getGochar = async () => {
    const response = await fetch(`${Host}/api/admindetail/all`, {
      method: "GET",
    });
    const json = await response.json();
    setNotes(json);
  };

  //add gochar
  const addGochar = async (Gochar) => {
    try {
      const response = await fetch(`${Host}/api/admindetail/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ gochar: [Gochar] }),
      });

      if (!response.ok) {
        throw new Error("Failed to add client");
      }

      const client = await response.json();
      setNotes((prevNotes) => [...prevNotes, client]);
      console.log("Client added successfully", "success");
    } catch (error) {
      console.error("Error adding client:", error.message);
      // showAlert("Failed to add client", "error");
    }
  };

  // Edit Gochar entry
  const editGochar = async (id, updatedGochar) => {
    try {
      const response = await fetch(`${Host}/api/admindetail/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(updatedGochar),
      });

      if (!response.ok) throw new Error("Failed to update Gochar");
      const updatedClient = await response.json();
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === id ? updatedClient.client : note))
      );
    } catch (error) {
      console.log("error");
    }
  };

  // Delete Gochar entry
  const deleteGochar = async (id) => {
    try {
      const response = await fetch(`${Host}/api/admindetail/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.error || "Failed to delete gochar ");
      }

      const deletedClient = await response.json();
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
      console.log("gochar deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting gochar :", error.message);
      // showAlert("Failed to delete client", "error");
    }
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        getGochar,
        addGochar,
        editGochar,
        deleteGochar,
      }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default ContextState;
