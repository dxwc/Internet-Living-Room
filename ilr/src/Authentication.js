import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";

////////////////////////////////////////////////////////////
// 1. Click the public page
// 2. Click the protected page
// 3. Log in
// 4. Click the back button, note the URL each time

function Authentication() {
  return (
    <Router>
    <div>
      <nav>
        <Link className="navbar-brand" to="/">Internet Living Room</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
         <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
          </li>
        </ul>
        </div>
        <AuthButton />
      </nav>
      </div>
    </Router>

  );
}

const Auth = {
  isAuthenticated: false,
  authenticate(username, password, cb) {
    fetch('/auth/login', {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
          "Content-Type": "application/json; charset=utf-8",
          // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }).then(response => {
      if(response.status === 200) {
        this.isAuthenticated = true;
        return response.json();
      }
    }).then(body => {
      console.log(body);
      cb();
    });
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

const AuthButton = withRouter(
  ({ history }) =>
    Auth.isAuthenticated ? (
      <div>
        <input type="button" value="create channel"/>
        <button onClick={ () => {
          Auth.signout(() => history.push("/"))
        }}>
        </button>
      </div>
    ):(
      <Route path='/' component={Login} />
    )
);
/*
function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        Auth.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}
/*
function Public() {
  return <h3>Public</h3>;
}

function Protected() {
  return <h3>Protected</h3>;
}
*/
const SignUp ={
  signup(firstName, lastName, username, password, cb){
    fetch('/auth/signup', {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        fname: firstName,
        lname: lastName,
        uname: username,
        upass: password,
      }),
    }).then(response => {
      if(response.status == 200){
        alert(response.json);
        Auth.authenticate(username, password);

      }
    }).then(body => {
      //console.log(body);
      cb();
    });
  }
}
class Login extends React.Component {
  state = {
    redirectToReferrer: false,
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  }

  signUp = () => {
    SignUp.signup(this.state.firstName, this.state.lastName, this.state.username,
      this.state.password, ()=>{
        this.setState({ redirectToReferrer: true });
      });
  }

  login = () => {
    Auth.authenticate(this.state.username, this.state.password, () => {
      this.setState({ redirectToReferrer: true });
    });
  }

  firstNameChanged = (event) => {
    this.setState({ firstName: event.target.value });
  }
  lastNameChanged = (event) => {
    this.setState({ lastName: event.target.value });
  }
  usernameChanged = (event) => {
    this.setState({ username: event.target.value });
  }

  passwordChanged = (event) => {
    this.setState({ password: event.target.value });
  }

  render(){
    let { from } = this.props.location.state || { from: { pathname: "/" } };
    let { redirectToReferrer } = this.state;
    if (redirectToReferrer) return <Redirect to={from} />;

    return (
      <div>
      <div>
        <input className="btn btn-outline-success my-2 my-sm-0" type="button" value="sign up" data-toggle="modal" 
        data-target="#signupModal" />
        <input className="btn btn-outline-success my-2 my-sm-0" type="button" value="Login" data-toggle="modal" data-target="#loginModal"/>
      </div>
         <div className="modal fade" rote="dialog" id="signupModal">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
        <h3 className = "modal-title">Modal Sign Up Form</h3>
        <button type="button" className="close" data-dismiss="modal">&times;</button>
      </div>

      <form className="modal-body">
        <div className="form-group">
          <input type="text" name="fname" className="form-control" placeholder="First Name" value={this.state.firstName} onChange={this.firstNameChanged}/>
        </div>
        <div className="form-group">
          <input type="text" name="lname" className="form-control" placeholder="Last Name" value={this.state.lastName} onChange={this.lastNameChanged}/>
        </div>
        <div className="form-group">
          <input type="text" name="uname" className="form-control" placeholder="Username" value={this.state.username} onChange={this.usernameChanged}/>
        </div>
        <div className="form-group">
          <input type="password" name="upass" className="form-control" placeholder="Password" value={this.state.password} onChange={this.passwordChanged}/>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-success" onClick={this.signUp}>Submit</button>
        </div>
        </form>
      </div>
    </div>
    </div>
        <div className="modal fade" rote="dialog" id="loginModal">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className = "modal-title">Modal Login Form</h3>
        <button type="button" className="close" data-dismiss="modal">&times;</button>
      </div>

      <form className="modal-body">
        <div className="form-group">
          <input type="text" name="uname" className="form-control" placeholder="Username" value={this.state.username} onChange={this.usernameChanged}/>
        </div>
        <div className="form-group">
          <input type="password" name="password" className="form-control" placeholder="Password" value={this.state.password} onChange={this.passwordChanged}/>
        </div>
      

      <div className="modal-footer">
        <button type="button" className="btn btn-success" onClick={this.login}>Submit</button>
      </div>
      </form>
    </div>
</div>
</div>
</div>

    );
  }
}

export default Authentication;