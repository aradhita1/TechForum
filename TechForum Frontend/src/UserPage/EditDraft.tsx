import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../axiosinstance";
import { IDraft, IArticle, ICategory } from "./CreateText";
import { UserState } from "../userSlice";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import {
  Autocomplete,
  Button,
  IconButton,
  Snackbar,
  SnackbarCloseReason,
  TextField,
} from "@mui/material";
import "./userstyle.css"
import CloseIcon from "@mui/icons-material/Close";
import ReactQuill from "react-quill";
import { validateInputaArticle } from "../Validation";

const EditDraft: React.FC = () => {
  const { draftId } = useParams<{ draftId: string }>();
  const [draft, setDraft] = useState<IDraft | null>(null);
  const [value, setValue] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [status, setStatus] = useState<string>("draft");
  const [loading, setLoading] = useState<boolean>(false);
  const user: UserState = useSelector((state: RootState) => state);
  const [openDraftSnackbar, setOpenDraftSnackbar] = useState<boolean>(false);
  const [openSendSnackbar, setOpenSendSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDraftSnackbar(false);
    setOpenSendSnackbar(false);
  };

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const { data } = await api.get(`/Employee/GetDraftById/${draftId}`);
        setDraft(data);
        setTitle(data.title);
        setAuthor(data.author);
        setTags(data.tags);
        setValue(data.content);
        setCategoryId(data.catId);
        setSelectedCategory(data.catId);
      } catch (error) {
        console.error("Error fetching draft:", error);
      }
    };
    fetchDraft();
  }, [draftId]);

  useEffect(() => {
    if (user) {
      setEmployeeId(user.userId);
      console.log(employeeId);
    }

    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/Employee/GetAllCategories");
        setCategories(data.$values || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [employeeId, setSelectedCategory, user]);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setOpenDraftSnackbar(true);
  };

  const DraftArticle = async (id: number, draft: IDraft) => {
      try {
        console.log("editdraft", draftId, id);
        if (await validateInputaArticle(title, author, tags)) {
          const { status, data } = await api.put(
            `/Employee/${id}/EditDraft/${draftId}`,
            draft
          );
          if (status < 200 || status >= 300) {
            throw new Error(`Network response was not ok : ${data}`);
          }
          showSnackbar("Draft saved successfully");
          navigate("/drafts");
        }
      } catch (error: any) {
        if (error.response) {
          console.error("Error response data:", error.response.data);
          showSnackbar(`Error sending article: ${error.response.data}`);
        } else {
          showSnackbar(`Error sending article: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.categoryId === categoryId);
    return category ? category.categoryName : "Unknown";
  };

  const handleDraft = async () => {
    validateInputaArticle(title, author, tags);
    if (employeeId && selectedCategory !== null) {
      setLoading(true);
      const draft: IDraft = {
        title,
        author,
        tags,
        content: value,
        CatId: selectedCategory,
        EmpId: employeeId,
      };
      await DraftArticle(employeeId, draft);
      setLoading(false);
    }else{
      setSnackbarMessage("Category must be selected");
      setOpenSendSnackbar(true);
    }
  };

  const handleSend = async () => {
    if (employeeId && selectedCategory !== null) {
      setLoading(true);
      const article: IArticle = {
        title,
        author,
        tags,
        status,
        content: value,
        CatId: selectedCategory,
        EmpId: employeeId,
      };
      console.log("Sending article:", article);
      try {
        if (await validateInputaArticle(title, author, tags)) {
          const { status, data } = await api.post(
            `/Employee/${user.userId}/PublishDraft/${draftId}`,
            article
          );
          if (status < 200 || status >= 300) {
            throw new Error(`Network response was not ok: ${data}`);
          }
          setSnackbarMessage("Article sent successfully");
          setOpenSendSnackbar(true);
          navigate("/drafts");
        }
      } catch (error: any) {
        if (error.response) {
          console.error("Error response data:", error.response.data);
          setSnackbarMessage(`Error sending article: ${error.response.data}`);
        } else {
          setSnackbarMessage(`Error sending article: ${error.message}`);
        }
        setOpenSendSnackbar(true);
      } finally {
        setLoading(false);
      }
    } else {
      setSnackbarMessage("Category must be selected");
      setOpenSendSnackbar(true);
    }
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" ></CloseIcon>
      </IconButton>
    </React.Fragment>
  );

  return (
    <>
    <div className="draft-container">
      <link
        rel="stylesheet"
        href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css"
      />
      
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="text"
          placeholder="Tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="input-field"
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
          style={{height:'10vh'}}
          value={value}
          onChange={setValue}
        />

        <div className="button-container" style={{marginTop:'8vh'}}>
          <button className="editor-button" onClick={handleDraft}>
            {loading ? "Saving..." : "Draft"}
          </button>
          <Snackbar
            style={{ zIndex: "100000" }}
            open={openDraftSnackbar}
            autoHideDuration={3000}
            onClose={handleClose}
            message={snackbarMessage}
            action={action}
          />
          <button className="editor-button" onClick={handleSend}>
            {loading ? "Sending..." : "Send"}
          </button>
          <Snackbar
            style={{ zIndex: "100000" }}
            open={openSendSnackbar}
            autoHideDuration={3000}
            onClose={handleClose}
            message={snackbarMessage}
            action={action}
          />
        </div>
      </div>
    </>
  );
};

export default EditDraft;
