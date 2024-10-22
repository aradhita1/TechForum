import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../axiosinstance";
import { UserState } from "../userSlice";
import { RootState } from "../store";
import './userstyle.css';
import { Padding } from "@mui/icons-material";

interface IDraft {
  id: number;
  title: string;
  updatedAt: string;
}

const DraftList: React.FC = () => {
  const [drafts, setDrafts] = useState<IDraft[]>([]);
  const user: UserState | undefined = useSelector((state: RootState) => state);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [DraftToDelete, setArticleTodelete] = useState<IDraft | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrafts = async () => {
      if (!user || !user.userId) {
        console.error("User is not defined");
        return;
      }

      try {
        const response = await api.get(`/Employee/${user.userId}/MyDrafts`);
        console.log("API response:", response.data);

        const draftsData: IDraft[] = response.data.$values
          .map((item: any) => {
            if (item.$ref) {
              const refId = item.$ref.split("/").pop();
              const refItem = response.data.$values.find(
                (draft: any) => draft.$id === refId
              );
              return refItem
                ? { id: refItem.artId, title: refItem.title, updatedAt: refItem.updatedAt }
                : undefined;
            }
            return {
              id: item.artId,
              title: item.title,
              updatedAt: item.updatedAt,
            };
          })
          .filter(
            (draft: IDraft | undefined): draft is IDraft => draft !== undefined
          );

        setDrafts(draftsData);
      } catch (error) {
        console.error("Error fetching drafts:", error);
      }
    };
    fetchDrafts();
  }, [user]);


  const openDeleteDialog = (article: IDraft) => {
    setArticleTodelete(article);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setArticleTodelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    if (DraftToDelete) {
      try {
        await api.put(`/Employee/${user.userId}/DeleteDraft/${DraftToDelete.id}`);
        setDrafts((prevArticle) =>
          prevArticle.filter((art) => art.id !== DraftToDelete.id)
        );
        closeDeleteDialog();
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }
  };

  const handleEdit = (draftId: number) => {
    navigate(`/editDraft/${draftId}`);
  };

  return (
    <div className="draft-container">
      <h2>My Drafts</h2>
      <div style={{ width: "100%" }}>
        {drafts.length === 0 ? (
          <Typography>No drafts available.</Typography>
        ) : (
          <List>
            {drafts.map((draft) => (
              <ListItem key={draft.id} divider>
                <ListItemText primary={draft.title} />
                <br/><p style={{fontSize:'small', color:'grey', marginLeft:'10%'}}> | Last Updated: {new Date(draft.updatedAt).toLocaleDateString()}</p>
                <Button
                  onClick={() => handleEdit(draft.id)}
                  style={{
                    backgroundColor: "#002147",
                    color: "white",
                    marginRight: "10px",
                    marginLeft: "10px",
                  }}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => openDeleteDialog(draft)}
                  style={{
                    backgroundColor: "#5dadec",
                    color: "white",
                    marginRight: "10px",
                    marginLeft: "10px",
                  }}
                >
                  Delete
                </Button>
                <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
                  <DialogTitle>Confirm Delete</DialogTitle>
                  <DialogContent>
                    Are you sure you want to delete the Draft "{DraftToDelete?.title}"?
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
              </ListItem>
            ))}
          </List>
        )}
      </div>
    </div>
  );
};

export default DraftList;
