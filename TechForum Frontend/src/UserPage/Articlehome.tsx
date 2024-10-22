import React, { useEffect, useState, useCallback, memo } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Button,
  IconButton,
  TextField,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  ToggleButton,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Accordion,
} from "@mui/material";
import { Favorite, ShareTwoTone } from "@mui/icons-material";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";
import "./userstyle.css";
import api from "../axiosinstance";
import { UserState } from "../userSlice";
import { RootState } from "../store";
import { useSelector } from "react-redux";

interface Comments {
  commentId: number;
  userID: number;
  userName: string;
  content: string;
  createdAt: string;
}

interface Article {
  artId: number;
  title: string;
  author: string;
  tags: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  shares: number;
  comments: Comments[];
}

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [commentTexts, setCommentTexts] = useState<{ [key: number]: string }>(
    {}
  );
  const user: UserState = useSelector((state: RootState) => state);
  const [open, setOpen] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentsnew, setCommentsnew] = useState(false);

  const [likedArticles, setLikedArticles] = useState<{
    [key: number]: boolean;
  }>(() => {
    const saved = localStorage.getItem("likedArticles");
    return saved ? JSON.parse(saved) : {};
  });

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/Employee/GetAllArticles`);
      const response2 = await api.get(`/Employee/GetAllComments`);
      if (response.status === 200 && response2.status === 200) {
        const articlesData = await response.data.$values;
        articlesData.sort((a: { createdAt: Date }, b: { createdAt: Date }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const commentsData = await response2.data.$values;
        if (Array.isArray(articlesData) && Array.isArray(commentsData)) {
          const articlesWithComments = articlesData.map((article) => ({
            ...article,
            comments: commentsData.filter(
              (comment) => comment.artId === article.artId
            ),
          }));
          setArticles(articlesWithComments);
        } else {
          console.error(
            "Fetched data is not in the expected format:",
            articlesData,
            commentsData
          );
        }
      } else {
        console.error(
          "Failed to fetch articles or comments:",
          response.statusText,
          response2.statusText
        );
        setError("Failed to fetch articles or comments.");
      }
    } catch (error) {
      console.error("Error fetching articles or comments:", error);
      setError("Error fetching articles or comments.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLatestComments = useCallback(async () => {
    try {
      const response = await api.get(`/Employee/GetAllComments`);
      if (response.status === 200) {
        const commentsData = await response.data.$values;
        setComments(commentsData);
      } else {
        console.error("Failed to fetch comments:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    if (commentsnew === true) {
      fetchLatestComments();
      setCommentsnew(false);
    }
  }, [commentsnew, fetchLatestComments]);

  const handleLike = async (artId: number) => {
    try {
      if (!likedArticles[artId]) {
        await api.post(`/Employee/LikeArticle/${artId}`);
      } else {
        await api.post(`/Employee/UnLikeArticle/${artId}`);
      }
    } catch (error) {
      console.error("Error liking or unliking article:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("likedArticles", JSON.stringify(likedArticles));
  }, [likedArticles]);

  const handleShare = async (artId: number) => {
    try {
      await api.post(`/Employee/ShareArticle/${artId}`);
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.artId === artId
            ? { ...article, shares: article.shares + 1 }
            : article
        )
      );
      handleClickOpen(artId);
    } catch (error) {
      console.error("Error sharing article:", error);
    }
  };

  const handleClickOpen = async (artId: number) => {
    setCurrentArticleId(artId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentArticleId(null as any as number);
  };

  const handleCommentTextChange = (text: string, artId: number) => {
    setCommentTexts((prevState) => ({
      ...prevState,
      [artId]: text,
    }));
    setCommentsnew(true);
  };

  const handleComment = async (artId: number) => {
    try {
      const commentData = {
        commentId: 0,
        artId: artId,
        userId: user.userId,
        userName: user.name,
        content: commentTexts[artId],
        createdAt: new Date(),
      };
      await api.post(
        `/Employee/${user.userId}/CommentArticle/${artId}`,
        commentData
      );
      setCommentTexts("");
      fetchArticles();
    } catch (error) {
      console.error("Error commenting on article:", error);
    }
  };

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="article-container" style={{ overflow: "hidden" }}>
      <TextField
        label="Search articles..."
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
        fullWidth
        margin="normal"
      />
      <h2>Published Articles</h2>
      {loading ? (
        <p>Loading articles...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredArticles.length > 0 ? (
        filteredArticles.map((article) => (
          <Card key={article.artId} className="article">
            <CardContent>
              <h3>{article.title}</h3>
              <p>
                By {article.author} on{" "}           
                {new Date(article.createdAt).toLocaleDateString()} 
              </p>
              <p style={{fontSize:'small', color:'grey'}}>
                Last Updated on {" "}
                {new Date(article.updatedAt).toLocaleDateString()}
              </p>
              <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
              <div>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon ></ExpandMoreIcon>}
                    aria-controls="article-comments"
                    id="article-comments-header"
                    style={{
                      marginTop:'15px',
                      fontWeight: 'bold',
                      fontSize: 'small',
                      textAlign: 'right',
                      backgroundColor: '#E6E6E6'
                    }}
                  >
                   <p style={{ color:'black' }}> Comments </p>
                  </AccordionSummary>
                  <AccordionDetails>
                    {article.comments.map((comment) => (
                      <Typography
                        key={comment.commentId}
                        sx={{
                          color: 'grey',
                          fontSize: 'small',
                          textAlign: 'right',
                        }}
                      >
                        {comment.content} - {comment.userName} 
                        
                      </Typography>
                    ))}
                  </AccordionDetails>
                </Accordion>
              </div>
            </CardContent>
            <CardActions>
              <ToggleButton
                value="check"
                selected={likedArticles[article.artId] || false}
                onChange={() => {
                  setLikedArticles((prev) => ({
                    ...prev,
                    [article.artId]: !prev[article.artId],
                  }));
                  handleLike(article.artId);
                }}
              >
                <Favorite
                  style={{
                    color: likedArticles[article.artId] ? "red" : "white",
                  }}
                />
                {likedArticles[article.artId]
                  ? article.likes + 1
                  : article.likes}
              </ToggleButton>

              <IconButton
                onClick={() => handleShare(article.artId)}
                style={{ fontSize: 20 }}
              >
                <ShareTwoTone fontSize="small" /> {article.shares}
              </IconButton>
              <TextField
                label="Add a comment"
                variant="outlined"
                value={commentTexts[article.artId] || ""}
                onChange={(e) =>
                  handleCommentTextChange(e.target.value, article.artId)
                }
                fullWidth
                margin="normal"
                style={{ marginTop: 2, marginBottom: 2 }}
              />
              <Button
                onClick={() => handleComment(article.artId)}
                sx={{ width: "100%" }}
              >
                Comment
              </Button>
            </CardActions>
            <div className="comments"></div>
          </Card>
        ))
      ) : (
        <p>No articles available.</p>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Share this article</DialogTitle>
        <DialogContent>
          <FacebookShareButton
            style={{
              margin: "5px",
              display: "flex",
              gap: "5px",
              alignItems: "center",
            }}
            url={`https://yourwebsite.com/articles/${currentArticleId}`}
          >
            <FacebookIcon size={32} />
            Share on Facebook
          </FacebookShareButton>
          <TwitterShareButton
            style={{
              margin: "5px",
              display: "flex",
              gap: "5px",
              alignItems: "center",
            }}
            url={`https://yourwebsite.com/articles/${currentArticleId}`}
          >
            <TwitterIcon size={32} />
            Share on Twitter
          </TwitterShareButton>
          <LinkedinShareButton
            style={{
              margin: "5px",
              display: "flex",
              gap: "5px",
              alignItems: "center",
            }}
            url={`https://yourwebsite.com/articles/${currentArticleId}`}
          >
            <LinkedinIcon size={32} />
            Share on LinkedIn
          </LinkedinShareButton>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default memo(ArticleList);
