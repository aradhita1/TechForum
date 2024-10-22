import React, { useEffect, useState } from "react";
import './adminstyle.css';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import api from "../axiosinstance";

interface IArticle {
  artId: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

const ArchivedArticles: React.FC = () => {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [ArticleToDelete, setArticleTodelete] = useState<IArticle | null>(null);

  useEffect(() => {
    fetchArchivedArticles();
  }, []);

  const fetchArchivedArticles = async () => {
    try {
      const response = await api.get<{ $values: IArticle[] }>(
        "/Admin/GetArchivedArticles"
      );
      if (response.data && Array.isArray(response.data.$values)) {
        setArticles(response.data.$values);
        console.log(response.data);
      } else {
        console.error(
          "API response is not in the expected format:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching archived articles:", error);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      console.log(id);
      await api.put(`/Admin/Approve/${id}`);
      setArticles(articles.filter((article) => article.artId !== id));
      window.location.reload();
    } catch (error) {
      console.error("Error approving article:", error);
    }
  };

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
        await api.put(`/Admin/DeleteArticle/${ArticleToDelete.artId}`);
        setArticles((prevArticle) =>
          prevArticle.filter((art) => art.artId !== ArticleToDelete.artId)
        );
        closeDeleteDialog();
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }
  };

  const handleEdit = async (id: number) => {
    window.location.href = `/editArticle/${id}`;
  };

  return (
    <div className="draft-container">
      <h2>Archived Articles</h2>
      {articles.length > 0 ? (
        <List>
          {articles.map((article) => (
            <ListItem key={article.artId} divider>
              <ListItemText
                primary={
                  <Typography
                      component="span"
                      fontWeight= "bold"
                      color="textPrimary"
                    >
                  {article.title}
                  </Typography>
                  }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      {article.author}
                    </Typography>
                    {" — "}
                    <Typography
                      component="span"
                      variant="body2"
                      color="textSecondary"
                    >
                      {new Date(article.createdAt).toLocaleDateString()}
                    </Typography>
                  </>
                }
              /><br/>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%"
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleApprove(article.artId)}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => openDeleteDialog(article)}
                  style={{ marginLeft: "10px" }}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleEdit(article.artId)}
                  style={{ marginLeft: "10px" }}
                >
                  Edit
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No archived articles found</Typography>
      )}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the article "{ArticleToDelete?.title}
          "?
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
    </div>
  );
};

export default ArchivedArticles;
