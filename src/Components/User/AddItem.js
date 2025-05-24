import React, { useState, useEffect } from "react";
import Host from "../Host/Host";

const AddItem = ({ gochar, closeModal }) => {
  console.log(gochar, "gochar");
  const [formData, setFormData] = useState({
    dob: "",
    birthtime: "",
    birthplace: "",
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    if (gochar) {
      setFormData({
        dob: gochar.dob || "",
        birthtime: gochar.birthtime || "",
        birthplace: gochar.birthplace || "",
      });
    }
  }, [gochar]);

  const handlePlaceSelect = async (place) => {
    setFormData((prev) => ({ ...prev, birthplace: place.display_name }));
    setShowSuggestions(false);
    setLatitude(place.lat);
    setLongitude(place.lon);
  };

  const handleSearchLocation = async (query) => {
    if (!query) return;
    console.log(query, "query");
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json`
    );
    const data = await res.json();
    setSuggestions(data);
    setShowSuggestions(true);
  };

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (gochar.birthplace) {
        try {
          console.log(gochar.birthplace);
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${gochar.birthplace}&format=json`
          );
          const data = await res.json();
          console.log(data[0]);
          setLatitude(data[0].lat);
          setLongitude(data[0].lon);
        } catch (error) {
          console.error("Error fetching location data:", error);
        }
      }
    };

    fetchCoordinates();
  }, [gochar.birthplace]); // Run this effect when gochar.birthplace changes

  const convertTo24HourTime = (time12h) => {
    const match = time12h.match(/(\d+):(\d+) (\w+)/);
    if (!match) return null;
    let [_, hours, minutes, period] = match;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
    return { hours, minutes };
  };
  console.log(longitude, "longitude");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const updateRes = await fetch(
        `${Host}/api/auth/admin/edituser/${gochar._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!updateRes.ok) {
        const error = await updateRes.json();
        throw new Error(error.error || "Update failed");
      }

      const updatedUser = await updateRes.json();
      console.log(updatedUser, "updatedUser");
      if (updatedUser.success) {
        alert("Account Updated successfully", "success");
        // Save the auth token and redirect
        const data = formData;

        // api
        const apiRes = await fetch(`${Host}/api/admindetail/all`);
        const apiData = await apiRes.json();
        const apiKey = apiData[0]?.apiKey[0]?.apiKey;

        try {
          const birthtime = formData.birthtime;
          const location = formData.birthplace;
          const { hours, minutes } = convertTo24HourTime(birthtime) || {};
          const timeFormatted = `${String(hours).padStart(2, "0")}:${String(
            minutes
          ).padStart(2, "0")}`;
          const formattedDate = formData.dob.split("-").reverse().join("/");

          const baseUrl = "https://api.vedicastroapi.com/v3-json";
          const lat = latitude;
          console.log(longitude, "longitude");

          const lon = longitude;

          const params = {
            api_key: apiKey,
            dob: formattedDate,
            tob: timeFormatted,
            lat,
            lon,
            location,
            tz: 5.5,
            lang: "en",
            D1: "D1",
            D9: "D9",
          };

          console.log(params, "params");
          const horoscopeUrl = `${baseUrl}/horoscope/planet-details?dob=${params.dob}&tob=${params.tob}&lat=${params.lat}&lon=${params.lon}&tz=${params.tz}&api_key=${params.api_key}&lang=${params.lang}`;
          const horoscopeResponse = await fetch(horoscopeUrl);
          if (!horoscopeResponse.ok)
            throw new Error("Failed to fetch horoscope data.");
          const horoscopeData = await horoscopeResponse.json();
          // console.log(horoscopeData,"horoscopeData")

          const DashaUrl = `${baseUrl}/dashas/current-mahadasha?dob=${params.dob}&tob=${params.tob}&lat=${params.lat}&lon=${params.lon}&tz=${params.tz}&api_key=${params.api_key}&lang=${params.lang}`;
          const dashaResponse = await fetch(DashaUrl);
          if (!dashaResponse.ok) {
            throw new Error("Failed to fetch Dasha data.");
          }

          const DashaData = await dashaResponse.json();
          const dashas = DashaData.response.order_of_dashas || [];

          const chart1 = `${baseUrl}/horoscope/chart-image?dob=${params.dob}&tob=${params.tob}&lat=${params.lat}&lon=${params.lon}&tz=${params.tz}&div=${params.D1}&color=%23ff3366&style=north&api_key=${params.api_key}&lang=${params.lang}`;
          const response3 = await fetch(chart1);
          const chart1Url = await response3.text();
          const chart2 = `${baseUrl}/horoscope/chart-image?dob=${params.dob}&tob=${params.tob}&lat=${params.lat}&lon=${params.lon}&tz=${params.tz}&div=${params.D9}&color=%23ff3366&style=north&api_key=${params.api_key}&lang=${params.lang}`;
          const response4 = await fetch(chart2);
          const chart2Url = await response4.text();

          // maha dasha
          const mahaDasha = `${baseUrl}/dashas/maha-dasha?dob=${params.dob}&tob=${params.tob}&lat=${params.lat}&lon=${params.lon}&tz=${params.tz}&api_key=${params.api_key}&lang=${params.lang}`;
          const maharesponse = await fetch(mahaDasha);
          if (!maharesponse.ok)
            throw new Error("Failed to fetch maharesponse data.");
          const mahaDashaData = await maharesponse.json();

          // antar dasha
          const antarDasha = `${baseUrl}/dashas/antar-dasha?dob=${params.dob}&tob=${params.tob}&lat=${params.lat}&lon=${params.lon}&tz=${params.tz}&api_key=${params.api_key}&lang=${params.lang}`;
          const antarresponse = await fetch(antarDasha);
          if (!antarresponse.ok)
            throw new Error("Failed to fetch maharesponse data.");
          const antarDashaData = await antarresponse.json();

          // char dasha
          const charDasha = `${baseUrl}/dashas/char-dasha-main?dob=${params.dob}&tob=${params.tob}&lat=${params.lat}&lon=${params.lon}&tz=${params.tz}&api_key=${params.api_key}&lang=${params.lang}`;
          const charresponse = await fetch(charDasha);
          if (!charresponse.ok)
            throw new Error("Failed to fetch maharesponse data.");
          const charDashaData = await charresponse.json();

          // charsub dasha
          const charsubDasha = `${baseUrl}/dashas/char-dasha-sub?dob=${params.dob}&tob=${params.tob}&lat=${params.lat}&lon=${params.lon}&tz=${params.tz}&api_key=${params.api_key}&lang=${params.lang}`;
          const charsubresponse = await fetch(charsubDasha);
          if (!charsubresponse.ok)
            throw new Error("Failed to fetch maharesponse data.");
          const charsubDashaData = await charsubresponse.json();

          // yoginiDasha dasha
          const yoginiDasha = `${baseUrl}/dashas/yogini-dasha-main?dob=${params.dob}&tob=${params.tob}&lat=${params.lat}&lon=${params.lon}&tz=${params.tz}&api_key=${params.api_key}&lang=${params.lang}`;
          const yoginiresponse = await fetch(yoginiDasha);
          if (!yoginiresponse.ok)
            throw new Error("Failed to fetch maharesponse data.");
          const yoginiDashaData = await yoginiresponse.json();

          // yoginiDashasub dasha
          const yoginisubDasha = `${baseUrl}/dashas/yogini-dasha-sub?dob=${params.dob}&tob=${params.tob}&lat=${params.lat}&lon=${params.lon}&tz=${params.tz}&api_key=${params.api_key}&lang=${params.lang}`;
          const yoginisubresponse = await fetch(yoginisubDasha);
          if (!yoginisubresponse.ok)
            throw new Error("Failed to fetch maharesponse data.");
          const yoginisubDashaData = await yoginisubresponse.json();

          // char paryantarDasha
          const paryantarDasha = `${baseUrl}/dashas/paryantar-dasha?dob=${params.dob}&tob=${params.tob}&lat=${params.lat}&lon=${params.lon}&tz=${params.tz}&api_key=${params.api_key}&lang=${params.lang}`;
          const paryantarresponse = await fetch(paryantarDasha);
          if (!paryantarresponse.ok)
            throw new Error("Failed to fetch maharesponse data.");
          const paryantarDashaData = await paryantarresponse.json();

          let rashiData = {};

          try {
            const divisionalSelect =
              document.getElementById("divisional-select");
            const divisions = Array.from(divisionalSelect.options).map(
              (opt) => opt.value
            );

            for (const div of divisions) {
              const divisionalUrl = `${baseUrl}/horoscope/divisional-charts?dob=${params.dob}&tob=${params.tob}&lat=${params.lat}&lon=${params.lon}&tz=${params.tz}&div=${div}&api_key=${params.api_key}&lang=${params.lang}&response_type=planet_object`;

              try {
                const response = await fetch(divisionalUrl);
                if (!response.ok) {
                  console.warn(`Failed to fetch data for ${div}`);
                  continue; // Skip this division if there's an error
                }

                const horoscopeData = await response.json();
                if (horoscopeData && horoscopeData.response) {
                  const mapPlanetData = (data) => {
                    if (Array.isArray(data)) {
                      return data.map((planet) => ({
                        name: planet.full_name,
                        zodiac: planet.zodiac,
                        house: planet.house,
                        retro: planet.retro,
                        rasi_no: planet.rasi_no,
                        local_degree: planet.local_degree,
                      }));
                    } else if (typeof data === "object" && data !== null) {
                      return Object.values(data).map((planet) => ({
                        name: planet.full_name,
                        zodiac: planet.zodiac,
                        house: planet.house,
                        retro: planet.retro,
                        rasi_no: planet.rasi_no,
                        local_degree: planet.local_degree,
                      }));
                    } else {
                      console.error(`Unexpected data format for ${div}:`, data);
                      return [];
                    }
                  };

                  rashiData[div] = mapPlanetData(horoscopeData.response).slice(
                    0,
                    10
                  );
                } else {
                  console.warn(`Invalid or missing data for ${div}`);
                }
              } catch (error) {
                console.error(
                  `Error fetching horoscope data for ${div}:`,
                  error
                );
              }
            }
          } catch (error) {
            console.log("error");
          }
          const horoData = await fetch(
            `${Host}/api/detail/editdetail/${gochar._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
              },
              body: JSON.stringify({
                step: "horoscope",
                horoscopeData,
              }),
            }
          );

          const dashaData = await fetch(
            `${Host}/api/detail/editdetail/${gochar._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
              },
              body: JSON.stringify({
                step: "dashas",
                dashas,
                mahaDashaData,
                antarDashaData,
                charDashaData,
                charsubDashaData,
                yoginiDashaData,
                yoginisubDashaData,
                paryantarDashaData,
              }),
            }
          );

          const cartData = await fetch(
            `${Host}/api/detail/editdetail/${gochar._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
              },
              body: JSON.stringify({
                step: "rashi",
                rashiData,
                chart1Url,
                chart2Url,
              }),
            }
          );

          const result = await horoData.json();
          const result2 = await dashaData.json();
          const result3 = await cartData.json();
          console.log(result);
          console.log(result2);
          console.log(result3);
        } catch (error) {
          console.log(error, "error");
        }
      } else {
        alert("Invalid Details", "danger");
      }
      alert("User updated successfully");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-body">
        <div className="modal-header">
          <h3>{gochar ? "Edit User" : "Add User"}</h3>
          <button className="close-btn" onClick={closeModal}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="frm-input-box">
            <label htmlFor="nakshatra">Date of birth:</label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
            />
          </div>
          <div className="frm-input-box">
            <label htmlFor="nakshatra">Birth Time:</label>
            <input
              type="text"
              placeholder="hh:mm AM/PM"
              value={formData.birthtime}
              onChange={(e) =>
                setFormData({ ...formData, birthtime: e.target.value })
              }
            />
          </div>
          <div
            className="frm-input-box birthplace-autocomplete"
            style={{ position: "relative" }}
          >
            <label>Birth Place</label>
            <input
              type="text"
              value={formData.birthplace}
              onChange={(e) => {
                setFormData({ ...formData, birthplace: e.target.value });
                handleSearchLocation(e.target.value);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  maxHeight: "150px",
                  overflowY: "auto",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  zIndex: 10,
                  listStyle: "none",
                  margin: 0,
                  padding: "5px 0",
                }}
              >
                {suggestions.map((sug, i) => (
                  <li
                    key={i}
                    onClick={() => handlePlaceSelect(sug)}
                    style={{
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    {sug.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn-primary" type="submit">
              Save
            </button>
            <button className="btn-primary" type="button" onClick={closeModal}>
              Cancel
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
