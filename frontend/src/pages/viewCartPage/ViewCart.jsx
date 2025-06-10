import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./viewCart.css";

const ViewCart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, user: authUser } = useAuth();


  // Initialize user from auth context first, then fallback to localStorage
  const [user, setUser] = useState(() => {
    return authUser || JSON.parse(localStorage.getItem("user")) || null;
  });

  const { cartItems = {}, products = [] } = location.state || {};

  const [formData, setFormData] = useState({
    // Initialize formData with user data if available
    name: "",
    address: "",
    mobile: "",
    email: "",
    password: "",
  });

  const [registerDuringCheckout, setRegisterDuringCheckout] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [generalError, setGeneralError] = useState("");

  // Sync form with user data when authUser changes
  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setFormData({
        name: authUser.name || "",
        email: authUser.email || "",
        mobile: authUser.mobile || "",
        address: authUser.address || "",   
        password: "", // Never autofill password
      });
    }
  }, [authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (e) => {
    setRegisterDuringCheckout(e.target.checked);
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = ["name", "mobile", "address", "email"];

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        errors[field] = "This field is required";
      }
    });

    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      errors.mobile = "Invalid mobile number";
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Invalid email address";
    }

    if (registerDuringCheckout && !user && !formData.password) {
      errors.password = "Password is required for registration";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const totalPrice = products.reduce((acc, product) => {
    const qty = cartItems[product.id] || 0;
    return acc + product.price * qty;
  }, 0);

  const registerUser = async () => {
    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        address: formData.address,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    if (data.token) {
      // Update both local state and auth context
      localStorage.setItem("user", JSON.stringify(data));
      login(data.token, {
        id: data.id,
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        address: data.address,
      });
      setUser(data);
    } else {
      throw new Error(data.error || "Registration failed");
    }
  };

  const saveOrder = async () => {
    const items = products
      .filter((product) => cartItems[product.id])
      .map((product) => ({
        id: product.id,
        name: product.name,
        qty: cartItems[product.id],
      }));

    const orderPayload = {
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      address: formData.address,
      items,
      total_price: totalPrice,
      user_id: user?.id || null,
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Order failed");

      setOrderPlaced(true);
      setOrderDetails({
        ...orderPayload,
        orderId: data.orderId || Date.now().toString(),
      });
    } catch (error) {
      console.error("Order Error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setGeneralError("");

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      if (!user && registerDuringCheckout) {
        await registerUser();
        setFormData((prev) => ({ ...prev, password: "" }));
      }
      await saveOrder();
    } catch (error) {
      setGeneralError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  if (orderPlaced && orderDetails) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          🎉 Order Placed Successfully!
        </Typography>
        <Typography variant="h6" gutterBottom>
          Thank you, {orderDetails.name}!
        </Typography>
        <Typography variant="body1">
          Order ID: {orderDetails.orderId}
        </Typography>
        <Typography variant="body1">
          Total: ₹{orderDetails.total_price}
        </Typography>

        <Box mt={3}>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Ordered Items:</strong>
          </Typography>
          {orderDetails.items.map((item, index) => (
            <Typography key={index}>
              • {item.name} × {item.qty}
            </Typography>
          ))}
        </Box>

        <Box mt={5}>
          <Button variant="contained" color="primary" onClick={goToDashboard}>
            Go to Dashboard
          </Button>
        </Box>
      </Box>
    );
  }

  if (!cartItems || Object.keys(cartItems).length === 0) {
    return (
      <Box p={4}>
        <Typography variant="h6">Your cart is empty.</Typography>
        <Button variant="contained" onClick={() => navigate("/dashboard")}>
          Browse Products
        </Button>
      </Box>
    );
  }

  return (
    <Box className="view-cart-container" sx={{ p: 3 }}>
      <Typography variant="h4" className="view-cart-header" sx={{ mb: 3 }}>
        Your Cart
      </Typography>

      <Grid container spacing={2}>
        {products
          .filter((product) => cartItems[product.id])
          .map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card className="cart-item-card">
                <CardMedia
                  component="img"
                  image={`http://localhost:5000${product.image}`}
                  alt={product.name}
                  height="140"
                />
                <CardContent>
                  <Typography variant="subtitle1">{product.name}</Typography>
                  <Typography>Price: ₹{product.price}</Typography>
                  <Typography>Qty: {cartItems[product.id]}</Typography>
                  <Typography>
                    Total: ₹{product.price * cartItems[product.id]}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      <Box className="cart-summary" sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Total Price: ₹{totalPrice}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} className="form-section">
          <Typography variant="h5" sx={{ mb: 2 }}>
            {user ? "Delivery Details" : "Your Information"}
          </Typography>

          {generalError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {generalError}
            </Typography>
          )}

          <TextField
            fullWidth
            name="name"
            label="Full Name"
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
            required
          />
          <TextField
            fullWidth
            name="mobile"
            label="Mobile Number"
            margin="normal"
            value={formData.mobile}
            onChange={handleChange}
            error={!!formErrors.mobile}
            helperText={formErrors.mobile}
            required
          />
          <TextField
            fullWidth
            name="address"
            label="Address"
            margin="normal"
            multiline
            rows={3}
            value={formData.address}
            onChange={handleChange}
            error={!!formErrors.address}
            helperText={formErrors.address}
            required
          />

          {!user && (
            <>
              <TextField
                fullWidth
                name="email"
                label="Email"
                margin="normal"
                value={formData.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                required
              />
              {registerDuringCheckout && (
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  margin="normal"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                  required={registerDuringCheckout}
                />
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={registerDuringCheckout}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Create an account for faster checkout next time"
              />
            </>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ mt: 2 }}
            fullWidth
            size="large"
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ViewCart;