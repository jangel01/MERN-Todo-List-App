import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import SelectTodo from "./selectTodo";
import { Todo as TodoModel } from "../models/todo";
import { FaPlus } from "react-icons/fa";
import styleUtils from "../styles/utils.module.css";
import { MdModeEditOutline } from "react-icons/md";

interface TodoConfigureProps {
  selectedTodo?: TodoModel | null,
  todos: TodoModel[];
  onSelect: (selectedTodo: TodoModel) => void;
  onNewTodoClicked: () => void,
  onEditTodoClicked: () => void,
}

const TodoConfigure = ({ selectedTodo, todos, onSelect, onNewTodoClicked, onEditTodoClicked}: TodoConfigureProps) => {

  return (
    <Row className="gy-3">
      <Col className="col-12 col-xl-10">
        <SelectTodo selectedTodo={selectedTodo} todos={todos} onSelect={onSelect}/>
      </Col>

      <Col className="col-12 col-xl-2">
        <ButtonGroup className="me-2">
          <Button variant="secondary" className={`${styleUtils.flexCenter}`} onClick={onEditTodoClicked}>
            <MdModeEditOutline />
            Todo
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button variant="secondary" className={`${styleUtils.flexCenter}`}
            onClick={onNewTodoClicked}>
            <FaPlus />
            Todo
          </Button>
        </ButtonGroup>
      </Col>
    </Row>
  );
};

export default TodoConfigure;
