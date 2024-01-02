import { Button, Stack } from "react-bootstrap";
import SelectTodo from "./selectTodo";
import { Todo as TodoModel } from "../models/todo";
import { FaPlus } from "react-icons/fa";
import styleUtils from "../styles/utils.module.css";

interface TodoConfigureProps {
  todos: TodoModel[];
  onSelect: (selectedTodo: TodoModel) => void;
  onNewTodoClicked: () => void,
}

const TodoConfigure = ({ todos, onSelect, onNewTodoClicked }: TodoConfigureProps) => {

  return (
    <Stack direction="horizontal" gap={3}>
      {todos.length > 0 ? (
        <>
          <SelectTodo todos={todos} onSelect={onSelect} />
          <Button variant="secondary" className={`${styleUtils.blockCenter} ${styleUtils.flexCenter}`} onClick={onNewTodoClicked}>
            <FaPlus />
            New
          </Button>
        </>
      ) : (
        <div>No todo available</div>
      )}
    </Stack>
  );
};

export default TodoConfigure;
