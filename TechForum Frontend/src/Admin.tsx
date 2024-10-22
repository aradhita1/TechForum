import React, { memo } from "react";
import AdminSlidingNavbar from "./AdminPage/AdminSidenav";
import { Box } from "@mui/material";
import AdminArticleList from "./AdminPage/ArticleAdminHome";
import { Outlet } from "react-router-dom";

const AdminPage: React.FC = () => {
  return (
    <Box style={{ display: "flex" }}>
      <AdminSlidingNavbar />
      <Outlet />
      <AdminArticleList />
    </Box>
  );
};

export default AdminPage;
