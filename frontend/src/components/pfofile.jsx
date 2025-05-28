import { Box, Typography, Button, Avatar } from "@mui/material";

import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Avatar 
          src={user?.avatar} 
          sx={{ width: 64, height: 64, mr: 3 }}
        >
          {user?.name?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h6">{user?.name}</Typography>
          <Typography variant="body1" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Contact Information
        </Typography>
        <Typography>Email: {user?.email}</Typography>
        <Typography>Mobile: {user?.mobile || "Not provided"}</Typography>
      </Box>
      
      <Button
        variant="contained"
        color="error"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>
  );
}