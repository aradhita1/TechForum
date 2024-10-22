import React, { useEffect, useState } from "react";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from "@mui/material";
import api from "../axiosinstance";

interface Article {
  artId: number;
  title: string;
  content: string;
  status: string;
  author: string;
  createdAt: string;
}

const DraftedArticlesQueue: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchDraftedArticles = async () => {
      try {
        const response = await api.get("/Admin/GetDraftedArticles");
        console.log("API response:", response.data);
        if (response.data && Array.isArray(response.data.$values)) {
          setArticles(response.data.$values);
        } else {
          console.error(
            "API response is not in the expected format:",
            response.data
          );
        }
      } catch (error) {
        console.error("Error fetching drafted articles:", error);
      }
    };

    fetchDraftedArticles();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await api.put(`/Admin/Approve/${id}`);
      setArticles(articles.filter((article) => article.artId !== id));
      window.location.reload();
    } catch (error) {
      console.error("Error approving article:", error);
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await api.put(`/Admin/Archive/${id}`);
      setArticles(articles.filter((article) => article.artId !== id));
    } catch (error) {
      console.error("Error archiving article:", error);
    }
  };

  return (
    <div className="draft-container">
      <h3>Drafted Articles Queue</h3>
      <List style={{ width: "100%" }}>
        {articles.map((article) => (
          <ListItem key={article.artId}>
            <ListItemText
              primary={article.title}
              secondary={<div>{article.status}<p>____By {article.author} </p></div>}
            />

            <ListItemSecondaryAction
              style={{ marginRight: "0", marginLeft: "10px" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleApprove(article.artId)}
                style={{ marginRight: "10px" }}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleArchive(article.artId)}
              >
                Archive
              </Button>
            </ListItemSecondaryAction>
            <Divider style={{ backgroundColor: "grey" }} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default DraftedArticlesQueue;
