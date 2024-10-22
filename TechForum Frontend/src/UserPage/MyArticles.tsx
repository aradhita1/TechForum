import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { UserState } from "../userSlice";
import { RootState } from "../store";
import './userstyle.css';

import {
  Snackbar,
  Button,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import api from "../axiosinstance";

export interface IArticle {
  artId: number;
  title: string;
  author: string;
  content: string;
  createdAt: string;
  status: string;
}

const MyArticles: React.FC = () => {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const user: UserState = useSelector((state: RootState) => state);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [ArticleToDelete, setArticleTodelete] = useState<IArticle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchArticles = async () => {
    try {
      const response = await api.get(`/Employee/${user.userId}/MyArticles`);
      console.log("API Response:", response.data);
      if (response.data) {
        const data = await response.data;
        if (data && Array.isArray(data.$values)) {
          setArticles(data.$values);
        } else {
          console.error("Fetched data is not in the expected format:", data);
        }
      } else {
        console.error("Failed to fetch articles:", response.statusText);
      }
    } catch (error) {
      setSnackbarMessage("Error fetching articles");
      setOpen(true);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchArticles();
    }
  }, [user?.userId]);

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDeleteDialog = (article: IArticle) => {
    setArticleTodelete(article);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setArticleTodelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    if (ArticleToDelete) {
      try {
        await api.put(`/Employee/${user.userId}/DeleteArticle/${ArticleToDelete.artId}`);
        setArticles((prevArticle) =>
          prevArticle.filter((art) => art.artId !== ArticleToDelete.artId)
        );
        closeDeleteDialog();
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}></Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div className="MyArticles-container">
      <h2>My Articles</h2>
      <div style={{ width: "100%" , marginLeft:'0'}}>
      <TextField
        label="Search my articles..."
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
        fullWidth
        margin="normal"
      />
      <div style={{ width: "100%" , marginLeft:'2%'}}>
        {articles.length > 0 ? (
          <div>
            {filteredArticles.map((article) => (
              <React.Fragment key={article.artId}>
                <Card
                  variant="outlined"
                  style={{ marginLeft: 0, marginBottom: 2 }}
                >
                  <CardContent>
                    <h4>{article.title}</h4>
                    <Typography variant="subtitle1" color="text.secondary">
                      {article.status}
                    </Typography>
                    <Typography variant="body2" component="p">
                      <div
                        dangerouslySetInnerHTML={{ __html: article.content }}
                      ></div>
                    </Typography>
                    <br />
                    <Typography variant="body2" color="text.secondary">
                      ____By {article.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </Typography>
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      style={{ marginTop: 1 }}
                    >
                      {article.status !== "archived" ? (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => openDeleteDialog(article)}
                          sx={{ marginTop: 1 }}
                        >
                          Delete
                        </Button>
                      ) : (
                        <p style={{color:'red'}}>*Archived articles cannot be deleted!
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => openDeleteDialog(article)}
                          disabled
                          sx={{ marginTop: 1 }}
                        >
                          Contact Admin To Delete
                        </Button>
                        </p>
                      )}
                    </Box>
                  </CardContent>
                </Card>

                <Divider
                  variant="middle"
                  style={{ backgroundColor: "#002147", marginTop: "10px" }}
                />
                <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
                  <DialogTitle>Confirm Delete</DialogTitle>
                  <DialogContent>
                    Are you sure you want to delete the article "{ArticleToDelete?.title}"?
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
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p>No articles found.</p>
        )}
      </div>

        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={snackbarMessage}
          action={action}
        />
      </div>
    </div>
  );
};

export default MyArticles;
