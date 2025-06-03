import { Box, Typography, Button, Avatar, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useState} from "react";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State for editable profile fields
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    address: user?.address || "",
    dob: user?.dob || "",
  });

  const [editing, setEditing] = useState(false);

  const handleChange = (e) => {
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSave = () => {
    // TODO: Update this with backend API call to save profileData
    console.log("Updated profile data:", profileData);
    alert("Profile updated!");
    setEditing(false);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Avatar sx={{ width: 64, height: 64, mr: 3 }}>
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
          Personal Information
        </Typography>

        <TextField
          fullWidth
          label="Full Name"
          name="name"
          margin="normal"
          value={profileData.name}
          onChange={handleChange}
          disabled={!editing}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          margin="normal"
          value={profileData.email}
          onChange={handleChange}
          disabled
        />
        <TextField
          fullWidth
          label="Mobile Number"
          name="mobile"
          margin="normal"
          value={profileData.mobile}
          onChange={handleChange}
          disabled={!editing}
        />
        <TextField
          fullWidth
          label="Address"
          name="address"
          margin="normal"
          multiline
          rows={2}
          value={profileData.address}
          onChange={handleChange}
          disabled={!editing}
        />
        <TextField
          fullWidth
          label="Date of Birth"
          name="dob"
          type="date"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={profileData.dob}
          onChange={handleChange}
          disabled={!editing}
        />
      </Box>

      {editing ? (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </Button>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );
}
