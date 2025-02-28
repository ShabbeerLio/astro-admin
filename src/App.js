import "./App.css";
import Sidenav from "./Components/Sidenav/Sidenav";
import Topbar from "./Components/Sidenav/Topbar";
import ContextState from "./Context/ContextState";
import Gochar from "./Pages/Gochar/Gochar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Users from "./Pages/Users/Users";
import ApiChange from "./Pages/Api/ApiChange";

function App() {
  return (
    <ContextState>
      <Router>
        <div className="App">
          <Sidenav />
          <div className="content">
            <Topbar />
            {/* <Topbar setIsSidebar={setIsSidebar} /> */}
            {/* <Alert alert={alert} /> */}
            <Routes>
              <Route path="/" exact element={<Gochar />} />
              <Route path="/gochar" exact element={<Gochar />} />
              <Route path="/login" exact element={<Login />} />
              <Route path="/users" exact element={<Users />} />
              <Route path="/apiupdate" exact element={<ApiChange />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ContextState>
  );
}

export default App;
