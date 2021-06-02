import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import GitHubIcon from "@material-ui/icons/GitHub";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import Header from "./Header";
import MainFeaturedPost from "./MainFeaturedPost";
import FeaturedPost from "./FeaturedPost";
import Main from "./Main";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
}));

const sections = [
  { title: "Teknoloji", url: "technology" },
  { title: "Dizayn", url: "design" },
  { title: "Kültür", url: "culture" },
  { title: "İş", url: "business" },
  { title: "Politika", url: "politics" },
  { title: "Seçenek", url: "opinion" },
  { title: "Bilim", url: "science" },
  { title: "Sağlık", url: "health" },
  { title: "Stil", url: "style" },
  { title: "Seyehat", url: "travel" },
];

const featuredPosts = [
  {
    title: "Featured post",
    date: "Nov 12",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    image: "https://source.unsplash.com/random",
    imageText: "Image Text",
    link: "/test",
  },
  {
    title: "Post title",
    date: "Nov 11",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    image: "https://source.unsplash.com/random",
    imageText: "Image Text",
    link: "/test-asd",
  },
];

const sidebar = {
  title: "SideBar",
  description: "description",
  archives: [
    { title: "March 2020", url: "march/2020" },
    { title: "February 2020", url: "february/2020" },
    { title: "January 2020", url: "january/2020" },
    { title: "November 1999", url: "november/2020" },
    { title: "October 1999", url: "october/2020" },
    { title: "September 1999", url: "september/2020" },
    { title: "August 1999", url: "august/2020" },
    { title: "July 1999", url: "july/2020" },
    { title: "June 1999", url: "june/2020" },
    { title: "May 1999", url: "may/2020" },
    { title: "April 1999", url: "april/2020" },
  ],
  social: [
    { name: "GitHub", icon: GitHubIcon },
    { name: "Twitter", icon: TwitterIcon },
    { name: "Facebook", icon: FacebookIcon },
  ],
};

export default function Blog() {
  const classes = useStyles();

  const [data, setData] = useState();
  const mainFeaturedPost = { data };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/random", {
        headers: {
          "x-access-token": JSON.parse(localStorage.getItem("user"))?.accessToken,
        },
      })
      .then((res) => setData(res.data));
  }, []);
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title="Blog" sections={sections} />
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <FeaturedPost key={post.title} post={post} />
            ))}
          </Grid>
          <Grid container spacing={5} className={classes.mainGrid}>
            <Main title="Test" />
            <Sidebar
              title={sidebar.title}
              description={sidebar.description}
              archives={sidebar.archives}
              social={sidebar.social}
            />
          </Grid>
        </main>
      </Container>
      <Footer title="Footer" description="Copyright" />
    </React.Fragment>
  );
}
