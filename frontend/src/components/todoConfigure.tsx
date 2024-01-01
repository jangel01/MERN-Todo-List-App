import { Button, Stack } from "react-bootstrap";
import SelectTodo from "./selectTodo";
import { Todo as TodoModel } from "../models/todo";
import React, {useState } from "react";

interface TodoConfigureProps {
  todos: TodoModel[];
  onSelect: (selectedTodo: TodoModel) => void;
}

const TodoConfigure = ({ todos, onSelect }: TodoConfigureProps) => {
  const [, setSelectedTodo] = useState<TodoModel | null>(
    todos.length > 0 ? todos[0] : null
  );

  const handleSelectChange = (selectedTodo: TodoModel) => {
    setSelectedTodo(selectedTodo);
    onSelect(selectedTodo);
  };

  return (
    <Stack direction="horizontal" gap={3}>
      {todos.length > 0 ? (
        <>
          <SelectTodo todos={todos} onChange={handleSelectChange} />
          <Button variant="secondary">Submit</Button>
          <div className="vr" />
          <Button variant="outline-danger">Reset</Button>
        </>
      ) : (
        <div>No todo available</div>
      )}
    </Stack>
  );
};

export default TodoConfigure;
