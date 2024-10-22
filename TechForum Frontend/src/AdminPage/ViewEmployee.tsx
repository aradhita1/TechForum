import React, { useEffect, useState } from "react";
import {
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
import './adminstyle.css';
import { useSelector } from "react-redux";
import { UserState } from "../userSlice";
import { RootState } from "../store";

interface IEmployees {
  empId: number;
  empName: string;
  email: string;
  dept: string;
  isAdmin: boolean;
}

const ViewEmployees: React.FC = () => {
  const [employee, setEmployee] = useState<IEmployees[]>([]);
  const user: UserState = useSelector((state: RootState) => state);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [EmployeeToDelete, setEmployeeTodelete] = useState<IEmployees | null>(
    null
  );

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  const fetchAllEmployees = async () => {
    try {
      const response = await api.get<{ $values: IEmployees[] }>(
        "/Admin/GetEmployees"
      );
      if (response.data && Array.isArray(response.data.$values)) {
        const filteredEmployees = response.data.$values.filter(employee => employee.empId !== user.userId);
        setEmployee(filteredEmployees);
      } else {
        console.error(
          "API response is not in the expected format:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching employee details", error);
    }
  };

  const openDeleteDialog = (employee: IEmployees) => {
    setEmployeeTodelete(employee);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setEmployeeTodelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    if (EmployeeToDelete) {
      try {
        await api.put(`/Admin/DeleteEmployee/${EmployeeToDelete.empId}`);
        setEmployee((prevEmployee) =>
          prevEmployee.filter((emp) => emp.empId !== EmployeeToDelete.empId)
        );
        closeDeleteDialog();
      } catch (error) {
        console.error("Error deleting Employee:", error);
      }
    }
  };

  const handleEdit = async (id: number) => {
    console.log("selectedid", id);
    window.location.href = `/editEmployee/${id}`;
  };

  return (
    <div className="draft-container">
      <Box width={"100%"}>
        <h3>Employee Details</h3>
        <List>
          <div style={{width:"100%"}}>
          {employee.map((employee) => (
            <ListItem key={employee.empId} divider>
              <ListItemText
                primary={employee.empName}
                secondary={employee.email}
              />
              <Box
                width={"100%"}
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => openDeleteDialog(employee)}
                  style={{ marginLeft: "5px" }}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleEdit(employee.empId)}
                  style={{ marginLeft: "10px" }}
                >
                  Edit
                </Button>
              </Box>
            </ListItem>
          ))}            
          </div>
        </List>
        <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete the employee details of "
            {EmployeeToDelete?.empName}"?
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
      </Box>
    </div>
  );
};

export default ViewEmployees;
