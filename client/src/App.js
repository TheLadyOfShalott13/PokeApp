import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "./authContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Home";
import View from "./pages/View";

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
          <Route path="/"           element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
          <Route path="/view/:id"           element={<ProtectedRoute><View /></ProtectedRoute>} />
          <Route path="/login"      element={<Login />} />
          <Route path="/register"   element={<Register />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
