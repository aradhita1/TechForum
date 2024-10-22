import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Autocomplete,
  FormControl,
  Box,
} from "@mui/material";
import "./adminstyle.css"
import api from "../axiosinstance";

interface ICategory {
  categoryId: number;
  categoryName: string;
  parentId: number | null;
}

const CreateCategory: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [parentId, setParentId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/Admin/GetAllCategories");
        if (response?.data?.$values) {
          setCategories(response.data.$values || []);
        } else {
          console.error("Failed to fetch categories:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    console.log("selectId", parentId);
    if (!categoryName) {
      alert("Please enter a category name.");
      return;
    }
    const newCategory = {
      categoryId: 0,
      categoryName,
      parentId,
    };
    setSubmitting(true);
    try {
      await api.post("/Admin/Categories", newCategory);
      alert("Category created successfully.");
      setCategoryName("");
      setParentId(null);
      window.location.reload();
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    window.location.href = `/`;
  };

  return (
    <div className="category-container">
      <h1>Create Category</h1>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
        <Autocomplete
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          size="small"
          style={{ width: "100%" }}
          options={categories.map((category) => category.categoryName)}
          onChange={(event, newValue) => {
            const selected = categories.find(
              (category) => category.categoryName === newValue
            );
            console.log("checks", selected);
            setParentId(selected ? selected.categoryId : null);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Parent Category"
              margin="normal"
              variant="outlined"
              InputProps={{ ...params.InputProps, type: "search" }}
            />
          )}
        />
        <Box style={{ marginRight: "0" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateCategory}
            style={{ marginRight: "10px" }}
          >
            Create Category
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      </FormControl>
    </div>
  );
};

export default CreateCategory;
