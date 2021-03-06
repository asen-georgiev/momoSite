import React, {Component} from "react";
import {Route, Switch} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import jwtDecode from "jwt-decode";
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
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
import AllEmailsList from "./admin/emails/allEmailsList";
import UpdateUserFormUsr from "./pages/user/updateUserFormUsr";
import RegisterBioForm from "./admin/bios/registerBioForm";
import AllBiosList from "./admin/bios/allBiosList";
import UpdateBioForm from "./admin/bios/updateBioForm";
import RegisterBlogForm from "./admin/blogs/registerBlogForm";
import AllBlogsList from "./admin/blogs/allBlogsList";
import UpdateBlogForm from "./admin/blogs/updateBlogForm";
import Blog from "./pages/blog/blog";
import BlogDetails from "./pages/blog/blogDetails";
import AllCommentsList from "./admin/comments/AllCommentsList";
import RegisterDesignForm from "./admin/designs/registerDesignForm";
import AllDesignsList from "./admin/designs/allDesignsList";
import UpdateDesignForm from "./admin/designs/updateDesignForm";
import Footer from "./components/footer";
import Biography from "./pages/biography/biography";
import Designs from "./pages/designs/designs";
import DesignsDetails from "./pages/designs/designsDetails";
import Homepage from "./pages/homepage/homepage";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            admin: null,
            user: null
        }
    }

    componentDidMount() {
        const jwtAdmin = getCurrentAdmin();
        if (jwtAdmin !== null) {
            const admin = jwtDecode(jwtAdmin);
            this.setState({admin});
            console.log(admin);
        }
        const jwtUser = getCurrentUser();
        if (jwtUser !== null) {
            const user = jwtDecode(jwtUser);
            this.setState({user});
            console.log(user);
        }
    }


    render() {
        console.log(this.state);
        return (
            <div>
                <ToastContainer/>
                <Navigation/>
                <Switch>
                    <Route path="/adminlogin" component={AdminLoginForm}/>
                    <Route path="/biography" component={Biography}/>
                    <Route path="/blog/:id" component={BlogDetails}/>
                    <Route path="/blog" component={Blog}/>
                    <Route path="/contacts" component={Contacts}/>
                    <Route path="/designs/:id" component={DesignsDetails}/>
                    <Route path="/designs" component={Designs}/>
                    <Route path="/userlogin" component={UserLoginForm}/>
                    <Route exact path="/" component={Homepage}/>
                    {this.state.user !== null &&
                    <Switch>
                        <Route path="/userprofile/:id" component={UpdateUserFormUsr}/>
                        <Route path="/userprofile" component={UserProfile}/>
                    </Switch>}
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
                        <Route path="/admin/registerbio" component={RegisterBioForm}/>
                        <Route path="/admin/bioslist/:id" component={UpdateBioForm}/>
                        <Route path="/admin/bioslist" component={AllBiosList}/>
                        <Route path="/admin/registerblog" component={RegisterBlogForm}/>
                        <Route path="/admin/blogslist/:id" component={UpdateBlogForm}/>
                        <Route path="/admin/blogslist" component={AllBlogsList}/>
                        <Route path="/admin/commentslist" component={AllCommentsList}/>
                        <Route path="/admin/registerdesign" component={RegisterDesignForm}/>
                        <Route path="/admin/designslist/:id" component={UpdateDesignForm}/>
                        <Route path="/admin/designslist" component={AllDesignsList}/>
                        <Route path="/admin/emailslist" component={AllEmailsList}/>
                        <Route path="/admin/imagesupload" component={ImagesUpload}/>
                        <Route path="/admin" component={AdminPanel}/>
                    </Switch>}
                    {this.state.user === null &&
                        <Route path="/userregister" component={RegisterUserFormUsr}/>
                    }
                </Switch>
                <Footer/>
            </div>
        );
    }
}

export default App;

