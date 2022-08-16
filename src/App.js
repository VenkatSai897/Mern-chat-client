import Register from "./pages/register/Register";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useContext} from "react";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/Messenger";
import LandingPage from "./pages/LandingPage/LandingPage";
import Login from "./pages/Login/Login";
import InvalidRoute from "./pages/InvalidRoute/InvalidRoute";
import Profile from "./pages/profile/Profile";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Switch>
        <Route exact path = "/login"><Login/></Route>
        <Route exact path = "/"><LandingPage/></Route>
        <Route exact path="/login">{user ? <Redirect to="/chat" /> : <Login />}</Route>
        <Route exact path="/signup">
          {user ? <Redirect to="/" /> : <Register />}
        </Route>
        <Route exact path="/chat">
          {user ? <Messenger /> : <Redirect to ="/"/>}
        </Route>
        <Route exact path = "/profile/:id">
          {user ? <Profile/> : <InvalidRoute/>}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
