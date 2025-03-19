import React, { useEffect, useState } from "react";
import Host from "../../Components/Host/Host";

const Subscription = () => {
  const [users, setUsers] = useState([]);
  console.log(users, "users");

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

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const json = await response.json();
        setUsers(json);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="Gochar">
      <div className="Gochar-main">
        <div className="Gochar-button">
          <h3>Users Subscription Detail</h3>
        </div>
        <div className="Gochar-box">
          {users &&
            users.length > 0 &&
            users?.map((j) => (
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
                  {/* <div className="users-button">
                    <p>Kundali</p>
                  </div> */}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
