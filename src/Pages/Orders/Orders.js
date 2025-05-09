import React, { useEffect, useState } from "react";
import Host from "../../Components/Host/Host";
import { MdDelete } from "react-icons/md";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${Host}/api/order/all`);
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  // Apply filter & search
  useEffect(() => {
    let filtered = [...orders];

    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (order) => (order.status || "Pending") === statusFilter
      );
    }

    if (searchTerm.trim() !== "") {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order._id.toLowerCase().includes(lowerTerm) ||
          order.userId?.name?.toLowerCase().includes(lowerTerm) ||
          order.userId?.email?.toLowerCase().includes(lowerTerm)
      );
    }

    setFilteredOrders(filtered);
  }, [statusFilter, searchTerm, orders]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${Host}/api/order/update-status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchOrders(); // Refresh orders
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`${Host}/api/order/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchOrders(); // Refresh orders
      }
    } catch (err) {
      console.error("Failed to delete order:", err);
    }
  };

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="Gochar">
      <div className="Gochar-button">
        <h3>Orders</h3>
        <div className="planet-filter">
          <div className="group">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="search-icon">
              <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
              </g>
            </svg>
            <input
              id="query"
              className="input"
              type="search"
              placeholder="Search by User, email or Order Id"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="planet-filter">
          <p>Status:</p>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Order Amount</th>
              <th>Status</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan="6">No orders found.</td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>
                    {order.userId?.name || "Unknown"}
                    <br />
                    <small>{order.userId?.email}</small>
                  </td>
                  <td>₹{order.totalAmount}</td>
                  <td>₹{order.orderAmount}</td>
                  <td>{order.status || "Pending"}</td>
                  <td>
                    {order.items.map((item, idx) => (
                      <div key={idx}>
                        {item.title} x {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="product-action">
                    <div className="frm-input-box">
                      <select
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                        defaultValue={order.status || "Pending"}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                    <p onClick={() => deleteOrder(order._id)}>
                      <MdDelete />
                    </p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
