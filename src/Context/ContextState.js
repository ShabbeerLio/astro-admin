import react from "react";
import NoteContext from "./NoteContext";
import { useState } from "react";
import Host from "../Components/Host/Host";

const ContextState = (props) => {
  const notesData = [];

  const [notes, setNotes] = useState(notesData);

  // Get all gochar
  const getDetails = async () => {
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
        throw new Error("Failed to add Gochar");
      }

      const client = await response.json();
      setNotes((prevNotes) => [...prevNotes, client]);
      console.log("Gochar added successfully", "success");
    } catch (error) {
      console.error("Error adding Gochar:", error.message);
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

  const addLifeAspect = async (Life_aspect) => {
    try {
      const response = await fetch(`${Host}/api/admindetail/lifeaspect/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ life_aspect: [Life_aspect] }),
      });

      if (!response.ok) {
        throw new Error("Failed to add life_aspect");
      }

      const client = await response.json();
      setNotes((prevNotes) => [...prevNotes, client]);
      console.log("life_aspect added successfully", "success");
    } catch (error) {
      console.error("Error adding life_aspect:", error.message);
      // showAlert("Failed to add client", "error");
    }
  };

  // Edit Gochar entry
  const editLifeAspect = async (id, updatedLifeAspect) => {
    try {
      const response = await fetch(`${Host}/api/admindetail/lifeaspect/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(updatedLifeAspect),
      });

      if (!response.ok) throw new Error("Failed to update LifeAspect");
      const updatedClient = await response.json();
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === id ? updatedClient.client : note))
      );
    } catch (error) {
      console.log("error");
    }
  };

  // Delete Gochar entry
  const deleteLifeAspect = async (id) => {
    try {
      const response = await fetch(`${Host}/api/admindetail/lifeaspect/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.error || "Failed to delete LifeAspect ");
      }

      // const deletedClient = await response.json();
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
      console.log("LifeAspect deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting LifeAspect :", error.message);
      // showAlert("Failed to delete client", "error");
    }
  };

  // Edit API key
  const editApiKey = async (id, updatedKey) => {
    try {
      const response = await fetch(
        `${Host}/api/admindetail/apikey/edit/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ apiKey: updatedKey }),
        }
      );

      if (!response.ok) throw new Error("Failed to update API key");
      const data = await response.json();

      setNotes((prevKeys) =>
        prevKeys.map((key) =>
          key._id === id ? { ...key, apiKey: updatedKey } : key
        )
      );
    } catch (error) {
      console.error("Error updating API key:", error);
    }
  };

  // Appointment Plan
  // Edit Plan
  const editPlan = async (id, updatedplan) => {
    try {
      const response = await fetch(`${Host}/api/appointmentplan/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(updatedplan),
      });

      if (!response.ok) throw new Error("Failed to update Plan");
      const updatedClient = await response.json();
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === id ? updatedClient.client : note))
      );
    } catch (error) {
      console.log("error");
    }
  };

  // Remedy
  // Add Remedy Entry
  const addRemedy = async (Remedy) => {
    try {
      const response = await fetch(`${Host}/api/remedy/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ remedy: [Remedy] }),
      });

      if (!response.ok) {
        throw new Error("Failed to add Remedy");
      }

      const client = await response.json();
      setNotes((prevNotes) => [...prevNotes, client]);
      console.log("Remedy added successfully", "success");
    } catch (error) {
      console.error("Error adding Remedy:", error.message);
      // showAlert("Failed to add client", "error");
    }
  };

    // Edit remedy entry
    const editRemedy = async (id, updatedRemedy) => {
      try {
        const response = await fetch(`${Host}/api/remedy/edit/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(updatedRemedy),
        });
  
        if (!response.ok) throw new Error("Failed to update remedy");
        const updatedClient = await response.json();
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note._id === id ? updatedClient.client : note))
        );
      } catch (error) {
        console.log("error");
      }
    };
  
    // Delete remedy entry
    const deleteRemedy = async (id) => {
      try {
        const response = await fetch(`${Host}/api/remedy/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        });
  
        if (!response.ok) {
          const json = await response.json();
          throw new Error(json.error || "Failed to delete remedy ");
        }
  
        // const deletedClient = await response.json();
        setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
        console.log("remedy deleted successfully", "success");
      } catch (error) {
        console.error("Error deleting remedy :", error.message);
        // showAlert("Failed to delete client", "error");
      }
    };

  return (
    <NoteContext.Provider
      value={{
        notes,
        getDetails,
        addGochar,
        editGochar,
        deleteGochar,
        addLifeAspect,
        editLifeAspect,
        deleteLifeAspect,
        editApiKey,
        editPlan,
        addRemedy,
        editRemedy,
        deleteRemedy
      }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default ContextState;
