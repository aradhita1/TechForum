import React, { useEffect, useState } from "react";
import "../UserPage/userstyle.css";
import "./adminstyle.css"
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IArticle } from "./ArticleAdminHome";
import api from "../axiosinstance";

const AdminTopArticleList = () => {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get("/Employee/GetTopArticles");
        setArticles(response.data.$values);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  const handleRead = (article: IArticle) => {
    navigate(`/read/${article.artId}`);
  };

  return (
    <div className="TopArticle-container">
      <h2> Current Top 5 Articles </h2>
      {articles.map((article) => (
        <Card
          key={article.artId}
          style={{ marginBottom: "20px", width: "100%" }}
        >
          <CardContent>
            <h3>{article.title}</h3>
            <Typography variant="subtitle1" style={{color:'grey', fontSize:'small'}}>_____By {article.author}</Typography>
            <Typography variant="body2">
              Created on {new Date(article.createdAt).toLocaleDateString()}
            </Typography>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleRead(article)}
              >
                Read More
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminTopArticleList;
