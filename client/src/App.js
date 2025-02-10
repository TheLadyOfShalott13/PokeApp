import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "./authContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Home";
import Favorites from "./pages/user/Favorites";

//Import modules
//import action from "./pages/request/moduleName";

function App() {

  const { user } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Login title="Login to Save Your Favorite Pokemons" />;
    } else {
      return children;
    }
  };

  return (
      <BrowserRouter>
        <Routes>

          <Route path="/favorites" element={<Favorites />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

        </Routes>
      </BrowserRouter>
  );
}

export default App;
