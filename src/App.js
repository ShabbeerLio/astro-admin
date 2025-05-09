import "./App.css";
import Sidenav from "./Components/Sidenav/Sidenav";
import Topbar from "./Components/Sidenav/Topbar";
import ContextState from "./Context/ContextState";
import Gochar from "./Pages/Gochar/Gochar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Users from "./Pages/Users/Users";
import ApiChange from "./Pages/Api/ApiChange";
import LifeAspect from "./Pages/LifeAspect/LifeAspect";
import Subscription from "./Pages/Subscription/Subscription";
import Appointments from "./Pages/Appointments/Appointments";
import Remedy from "./Pages/Remedy/Remedy";
import DeleteRequest from "./Pages/Delete Request/DeleteRequest";
import Products from "./Pages/Products/Products";
import AddItem from "./Pages/Products/AddItem";
import EditProductWrapper from "./Pages/Products/EditItem";
import Orders from "./Pages/Orders/Orders";

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
              <Route path="/lifeaspect" exact element={<LifeAspect />} />
              <Route path="/login" exact element={<Login />} />
              <Route path="/users" exact element={<Users />} />
              <Route path="/subscription" exact element={<Subscription />} />
              <Route path="/appointments" exact element={<Appointments />} />
              <Route path="/remedy" exact element={<Remedy />} />
              <Route path="/apiupdate" exact element={<ApiChange />} />
              <Route path="/delete-request" exact element={<DeleteRequest />} />
              <Route path="/products" exact element={<Products />} />
              <Route path="/products/add" exact element={<AddItem/>} />
              <Route path="/products/edit/:id" exact element={<EditProductWrapper />} />
              <Route path="/orders" exact element={<Orders />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ContextState>
  );
}

export default App;
