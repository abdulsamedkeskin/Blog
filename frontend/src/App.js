import "./App.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";
import Blog from "./blog/Blog.js";
import NewBlog from "./components/NewBlog";
import ReadBlog from "./components/ReadBlog";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = () => {
  const user = localStorage.getItem("user");
  return (
    <Router>
      {user ? (
        <Switch>
          <Route exact path={"/"} component={Blog} />
          <Route exact path={"/new"} component={NewBlog} />
          <Route exact path={"/blog/:id"} component={ReadBlog} /> :
        </Switch>
      ) : (
        <Switch>
          <Route exact path={["/signin","/"]} component={SignIn} />
          <Route exact path={"/signup"} component={SignUp} />
        </Switch>
      )}
    </Router>
  );
};

export default App;
