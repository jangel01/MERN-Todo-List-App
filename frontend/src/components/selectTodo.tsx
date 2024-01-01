import { Form } from 'react-bootstrap';
import { Todo as TodoModel } from "../models/todo";

interface SelectedTodoProps {
  todos: TodoModel[];
  onChange: (selectedTodo: TodoModel) => void;
}

const SelectTodo = ({ todos, onChange }: SelectedTodoProps) => {  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTodo = todos.find((todo) => todo.name === e.target.value);

    if (selectedTodo) {
      onChange(selectedTodo);
    }
  };

  return (
    <Form.Select aria-label="Default select example" onChange={handleSelectChange}>
      {todos.map((todo) => (
        <option key={todo.name} value={todo.name}>{todo.name}</option>
      ))}
    </Form.Select>
  );
}

export default SelectTodo;