import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { clearUser } from "../userSlice";
import api from "../axiosinstance";
import { IconButton } from "@mui/material";
import { VerifiedUserRounded, Visibility, VisibilityOff } from "@mui/icons-material";
import "./userstyle.css";
import { validateInputUser } from "../Validation";

const UserProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(
          `/Employee/GetUserDetails/${user.userId}`
        );
        setName(response.data.empName);
        setEmail(response.data.email);
        setPassword(response.data.passwaord);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = () => {
    dispatch(clearUser());
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    validateInputUser(name, email, password);
    try {
      await api.put(`/Employee/${user.userId}/Editprofile`, {
        EmpName: name,
        Email: email,
        Password: password,
      });
      setLoading(false);
      alert("Profile updated successfully");
    } catch (err) {
      setError("Failed to update profile");
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="user-profile-container">
      <h2>
        <VerifiedUserRounded />{name.split(" ")[0]}'s Profile
      </h2>
      <div className="profile-field">
        <label>Name:</label>
        <input
          type="text"
          value={name ?? ""}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="profile-field">
        <label>Email:</label>
        <input
          type="email"
          value={email ?? ""}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="profile-field">
        <label>Password:</label>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ flex: 1 }}
            required
          />
          <IconButton
            aria-label="toggle password visibility"
            onClick={toggleShowPassword}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </div>
      </div>
      <div className="button-container">
        <button onClick={handleUpdateProfile}>Update Profile</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default UserProfile;
