import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

const pages = [
  { name: "My Pickups", route: "/vendor/pickup" },
  { name: "My Profile", route: "/vendor/profile" },
];

const settings = ["Home", "Logout"];

function ResponsiveAppBar() {
  const location = useLocation();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("vid");
    localStorage.removeItem("vendor_email");
    navigate("/");
  };

  const handleHome = () => {
    navigate("/vendor");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#2C4E80" }}>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          sx={{
            flexGrow: 1,
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          Scrapify
        </Typography>

        <Box sx={{ display: { xs: "none", sm: "flex" } }}>
          {pages.map((page) => (
            <Button
              key={page.name}
              sx={{
                mx: 2,
                color:
                  location.pathname === page.route ? "#BACD92" : "inherit",
              }}
            >
              <Link
                to={page.route}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Typography>{page.name}</Typography>
              </Link>
            </Button>
          ))}
          {settings.map((setting) => (
            <Button
              key={setting}
              onClick={setting === "Logout" ? handleLogout : handleHome}
              sx={{
                color:
                  setting === "Home" && location.pathname === "/vendor"
                    ? "#BACD92"
                    : "inherit",
              }}
            >
              {setting === "Home" ? (
                <HomeIcon fontSize="small" />
              ) : (
                <LogoutIcon fontSize="small" />
              )}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: { xs: "flex", sm: "none" } }}>
          <IconButton
            onClick={handleOpenUserMenu}
            aria-label="menu"
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            getContentAnchorEl={null}
            keepMounted
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {pages.map((page) => (
              <MenuItem
                key={page.name}
                onClick={handleCloseUserMenu}
                sx={{
                  color:
                    location.pathname === page.route ? "#1679AB" : "inherit",
                }}
              >
                <Link
                  to={page.route}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </Link>
              </MenuItem>
            ))}
            {settings.map((setting) => (
              <MenuItem
                key={setting}
                onClick={setting === "Logout" ? handleLogout : handleHome}
                sx={{
                  color:
                    setting === "Home" && location.pathname === "/vendor"
                      ? "#1679AB"
                      : "inherit",
                }}
              >
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default ResponsiveAppBar;
