import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './components/NavBar';
import appStyles from './styles/App.module.css';
import { useEffect, useState } from 'react';
import { User as UserModel } from './models/user';
import * as UsersApi from "./network/users_api";
import SignUpModal from './components/SignUpModal';
import LoginModal from './components/LoginModal';
import TodosPageLoggedInView from './components/TodosPageLoggedInView';
import TodosPageLoggedOutView from './components/TodosPageLoggedOutView';

function App() {
  const [loggedInUser, setLoggedInUser] = useState<UserModel | null>(null);

  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    async function fethedLoggedInUser() {
      try {
        const user = await UsersApi.getLoggedInUser();
        setLoggedInUser(user);
      } catch (error) {
        console.error(error);
      }
    }

    fethedLoggedInUser();
  }, []);

  return (
    <div>
      {showSignUpModal &&
        <SignUpModal
          onDismiss={() => setShowSignUpModal(false)}
          onSignUpSuccessful={(user) => {
            setLoggedInUser(user)
            setShowSignUpModal(false);
          }
          }
        />
      }

      {showLoginModal &&
        <LoginModal
          onDismiss={() => setShowLoginModal(false)}
          onLoginSuccessful={(user) => {
            setLoggedInUser(user)
            setShowLoginModal(false);
          }
          }
        />
      }

      <NavBar loggedInUser={loggedInUser}
        onSignUpClicked={() => setShowSignUpModal(true)}
        onLoginClicked={() => setShowLoginModal(true)}
        onLogoutSuccessful={() => setLoggedInUser(null)} />

      <Container className={appStyles.pageContainer}>
        {loggedInUser ?
          <TodosPageLoggedInView />
          :
          <TodosPageLoggedOutView />
        }
      </Container>
      <ToastContainer position='top-center' />
    </div>
  );
};

export default App;