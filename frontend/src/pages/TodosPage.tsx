import { Container } from "react-bootstrap";
import TodosPageLoggedInView from "../components/TodosPageLoggedInView";
import TodosPageLoggedOutView from "../components/TodosPageLoggedOutView";
import { User as UserModel } from "../models/user";

interface TodosPageProps {
  loggedInUser: UserModel | null
}

const TodosPage = ({ loggedInUser }: TodosPageProps) => {
  return (
    <Container>
      {loggedInUser ?
        <TodosPageLoggedInView />
        :
        <TodosPageLoggedOutView />
      }
    </Container>
  );
}

export default TodosPage;