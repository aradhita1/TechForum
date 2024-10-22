import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginPopup: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    onClose();
    navigate("/login");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Login Required</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You need to be logged in to access this page. Please log in to
          continue.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleLoginRedirect} color="primary">
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginPopup;
