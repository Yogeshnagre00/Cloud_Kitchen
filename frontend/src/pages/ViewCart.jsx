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
      // Perform registration first
      fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem("user", JSON.stringify(data));
            alert("Registered successfully!");
            // Proceed to save order here...
          } else {
            alert(data.message || "Registration failed");
          }
        });
    } else {
      // Proceed to save order as guest or logged-in user
      console.log("Submitting Order:", formData, cartItems);
      alert("Order submitted!");
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
              name="Email"
              label="Email"
              type="email"
              margin="normal"
              value={formData.email}
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
