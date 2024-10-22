import SlideBar from "./UserPage/Sidenav";
import { Box } from "@mui/material";
import ArticleList from "./UserPage/Articlehome";
import { Outlet } from "react-router-dom";

const UserPage: React.FC = () => {
  return (
    <Box style={{ display: "flex" }}>
      <SlideBar />
      <Outlet />
      <ArticleList />
    </Box>
  );
};

export default UserPage;
