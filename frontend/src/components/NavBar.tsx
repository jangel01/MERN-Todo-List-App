import { Container, Nav, Navbar } from "react-bootstrap";
import { User as UserModel} from "../models/user";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";

interface NavBarProps {
    loggedInUser: UserModel | null,
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
    onLogoutSuccessful: () => void,
}

const NavBar = ({loggedInUser, onSignUpClicked, onLoginClicked, onLogoutSuccessful} : NavBarProps) => {
    return ( 
        <Navbar bg="primary" variant="dark" expand="sm" sticky="top">
            <Container>
                <Navbar.Brand>
                    Todo List App
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar"/>

                <Navbar.Collapse id="main-navbar">
                    <Nav className="ms-auto">
                        {loggedInUser ? 
                        <NavBarLoggedInView user={loggedInUser} onLogoutSuccessful={onLogoutSuccessful}/> 
                        : <NavBarLoggedOutView onLoginClicked={onLoginClicked} onSignUpClicked={onSignUpClicked}/>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
     );
}
 
export default NavBar;