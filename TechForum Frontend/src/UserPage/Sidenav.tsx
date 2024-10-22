import * as React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Home,
  Create,
  Drafts,
  Article,
  Settings,
  Login,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { useState } from "react";
import techlogo from "../techlogo-removebg-preview.png";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { clearUser, UserState } from "../userSlice";
import { useNavigate } from "react-router-dom";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 70,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  zIndex: 100,
  "& .MuiDrawer-paper": {
    width: 70,
    transition: "0.8s",
    backgroundColor: "#002147",
    overflow: "hidden",
  },
  "&:hover .MuiDrawer-paper": {
    width: 240,
    backgroundColor: "#002147",
    overflow: "hidden",
  },
  "@media (max-width: 800px)": {
    "&:hover .MuiDrawer-paper": {
    width: 70,
    backgroundColor: "#002147",
    overflow: "hidden",
  },
  },
}));

const SlideBar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const user: UserState = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/login");
  };
  return (
    <StyledDrawer
      variant="permanent"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="drawer"
    >
      <List>
        <ListItem component="a">
          <ListItemIcon>
            <img
              src={techlogo}
              alt="TechLogo"
              style={{ width: 50, height: 50, filter: "brightness(300%)" }}
            />
          </ListItemIcon>
          <h1 style={{ color: "#49d8d8" }}> TechForum </h1>
        </ListItem>
        <ListItem component="a" href="/home">
          <ListItemIcon>
            <Home style={{ fontSize: 30, color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Home" style={{ color: "white" }} />
        </ListItem>
        <ListItem component="a" href="/create">
          <ListItemIcon>
            <Create style={{ fontSize: 30, color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Create" style={{ color: "white" }} />
        </ListItem>
        <ListItem component="a" href="/drafts">
          <ListItemIcon>
            <Drafts style={{ fontSize: 30, color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="My Drafts" style={{ color: "white" }} />
        </ListItem>
        <ListItem component="a" href="/Myarticles">
          <ListItemIcon>
            <Article style={{ fontSize: 30, color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="My Articles" style={{ color: "white" }} />
        </ListItem>

        <Divider
          variant="middle"
          style={{ backgroundColor: "white", marginTop: "20px" }}
        />
        <ListItem component="a" href="/profile">
          <ListItemIcon>
            <Settings style={{ fontSize: 30, color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Profile Setting" style={{ color: "white" }} />
        </ListItem>
        {user.userId ? (
          <ListItem onClick={handleLogout}>
            <ListItemIcon>
              <Login style={{ fontSize: 30, color: "white" }} />
            </ListItemIcon>
            {open && (
              <ListItemText primary="Logout" style={{ color: "white" }} />
            )}
          </ListItem>
        ) : (
          <ListItem component="a" href="/login">
            <ListItemIcon>
              <Login style={{ fontSize: 30, color: "white" }} />
            </ListItemIcon>
            {open && (
              <ListItemText primary="Login" style={{ color: "white" }} />
            )}
          </ListItem>
        )}
      </List>
    </StyledDrawer>
  );
};

export default SlideBar;
