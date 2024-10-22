import React, { useEffect, useState } from "react";
import './adminstyle.css';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import api from "../axiosinstance";

interface ICategory {
  categoryId: number;
  categoryName: string;
  parentId: number | null;
}

const CategoryQueue: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(
    null
  );

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/Admin/GetAllCategories");
      console.log("Fetched categories:", response.data.$values);
      setCategories(response.data.$values);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openDeleteDialog = (category: ICategory) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setCategoryToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    if (categoryToDelete) {
      try {
        await api.put(`/Admin/DeleteCategory/${categoryToDelete.categoryId}`);
        fetchCategories();
        closeDeleteDialog();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="draft-container">
      <Box width={"100%"}>
        <Typography variant="h4" mb={3}>
          Categories Queue
        </Typography>
        <List>
          {categories.map((category) => (
            <ListItem key={category.categoryId} sx={{ mb: 1 }}>
              <Box display="flex" justifyContent="space-between" width="100%">
                <ListItemText primary={category.categoryName} />
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => openDeleteDialog(category)}
                >
                  Delete
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>

        <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
          <DialogTitle style={{ color: "red", fontWeight: "bold" }}>
            Warning!!
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete the category "
            {categoryToDelete?.categoryName}"?
            <br />
            All related child categories and articles will be deleted.
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
};

export default CategoryQueue;
