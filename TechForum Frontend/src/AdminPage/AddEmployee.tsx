import React, { useState, ChangeEvent, FormEvent } from "react";
import { TextField, Button, Checkbox, FormControlLabel } from "@mui/material";
import "./adminstyle.css";
import api from "../axiosinstance";
import { validateInputEmployee } from "../Validation";
import { useNavigate } from "react-router-dom";
import { Person2Rounded } from "@mui/icons-material";

interface AddEmployeeViewModel {
  EmpName: string;
  Email: string;
  Dept: string;
  Password: string;
  IsAdmin: boolean;
}

const AddEmployeeForm: React.FC = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<AddEmployeeViewModel>({
    EmpName: "",
    Email: "",
    Dept: "",
    Password: "",
    IsAdmin: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEmployee({
      ...employee,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (await validateInputEmployee(employee)) {
        const response = await api.post("/Admin/AddEmployee", employee);
        console.log("Employee added:", response.data);
        navigate("/viewEmployee");
      }
    } catch (error) {
      console.error("There was an error adding the employee!", error);
    }
  };

  return (
    <div className="employee-container">
      <h2><Person2Rounded/>Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="EmpName"
          value={employee.EmpName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          name="Email"
          value={employee.Email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Department"
          name="Dept"
          value={employee.Dept}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          name="Password"
          type="password"
          value={employee.Password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <FormControlLabel
          control={
            <Checkbox
              name="IsAdmin"
              checked={employee.IsAdmin}
              onChange={handleChange}
            />
          }
          label="Is Admin"
        />
        <Button type="submit" variant="contained" color="primary">
          Add Employee
        </Button>
      </form>
    </div>
  );
};

export default AddEmployeeForm;
