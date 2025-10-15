import React, { useEffect, useState } from "react";
import Host from "../../Components/Host/Host";

const Subscription = () => {
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // "active" | "expired" | ""
  const [typeFilter, setTypeFilter] = useState(""); // "basic" | "free" | ""

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${Host}/api/auth/getallusers`, {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch users");

        const json = await response.json();
        setUsers(json.reverse());
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const filterUsers = () => {
    return users.filter((user) => {
      const sub = user.subscription || {};

      const matchesStatus =
        statusFilter === ""
          ? true
          : statusFilter === "Active"
          ? sub.status === "Active"
          : sub.status !== "Active";

      const matchesType =
        typeFilter === ""
          ? true
          : sub.plan?.toLowerCase() === typeFilter.toLowerCase();

      return matchesStatus && matchesType;
    });
  };

  

  return (
    <div className="Gochar">
      <div className="Gochar-main">
        <div className="Gochar-button">
          <h3>Users Subscription Detail ({filterUsers().length })</h3>
          <div className="planet-filter">
            <label htmlFor="status">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
          <div className="planet-filter">
            <label htmlFor="type">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Basic">Basic</option>
              <option value="Free">Free</option>
            </select>
          </div>
        </div>

        {/* Filter UI */}

        {/* Filtered User Cards */}
        <div className="Gochar-box">
          {filterUsers().length > 0 ? (
            filterUsers().map((j) => (
              <div className="Gochar-card" key={j._id}>
                <div className="Gochar-card-head">
                  <h5>{j.name}</h5>
                </div>
                <div className="gochar-card-box">
                  <p>
                    Type: <span>{j.subscription.plan}</span>
                  </p>
                  <p>
                    Status: <span>{j.subscription.status}</span>
                  </p>
                  <p>
                    Start:
                    <span>
                      {
                        new Date(j.subscription.startDate)
                          .toISOString()
                          .split("T")[0]
                      }
                    </span>
                  </p>
                  <p>
                    End:
                    <span>
                      {j.subscription.endDate
                        ? new Date(j.subscription.endDate)
                            .toISOString()
                            .split("T")[0]
                        : "-"}
                    </span>
                  </p>
                  <p>
                    TransactionId: <span>{j.subscription.transactionId}</span>
                  </p>
                  <p>
                    Payment Method: <span>{j.subscription.paymentMethod}</span>
                  </p>
                  <p>
                    Applied Coupon:
                    <span>{j.subscription?.appliedCoupon?.code}</span>
                  </p>
                  <p>
                    Discount:
                    <span>{j.subscription?.appliedCoupon?.discount}</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No users match the selected filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
