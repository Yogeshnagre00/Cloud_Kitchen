import React, { useState } from "react";
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
import { useLocation } from "react-router-dom";
import "./ViewCart.css";

const ViewCart = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user")); // Check if user is logged in
  const { cartItems, products } = location.state || {};

  const [formData, setFormData] = useState({
    name: user?.name || "",
    address: "",
    mobile: "",
    email: user?.email || "",
    password: "",
  });

  const [registerDuringCheckout, setRegisterDuringCheckout] = useState(true);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckboxChange = (e) => {
    setRegisterDuringCheckout(e.target.checked);
  };

  const totalPrice = products.reduce((acc, product) => {
    const qty = cartItems[product.id] || 0;
    return acc + product.price * qty;
  }, 0);

 const handleSubmit = () => {
  if (!user && registerDuringCheckout) {
    // Register first, then save order
    fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        address: formData.address,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }
        return res.json();
      })
      .then(async (data) => {
        if (data.token) {
          localStorage.setItem("user", JSON.stringify(data));
          alert("Registered successfully!");

          // Update user state if needed
          // Then save order
          await saveOrder();
        } else {
          alert(data.error || "Registration failed");
        }
      })
      .catch((err) => {
        console.error("Signup error:", err);
        alert("Signup failed: " + err.message);
      });
  } else {
    // User logged in or guest without registration
    saveOrder();
  }
};
const saveOrder = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token || ""}`, // if you use token auth
      },
      body: JSON.stringify({
        userId: user?.id || null, // or get user id from token/data
        cartItems,
        totalPrice,
        shippingDetails: {
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          address: formData.address,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    
    const data = await response.json();
    alert("Order placed successfully!");
    console.log("Order response:", data);
  } catch (error) {
    console.error("Order submission error:", error);
    alert("Failed to submit order: " + error.message);
  }
};

  if (!cartItems || Object.keys(cartItems).length === 0) {
    return (
      <Box p={4}>
        <Typography variant="h6">Your cart is empty.</Typography>
      </Box>
    );
  }

  return (
    <Box className="view-cart-container">
      <Typography variant="h4" className="view-cart-header">Your Cart</Typography>

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
                  <Typography>{product.name}</Typography>
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

      <Box className="cart-summary">
        <Typography variant="h6">Total Price: ₹{totalPrice}</Typography>

        <Box className="form-section">
          <Typography variant="h5">Your Details</Typography>

          <TextField
            fullWidth
            name="name"
            label="Full Name"
            margin="normal"
            value={formData.name}
            onChange={handleChange}
          />
            <TextField
              fullWidth
              name="mobile"
              label="Mobile Number"
              margin="normal"
              value={formData.mobile}
              onChange={handleChange}
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
                />
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={registerDuringCheckout}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Register during checkout"
              />
            </>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            Submit Order
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ViewCart;
