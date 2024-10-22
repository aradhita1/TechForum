import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import "react-quill/dist/quill.snow.css";
import "./userstyle.css";
import api from "../axiosinstance";
import {
  Button,
  IconButton,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";
import { useSelector } from "react-redux";
import { UserState } from "../userSlice";
import { RootState } from "../store";
import { validateInputaArticle } from "../Validation";
import { useNavigate } from "react-router-dom";

export interface ICategory {
  categoryId: number;
  categoryName: string;
}

export interface IArticle {
  title: string;
  author: string;
  tags: string;
  status: string;
  content: string;
  CatId: number | null;
  EmpId: number | null;
}

export interface IDraft {
  title: string;
  author: string;
  tags: string;
  content: string;
  CatId: number;
  EmpId: number;
}

const CreateText: React.FC = () => {
  const [value, setValue] = useState<string>("");
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
    if (user) {
      setEmployeeId(user.userId);
      console.log(employeeId);
    }

    const fetchCategories = async () => {
      try {
        const response = await api.get("/Employee/GetAllCategories");
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
  }, [employeeId, setSelectedCategory, user]);

  const DraftArticle = async (id: number, draft: IDraft) => {
    try {
      if (await validateInputaArticle(title, author, tags)) {
        const response = await api.post(`/Employee/${id}/CreateDrafts`, draft, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status < 200 || response.status >= 300) {
          throw new Error("Network response was not ok");
        }
          setTitle('');
          setAuthor('');
          setTags('');
          setValue('');
        
        showSnackbar("Draft saved successfully");
        navigate("/drafts");
      }
    } catch (error: any) {
      showSnackbar(`Error saving draft: ${error.message}`);
    }
  };
  
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setOpenDraftSnackbar(true);
  };
  
  const handleDraft = async () => {
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
          const response = await api.post(
            `/Employee/${employeeId}/CreateArticle`,
            article
          );
          if (response.status < 200 || response.status >= 300) {
            throw new Error(
              `Network response was not ok: ${response.statusText}`
            );
          }
          setTitle('');
          setAuthor('');
          setTags('');
          setValue('');
          setSnackbarMessage("Article sent successfully");
          setOpenSendSnackbar(true);
        }
        navigate("/create");
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
        navigate("/create");
      }
    } else {
      setSnackbarMessage("Employee ID and category must be selected");
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
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
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
          value={value}
          style={{ height: " 20vh" }}
          onChange={setValue}
        />

        <div className="button-container" style={{marginTop:'8vh'}}>
          <button className="editor-button" onClick={handleDraft}>
            {loading ? "Saving..." : "Draft"}
          </button>
          <Snackbar
            style={{ zIndex: "500" }}
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
            style={{ zIndex: "500" }}
            open={openSendSnackbar}
            autoHideDuration={3000}
            onClose={handleClose}
            message={snackbarMessage}
            action={action}
          />
      </div>
    </div>
  );
};

export default CreateText;
