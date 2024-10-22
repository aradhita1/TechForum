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
  Settings,
  Login,
  Archive,
  Queue,
  Analytics,
  Add,
  AddCard,
  ManageAccounts,
  Category,
  ZoomIn,
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
        <ListItem component="a" href="/queue">
          <ListItemIcon>
            <Queue style={{ fontSize: 30, color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Queue" style={{ color: "white" }} />
        </ListItem>
        <ListItem component="a" href="/archived">
          <ListItemIcon>
            <Archive style={{ fontSize: 30, color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Archieved" style={{ color: "white" }} />
        </ListItem>
        <ListItem component="a" href="/analytics">
          <ListItemIcon>
            <Analytics style={{ fontSize: 30, color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Analysis" style={{ color: "white" }} />
        </ListItem>
        <ListItem component="a" href="/addEmployee">
          <ListItemIcon>
            <Add style={{ fontSize: 30, color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Add Employee" style={{ color: "white" }} />
        </ListItem>
        <ListItem component="a" href="/viewEmployee">
          <ListItemIcon>
            <ManageAccounts style={{ fontSize: 30, color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="View Employee" style={{ color: "white" }} />
        </ListItem>
        <ListItem component="a" href="/addCategory">
          <ListItemIcon>
            <AddCard style={{ fontSize: 30, color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Add Category" style={{ color: "white" }} />
        </ListItem>
        <ListItem component="a" href="/manageCategory">
          <ListItemIcon>
            <Category style={{ fontSize: 30, color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Manage Category" style={{ color: "white" }} />
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
