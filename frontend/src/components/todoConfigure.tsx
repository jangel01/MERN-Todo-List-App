import { Button, Stack } from "react-bootstrap";
import SelectTodo from "./selectTodo";
import { Todo as TodoModel } from "../models/todo";
import { FaPlus } from "react-icons/fa";
import styleUtils from "../styles/utils.module.css";

interface TodoConfigureProps {
  selectedTodo?: TodoModel | null,
  todos: TodoModel[];
  onSelect: (selectedTodo: TodoModel) => void;
  onNewTodoClicked: () => void,
  onEditTodoClicked: () => void,
}

const TodoConfigure = ({ selectedTodo, todos, onSelect, onNewTodoClicked, onEditTodoClicked }: TodoConfigureProps) => {

  return (
    <Stack direction="horizontal" gap={3}>
      {todos.length > 0 ? (
        <>
          <SelectTodo selectedTodo={selectedTodo} todos={todos} onSelect={onSelect} />
          <Button variant="secondary" className={`${styleUtils.blockCenter} ${styleUtils.flexCenter}`} 
          onClick={onNewTodoClicked}>

            <FaPlus />
            New
          </Button>
          <Button variant="secondary" className={`${styleUtils.blockCenter}`} onClick={onEditTodoClicked}>Edit</Button>
        </>
      ) : (
        <div>No todo available</div>
      )}
    </Stack>
  );
};

export default TodoConfigure;
