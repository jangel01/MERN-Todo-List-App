import { Form } from 'react-bootstrap';
import { Todo as TodoModel } from "../models/todo";

interface SelectedTodoProps {
  selectedTodo?: TodoModel | null
  todos: TodoModel[];
  onSelect: (selectedTodo: TodoModel) => void;
}

const SelectTodo = ({ selectedTodo, todos, onSelect}: SelectedTodoProps) => {  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTodo = todos.find((todo) => todo._id === e.target.value);

    if (selectedTodo) {
      onSelect(selectedTodo);
    }
  };

  return (
    <Form.Select aria-label="Select todo" onChange={handleSelectChange} value={selectedTodo ? selectedTodo._id : ''}>
      {todos.map((todo) => (
        <option key={todo._id} value={todo._id}>{todo.todoName}</option>
      ))}
    </Form.Select>
  );
};

export default SelectTodo;