import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./components/footer";
import Header from "./components/header";
import Login from "./components/login";
import Profile from "./components/pfofile";
import Signup from "./components/signup";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/dashboard";
import ViewCart from "./pages/ViewCart";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/view-cart" element={<ViewCart />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
