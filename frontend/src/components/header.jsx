import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
} from "@mui/material";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isLoginOrSignup = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <AppBar position="static" color="white" elevation={0}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: "bold", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Claud Kitchen
        </Typography>

        <Box>
          {user ? (
            <Box display="flex" alignItems="center">
              <IconButton
                onClick={() => navigate("/profile")}
                sx={{ ml: 2 }}
                aria-label="profile"
              >
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  sx={{ width: 32, height: 32 }}
                >
                  {user.name?.charAt(0)}
                </Avatar>
              </IconButton>
              <Button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                color="secondary"
                sx={{ ml: 2 }}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Box>
              {isLoginOrSignup ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    color="primary"
                    sx={{ mr: 2 }}
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/signup")}
                  >
                    Signup
                  </Button>
                </>
              )}
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
