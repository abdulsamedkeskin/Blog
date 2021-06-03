import React from "react";
import PropTypes from "prop-types";
import {
  Toolbar,
  Button,
  IconButton,
  Typography,
  Link,
  makeStyles,
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AddCircleIcon from '@material-ui/icons/AddCircle';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: "space-between",
    overflowX: "auto",
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
}));

export default function Header(props) {
  const classes = useStyles();
  const { sections, title } = props;
  return (
    <React.Fragment>
      <Toolbar className={classes.toolbar}>
        <Button size="small" onClick={() => window.location.replace("/")} >Ana Sayfa</Button>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          className={classes.toolbarTitle}
        >
          {title}
        </Typography>
        <Button variant="outlined" size="small">
          {JSON.parse(localStorage.getItem("user"))?.username}
        </Button>
        <IconButton
          aria-label="New Blog"
          onClick={() => {
            window.location.replace("/new")
          }}
        >
          <AddCircleIcon />
        </IconButton>
        <IconButton
          aria-label="Log out"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.reload()
          }}
        >
          <ExitToAppIcon />
        </IconButton>
        
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        className={classes.toolbarSecondary}
      >
        {sections.map((section) => (
          <Link
            color="inherit"
            noWrap
            key={section.title}
            variant="body2"
            href={section.url}
            className={classes.toolbarLink}
          >
            {section.title}
          </Link>
        ))}
      </Toolbar>
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.array,
  title: PropTypes.string,
};
