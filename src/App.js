import React,{Component} from "react";
import {Route, Redirect, Switch} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Container from 'react-bootstrap/Container';
import Navigation from "./components/navigation";
import AdminLoginForm from "./admin/adminLoginForm";


class App extends Component {
    render() {
        return (
            <div>
                <ToastContainer/>
                <Container className="app-main-container p-0" fluid={true}>
                    <Navigation/>
                    <Switch>
                        <Route path="/adminlogin" component={AdminLoginForm}/>
                    </Switch>
                </Container>
            </div>
        );
    }
}

export default App;

