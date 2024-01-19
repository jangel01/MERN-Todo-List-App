import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginModal from './components/LoginModal';
import NavBar from './components/NavBar';
import SignUpModal from './components/SignUpModal';
import { User as UserModel } from './models/user';
import * as UsersApi from "./network/users_api";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import TodosPage from './pages/TodosPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';
import appStyles from './styles/App.module.css';

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
    <BrowserRouter>
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
          <Routes>
            <Route path='/' element={<TodosPage loggedInUser={loggedInUser} />} />
            <Route path='/privacy' element ={<PrivacyPage/>}/>
            <Route path='/*' element={<NotFoundPage/>}/>
          </Routes>
        </Container>
        <ToastContainer position='top-center' />
      </div>
    </BrowserRouter>
  );
};

export default App;