<<<<<<< HEAD

=======
>>>>>>> 0cca3db4d70e4b7559b5429ce182a00babd1f8d2
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/footer";
import Header from "./components/header";
import Login from "./components/login";
import Signup from "./components/signup";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/dashboardPage/dashboard";
import ViewCart from "./pages/viewCartPage/ViewCart";
//import AdminOrders from "./pages/adminOrdersPage/adminOrder";
import Profile from "./components/profile";

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
          {/* <Route path="/admin/orders" element={<AdminOrders />} /> */}
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;