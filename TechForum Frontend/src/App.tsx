import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
  useParams,
  Navigate,
  useNavigate,
} from "react-router-dom";
import UserPage from "./User";
import LoginPage from "./LoginPage";
import CreateText from "./UserPage/CreateText";
import MyArticles from "./UserPage/MyArticles";
import MyDrafts from "./UserPage/Drafts";
import EditDraft from "./UserPage/EditDraft";
import UserProfile from "./UserPage/UserProfile";
import AdminPage from "./Admin";
import EditArticleModal from "./AdminPage/EditArticleAdmin";
import EditEmployeeModal from "./AdminPage/EditEmployeeModal";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { useState, useEffect, memo } from "react";
import LoginPopup from "./LoginPop";
import AddEmployeeForm from "./AdminPage/AddEmployee";
import DraftedArticlesQueue from "./AdminPage/DraftQueue";
import ArchivedArticles from "./AdminPage/ArchivedArticles";
import Createcategory from "./AdminPage/CreateCategory";
import AdminProfile from "./AdminPage/ProfileSetting";
import ViewEmployees from "./AdminPage/ViewEmployee";
import CategoryQueue from "./AdminPage/Managecategory";
import ViewAnalytics from "./AdminPage/Analysis";
import TopArticleList from "./UserPage/TopArticles";
import TopArticleModal from "./UserPage/ArticleReadModal";
import AdminTopArticleList from "./AdminPage/AdminTopArticles";
import TopAdminArticleModal from "./AdminPage/ArticleModal";

const EditArticleWrapper = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/archived");
  };

  return (
    <EditArticleModal
      open={isModalOpen}
      onClose={handleCloseModal}
      articleId={articleId || ""}
    />
  );
};

const EditEmployeeWrapper = () => {
  const { empId } = useParams<{ empId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/viewEmployee");
  };

  return (
    <EditEmployeeModal
      open={isModalOpen}
      onClose={handleCloseModal}
      EmpId={empId || ""}
    />
  );
};

const ReadArticleWrapper = () => {
  const { ArtId } = useParams<{ ArtId: string }>();
  console.log("read: " + ArtId);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/home");
  };

  return (
    <TopArticleModal
      open={isModalOpen}
      onClose={handleCloseModal}
      ArtId={ArtId || ""}
    />
  );
};


const ReadAdminArticleWrapper = () => {
  const { ArtId } = useParams<{ ArtId: string }>();
  console.log("read: " + ArtId);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/home");
  };

  return (
    <TopAdminArticleModal
      open={isModalOpen}
      onClose={handleCloseModal}
      ArtId={ArtId || ""}
    />
  );
};

const NotFound = () => {
  return <div style={{fontSize:'25px'}}>Page NOT Found</div>;
};

function App() {
  const user = useSelector((state: RootState) => state);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsPopupOpen(true);
    }
  }, [user]);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        {user.userId ? (
          user.role === "Admin" ? (
            <Route path="/" element={<AdminPage />}>
              <Route path="read/:ArtId" element={<ReadAdminArticleWrapper />} />
              <Route path="home" element={<AdminTopArticleList />} />
              <Route
                path="editArticle/:articleId"
                element={<EditArticleWrapper />}
              />
              <Route path="addEmployee" element={<AddEmployeeForm />} />
              <Route path="queue" element={<DraftedArticlesQueue />} />
              <Route path="archived" element={<ArchivedArticles />} />
              <Route path="analytics" element={<ViewAnalytics />} />
              <Route path="addcategory" element={<Createcategory />} />
              <Route path="viewEmployee" element={<ViewEmployees />} />
              <Route
                path="editEmployee/:empId"
                element={<EditEmployeeWrapper />}
              />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="manageCategory" element={<CategoryQueue />} />
            </Route>
          ) : (
            <Route path="/" element={<UserPage />}>
              <Route path="read/:ArtId" element={<ReadArticleWrapper />} />
              <Route path="home" element={<TopArticleList />} />
              <Route path="create" element={<CreateText />} />
              <Route path="MyArticles" element={<MyArticles />} />
              <Route path="drafts" element={<MyDrafts />} />
              <Route path="editDraft/:draftId" element={<EditDraft />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>
          )
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <LoginPopup open={isPopupOpen} onClose={handleClosePopup} />
    </BrowserRouter>
  );
}

export default memo(App);
