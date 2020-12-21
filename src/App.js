import React,{Component} from "react";
import {Route, Redirect, Switch} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Container from 'react-bootstrap/Container';
import Navigation from "./components/navigation";
import AdminLoginForm from "./admin/adminLoginForm";
import {getCurrentAdmin} from "./services/adminLoginService";
import {getCurrentUser} from "./services/userLoginService";
import AdminPanel from "./admin/adminPanel";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            admin:null,
            user:null
        }
    }

    componentDidMount() {
        const admin = getCurrentAdmin();
        const user = getCurrentUser();
        this.setState({admin,user})
        console.log(admin,user);
    }

    render() {
        return (
            <div>
                <ToastContainer/>
                <Container className="app-main-container p-0" fluid={true}>
                    <Navigation/>
                    <Switch>
                        <Route path="/adminlogin" component={AdminLoginForm}/>
                        {this.state.admin &&
                        <Switch>
                            <Route path="/admin" component={AdminPanel}/>
                        </Switch>}
                    </Switch>
                </Container>
            </div>
        );
    }
}

export default App;

