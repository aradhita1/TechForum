import React, { useEffect, useState } from "react";
import "./adminstyle.css";
import api from "../axiosinstance";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface Article {
  id: string;
  title: string;
  empid: string;
  categoryid: string;
  author: string;
  tags: string[];
  status: string;
  content: string;
  likes: number;
  shares: number;
}

interface AverageCategoryView {
  category: number;
  likes: number;
}

interface ICategory{
  categoryId: number;
  categoryName: string;
}

const ViewAnalytics: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [averageLikes, setAverageLikes] = useState<AverageCategoryView[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articlesRes = await api.get<{ $values: Article[] }>(
          "/Employee/GetAllArticles"
        );
        setArticles(articlesRes.data.$values);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchAverageLikes = async () => {
      try {
        const response = await api.get("/Admin/CategoryAverage");
        setAverageLikes(response.data.$values);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get("/Admin/GetAllcategories");
        setCategories(response.data.$values);
        console.log("Fetched categories:", response.data.$values);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
    fetchArticles();
    fetchAverageLikes();
  }, []);

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.categoryId === categoryId);
    return category ? category.categoryName : "Unknown";
  };

  const dataPointsLikes = articles.map((article) => ({
    x: article.title,
    y: article.likes,
  }));

  const dataPointsShares = articles.map((article) => ({
    x: article.title,
    y: article.shares,
  }));

  const barOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: articles.map((article) => article.title),
    },
    yaxis: {
      title: {
        text: "Count",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      shared: true,
      intersect: false,
      enabled: true,
    },
  };

  const barSeries = [
    {
      name: "Likes",
      data: dataPointsLikes,
    },
    {
      name: "Shares",
      data: dataPointsShares,
    },
  ];

  const radialBarOptions: ApexOptions = {
    chart: {
      type: "radialBar",
      height: 350,
      foreColor: "black",
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
          },
          total: {
            show: true,
            label: "Average Likes",
            color: "navyblue", 
            formatter: function (w) {
              return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString();
            },
          },
        },
      },
    },
    labels: averageLikes.map((item) => getCategoryName(item.category)),
  };
  

  const radialBarSeries = averageLikes.map((item) => item.likes);

  return (
    <div className="analytics-container">
      <h1>View Analytics</h1>
      <div style={{width: '100%'}}>
      <h2>Articles Vs Likes|Shares</h2>
      <Chart options={barOptions} series={barSeries} type="bar" height={350} />
      <br/>
      <h2>Categories Vs Likes</h2>
      <Chart options={radialBarOptions} series={radialBarSeries} type="radialBar" height={350} />
      </div>
    </div>
  );
};

export default ViewAnalytics;
