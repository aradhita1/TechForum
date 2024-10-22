import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Slide,
  Snackbar,
  Alert,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Autocomplete from "@mui/material/Autocomplete";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ICategory } from "../UserPage/CreateText";
import api from "../axiosinstance";
import { useNavigate } from "react-router-dom";
import { validateInputaArticle } from "../Validation";

interface EditArticleModalProps {
  open: boolean;
  articleId: string;
  onClose: () => void;
}

const Transition = React.forwardRef(function Transition(
  props: any,
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditArticleModal: React.FC<EditArticleModalProps> = ({
  open,
  articleId,
  onClose,
}) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const user = useSelector((state: RootState) => state);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<number>(0);

  useEffect(() => {
    const fetchArticleDetails = async () => {
      try {
        const response1 = await api.get(`/Admin/GetArticleByID/${articleId}`);
        const article = response1.data;
        setTitle(article.title);
        setAuthor(article.author);
        setTags(article.tags);
        setContent(article.content);
        setCategoryId(article.catId);
        setSelectedCategory(article.catId);

        const response2 = await api.get("/Admin/GetAllCategories");
        if (response2?.data?.$values) {
          setCategories(response2.data.$values || []);
        } else {
          console.error("Failed to fetch categories:", response2.statusText);
        }
      } catch (error) {
        console.error("Error fetching article details or categories:", error);
      }
    };

    if (open) {
      fetchArticleDetails();
    }
  }, [articleId, open]);

  const handlePublish = async () => {
    if (!selectedCategory) {
      setSnackbarOpen(true);
      return;
    }
    const data = {
      artId: 0,
      title,
      empId: user.userId,
      catId: selectedCategory,
      author,
      tags,
      status: "published",
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      isdeleted: true,
    };
    try {
      if (await validateInputaArticle(title, author, tags)) {
        await api.put(`/Admin/${user.userId}/EditArticle/${articleId}`, data);
        onClose();
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error publishing article:", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.categoryId === categoryId);
    return category ? category.categoryName : "Unknown";
  };


  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition}>
      <DialogTitle>Edit Article</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Author"
          variant="outlined"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Tags"
          variant="outlined"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Autocomplete
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          size="small"
          value={getCategoryName(categoryId)}
          style={{ width: "300px" }}
          options={categories.map((category) => category.categoryName)}
          onChange={(event, newValue) => {
            const selected = categories.find(
              (category) => category.categoryName === newValue
            );
            setSelectedCategory(selected ? selected.categoryId : null);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Category"
              margin="normal"
              variant="outlined"
              InputProps={{ ...params.InputProps, type: "search" }}
              required
            />
          )}
        />
        <ReactQuill
          className="editor-text"
          theme="snow"
          value={content}
          style={{ height: " 20vh" }}
          onChange={setContent}
        />
      </DialogContent>
<DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handlePublish} color="primary">
          Save
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          Please select a category before saving.
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default EditArticleModal;
