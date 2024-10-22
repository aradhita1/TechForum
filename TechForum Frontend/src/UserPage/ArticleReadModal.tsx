import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Slide,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import "react-quill/dist/quill.snow.css";
import api from "../axiosinstance";
import "./userstyle.css";
import { useNavigate } from "react-router-dom";
import { FavoriteRounded, ShareRounded } from "@mui/icons-material";

interface IArticle {
  artId: number;
  title: string;
  author: string;
  tags: string;
  status: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  shares: number;
}

interface TopArticleModalProps {
  open: boolean;
  ArtId: string;
  onClose: () => void;
}

const Transition = React.forwardRef(function Transition(
  props: any,
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TopArticleModal: React.FC<TopArticleModalProps> = ({
  open,
  ArtId,
  onClose,
}) => {
  const [article, setArticle] = useState<IArticle | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticleDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/Employee/GetArticleByID/${ArtId}`);
        setArticle(response.data);
      } catch (error) {
        setError("Error fetching article details");
        console.error("Error fetching article details", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchArticleDetails();
    }
  }, [ArtId, open]);

  const handleCancel = () => {
    onClose();
    navigate("/home");
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition}>
      <DialogTitle>Read Article Details</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : error ? ( 
          <Alert severity="error">{error}</Alert>
        ) : article ? (
          <Card key={article.artId} className="article">
            <CardContent>
              <h3>{article.title}</h3>
              <p style={{fontSize:'small', color:'grey'}}>
                By {article.author} on{" "}
                {new Date(article.createdAt).toLocaleDateString()}
              </p>
              <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
              <p>
                <FavoriteRounded style={{ fontSize:'25', color:'red'}}/>Likes: {article.likes} | <ShareRounded style={{ fontSize:'25', color:'green'}}/> Shares: {article.shares}
              </p>
            </CardContent>
          </Card>
        ) : (
          <p>No article found</p>
        )}
        <Button
          onClick={handleCancel}
          variant="outlined"
          color="secondary"
          sx={{ mt: 2 }}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default TopArticleModal;
