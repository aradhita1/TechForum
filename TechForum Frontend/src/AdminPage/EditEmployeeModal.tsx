import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Slide,
} from "@mui/material";
import "react-quill/dist/quill.snow.css";
import api from "../axiosinstance";
import { useNavigate } from "react-router-dom";
import "./adminstyle.css";
import { validateEditEmployee } from "../Validation";

interface EditEmployeeModalProps {
  open: boolean;
  EmpId: string;
  onClose: () => void;
}

const Transition = React.forwardRef(function Transition(
  props: any,
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  open,
  EmpId,
  onClose,
}) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dept, setDept] = useState("");

  useEffect(() => {
    const fetchArticleDetails = async () => {
      try {
        const response1 = await api.get(`/Admin/GetEmpByID/${EmpId}`);
        const employee = response1.data;
        setName(employee.empName);
        setEmail(employee.email);
        setDept(employee.dept);
      } catch (error) {
        console.error("Error fetching employee details", error);
      }
    };

    if (open) {
      fetchArticleDetails();
    }
  }, [EmpId, open]);

  const handleSave = async () => {
    const data = {
      id: 0,
      empName: name,
      email: email,
      department: dept,
    };
    try {
      if (await validateEditEmployee(data)) {
        await api.put(`/Admin/EditEmployee/${EmpId}`, data);
        onClose();
        navigate("/viewEmployee");
      }
    } catch (error) {
      console.error("Error publishing article:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition}>
      <DialogTitle> Edit Employee Details</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Department"
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          variant="outlined"
          margin="normal"
          required
        />
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          sx={{ mr: 2 }}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeModal;
