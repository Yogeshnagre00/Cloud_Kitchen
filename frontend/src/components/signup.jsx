import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useState } from "react";
import useAuth from "../hooks/useAuth";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    address: "",
  });
  
  const [error, setError] = useState({ message: "", fields: [] });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    // Required fields validation
    if (!form.name.trim()) errors.push("name");
    if (!form.email.trim()) errors.push("email");
    if (!form.mobile.trim()) errors.push("mobile");
    if (!form.password) errors.push("password");
    if (!form.confirmPassword) errors.push("confirmPassword");
    
    // Password match validation
    if (form.password !== form.confirmPassword) {
      return {
        valid: false,
        error: {
          message: "Passwords do not match",
          fields: ["password", "confirmPassword"]
        }
      };
    }
    
    if (errors.length > 0) {
      return {
        valid: false,
        error: {
          message: "Please fill all required fields",
          fields: errors
        }
      };
    }
    
    return { valid: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ message: "", fields: [] });

    const { valid, error: validationError } = validateForm();
    if (!valid) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const {...submitData } = form;

      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Signup failed");
      }

      // Store complete user data in auth context
      login(data.token, {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        mobile: data.user.mobile,
        address: data.user.address,
        // Add other profile fields as needed
      });

      // Redirect to profile page to complete additional info
      
    } catch (err) {
      console.error("Signup error:", err);
      setError({ 
        message: err.message,
        fields: [] 
      });
    } finally {
      setLoading(false);
    }
  };

  const isFieldError = (fieldName) => error.fields.includes(fieldName);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh" 
      px={2}
    >
      <Box
        width="100%"
        maxWidth={400}
        p={4}
        bgcolor="background.paper"
        borderRadius={2}
        boxShadow={3}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Create Account
        </Typography>

        {error.message && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Full Name *"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={isFieldError("name")}
            helperText={isFieldError("name") && "Name is required"}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email *"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={isFieldError("email")}
            helperText={isFieldError("email") && "Email is required"}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Mobile Number *"
            name="mobile"
            type="tel"
            value={form.mobile}
            onChange={handleChange}
            error={isFieldError("mobile")}
            helperText={isFieldError("mobile") && "Mobile number is required"}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            multiline
            rows={2}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password *"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={isFieldError("password")}
            helperText={isFieldError("password") && "Password is required"}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Confirm Password *"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={isFieldError("confirmPassword")}
            helperText={
              isFieldError("confirmPassword") && 
              (error.fields.includes("confirmPassword") ? 
                "Passwords must match" : "Please confirm your password")
            }
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 3, height: 48 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
          </Button>
        </form>
      </Box>
    </Box>
  );
}