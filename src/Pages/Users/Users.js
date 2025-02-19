// import React, { useEffect, useState } from "react";
// import Host from "../../Components/Host/Host";

// const Users = () => {
//   const API_BASE_URL = Host;
//   const [gochars, setGochars] = useState([]);
//   const [formData, setFormData] = useState({
//     planet_name: "",
//     rashi: "",
//     nakshatra: "",
//     pada: "",
//     combust: false,
//     motion: "direct",
//     date_of_entry: "",
//     date_of_exit: "",
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);

//   // Fetch all Gochar details
//   useEffect(() => {
//     fetchGochars();
//   }, []);

//   const fetchGochars = async () => {
//     try {
//       const response = await fetch.get(`${API_BASE_URL}/api/admindetail/all`);
//       setGochars(response.data[0]?.gochar || []);
//     } catch (error) {
//       console.error("Error fetching gochars:", error);
//     }
//   };

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   // Add or Edit Gochar Entry
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (isEditing) {
//         await fetch.put(`${API_BASE_URL}/api/admindetail/edit/${editId}`, formData, {
//           headers: { "auth-token": localStorage.getItem("token") },
//         });
//         // toast.success("Gochar updated successfully!");
//       } else {
//         await fetch.post(
//           `${API_BASE_URL}/add`,
//           { gochar: [formData] },
//           {
//             headers: { "auth-token": localStorage.getItem("token") },
//           }
//         );
//         // toast.success("Gochar added successfully!");
//       }
//       fetchGochars();
//       setModalOpen(false);
//       resetForm();
//     } catch (error) {
//       console.error("Error saving Gochar:", error);
//       // toast.error("Failed to save Gochar.");
//     }
//   };

//   // Open edit modal
//   const handleEdit = (gochar) => {
//     setFormData(gochar);
//     setEditId(gochar._id);
//     setIsEditing(true);
//     setModalOpen(true);
//   };

//   // Delete Gochar entry
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this entry?")) return;
//     try {
//       await fetch.delete(`${API_BASE_URL}/delete/${id}`, {
//         headers: { "auth-token": localStorage.getItem("token") },
//       });
//       // toast.success("Gochar deleted successfully!");
//       fetchGochars();
//     } catch (error) {
//       console.error("Error deleting Gochar:", error);
//       // toast.error("Failed to delete Gochar.");
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setFormData({
//       planet_name: "",
//       rashi: "",
//       nakshatra: "",
//       pada: "",
//       combust: false,
//       motion: "direct",
//       date_of_entry: "",
//       date_of_exit: "",
//     });
//     setIsEditing(false);
//     setEditId(null);
//   };

//   return (
//     <div className="container">
//       <h2>Gochar Manager</h2>
//       <button onClick={() => setModalOpen(true)}>Add New Gochar</button>

//       <table border="1">
//         <thead>
//           <tr>
//             <th>Planet Name</th>
//             <th>Rashi</th>
//             <th>Nakshatra</th>
//             <th>Pada</th>
//             <th>Combust</th>
//             <th>Motion</th>
//             <th>Date of Entry</th>
//             <th>Date of Exit</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {gochars.map((gochar) => (
//             <tr key={gochar._id}>
//               <td>{gochar.planet_name}</td>
//               <td>{gochar.rashi}</td>
//               <td>{gochar.nakshatra}</td>
//               <td>{gochar.pada}</td>
//               <td>{gochar.combust ? "Yes" : "No"}</td>
//               <td>{gochar.motion}</td>
//               <td>{gochar.date_of_entry}</td>
//               <td>{gochar.date_of_exit}</td>
//               <td>
//                 <button onClick={() => handleEdit(gochar)}>Edit</button>
//                 <button onClick={() => handleDelete(gochar._id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {modalOpen && (
//         <div className="modal">
//           <h3>{isEditing ? "Edit Gochar" : "Add New Gochar"}</h3>
//           <form onSubmit={handleSubmit}>
//             <input
//               type="text"
//               name="planet_name"
//               placeholder="Planet Name"
//               value={formData.planet_name}
//               onChange={handleChange}
//               required
//             />
//             <input
//               type="text"
//               name="rashi"
//               placeholder="Rashi"
//               value={formData.rashi}
//               onChange={handleChange}
//               required
//             />
//             <input
//               type="text"
//               name="nakshatra"
//               placeholder="Nakshatra"
//               value={formData.nakshatra}
//               onChange={handleChange}
//               required
//             />
//             <input
//               type="number"
//               name="pada"
//               placeholder="Pada"
//               value={formData.pada}
//               onChange={handleChange}
//               required
//             />
//             <label>
//               Combust:
//               <input
//                 type="checkbox"
//                 name="combust"
//                 checked={formData.combust}
//                 onChange={handleChange}
//               />
//             </label>
//             <select
//               name="motion"
//               value={formData.motion}
//               onChange={handleChange}
//               required
//             >
//               <option value="direct">Direct</option>
//               <option value="retrograde">Retrograde</option>
//             </select>
//             <input
//               type="date"
//               name="date_of_entry"
//               value={formData.date_of_entry}
//               onChange={handleChange}
//               required
//             />
//             <input
//               type="date"
//               name="date_of_exit"
//               value={formData.date_of_exit}
//               onChange={handleChange}
//               required
//             />
//             <button type="submit">{isEditing ? "Update" : "Add"}</button>
//             <button type="button" onClick={() => setModalOpen(false)}>
//               Cancel
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Users;
