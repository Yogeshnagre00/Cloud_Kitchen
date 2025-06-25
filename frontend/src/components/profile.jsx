import { 
  Box, 
  Typography, 
  Button, 
  Avatar, 
  TextField, 
  CircularProgress,
  Alert,
  Snackbar
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useState, useEffect } from "react";

export default function Profile() {
  const { user, logout, isLoading, error: authError } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    dob: "",
  });

  const [editing, setEditing] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Sync profileData when user is available or updated
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        address: user.address || "",
        dob: user.dob || "",
      });
    }
  }, [user]);

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

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!profileData.name.trim()) {
        throw new Error("Name is required");
      }
      if (!profileData.email.trim()) {
        throw new Error("Email is required");
      }
      // const response = await updateUserProfile(profileData);
      console.log("Updated profile data:", profileData);
      
      setSuccessMessage("Profile updated successfully!");
      setEditing(false);
      setSaveError(null);
    } catch (error) {
      setSaveError(error.message);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
    setSaveError(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Error state
  if (authError) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading profile: {authError.message}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  // No user state
  if (!user) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          No user data available. Please log in.
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/login')}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      {/* Success/Error Snackbars */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!saveError}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {saveError}
        </Alert>
      </Snackbar>

      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Avatar 
          sx={{ 
            width: 64, 
            height: 64, 
            mr: 3,
            fontSize: '2rem',
            bgcolor: 'primary.main'
          }}
        >
          {user.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h6">{user.name}</Typography>
          <Typography variant="body1" color="text.secondary">
            {user.email}
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
          required
          error={editing && !profileData.name.trim()}
          helperText={editing && !profileData.name.trim() ? "Name is required" : ""}
        />
        
        <TextField
          fullWidth
          label="Email"
          name="email"
          margin="normal"
          value={profileData.email}
          onChange={handleChange}
          disabled
          required
        />
        
        <TextField
          fullWidth
          label="Mobile Number"
          name="mobile"
          margin="normal"
          value={profileData.mobile}
          onChange={handleChange}
          disabled={!editing}
          inputProps={{ pattern: "[0-9]*" }}
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
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={!profileData.name.trim() || !profileData.email.trim()}
          >
            Save Changes
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => {
              setEditing(false);
              // Reset to original user data
              if (user) {
                setProfileData({
                  name: user.name || "",
                  email: user.email || "",
                  mobile: user.mobile || "",
                  address: user.address || "",
                  dob: user.dob || "",
                });
              }
            }}
          >
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
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );
}