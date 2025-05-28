import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, CircularProgress } from "@mui/material";
import useAuth from "../hooks/useAuth";


export default function Signup() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "",
    mobile: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Signup failed");

      login(data.token, {
        name: data.name,
        email: data.email,
        mobile: data.mobile
      });
      
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      p={2}
    >
      <Box width="100%" maxWidth={400}>
        <Typography variant="h4" align="center" gutterBottom>
          Create Account
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            name="name"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            required
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            required
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Mobile Number"
            name="mobile"
            type="tel"
            value={form.mobile}
            onChange={(e) => setForm({...form, mobile: e.target.value})}
            required
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            required
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 3, height: 48 }}
          >
            {loading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>
          
          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </form>
      </Box>
    </Box>
  );
}