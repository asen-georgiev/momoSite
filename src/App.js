import React,{Component} from "react";
import {Route, Redirect, Switch} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Container from 'react-bootstrap/Container';
import Navigation from "./components/navigation";
import AdminLoginForm from "./admin/admin/adminLoginForm";
import RegisterAdminForm from "./admin/admin/registerAdminForm";
import {getCurrentAdmin} from "./services/adminLoginService";
import {getCurrentUser} from "./services/userLoginService";
import AdminPanel from "./admin/admin/adminPanel";
import Products from "./pages/products";
import Basket from "./pages/basket";
import AllAdminsList from "./admin/admin/allAdminsList";
import UpdateAdminForm from "./admin/admin/updateAdminForm";
import UserLoginForm from "./pages/user/userLoginForm";
import UserProfile from "./pages/user/userProfile";
import RegisterUserForm from "./admin/user/registerUserForm";
import RegisterUserFormUsr from "./pages/user/registerUserFormUsr";
import Contacts from "./pages/contacts/contacts";
import ImagesUpload from "./admin/images/imagesUpload";
import AllUsersList from "./admin/user/allUsersList";
import UpdateUserForm from "./admin/user/updateUserForm";


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
                    <Navigation/>
                    <Switch>
                        <Route path="/adminlogin" component={AdminLoginForm}/>
                        <Route path="/contacts" component={Contacts}/>
                        <Route path="/userregister" component={RegisterUserFormUsr}/>
                        <Route path="/userlogin" component={UserLoginForm}/>
                        {this.state.user !== null &&
                        <Route path="/userprofile" component={UserProfile}/>}
                        <Route path="/products" component={Products}/>
                        <Route path="/basket" component={Basket}/>
                        {this.state.admin &&
                        <Switch>
                            <Route path="/admin/registeradmin" component={RegisterAdminForm}/>
                            <Route path="/admin/adminslist/:id" component={UpdateAdminForm}/>
                            <Route path="/admin/adminslist" component={AllAdminsList}/>
                            <Route path="/admin/registeruser" component={RegisterUserForm}/>
                            <Route path="/admin/userslist/:id" component={UpdateUserForm}/>
                            <Route path="/admin/userslist" component={AllUsersList}/>
                            <Route path="/admin/imagesupload" component={ImagesUpload}/>
                            <Route path="/admin" component={AdminPanel}/>
                        </Switch>}
                    </Switch>
            </div>
        );
    }
}

export default App;

