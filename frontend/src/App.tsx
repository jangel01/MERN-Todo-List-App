import React, { useEffect, useState } from 'react';
import './App.css';
import { Todo as TodoModel } from './models/todo';
import TodoConfigure from './components/todoConfigure';

function App() {
  const [todos, setTodos] = useState<TodoModel[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<TodoModel | null>(null);

  useEffect(() => {
    async function loadTodos() {
      try {
        const response = await fetch("/api/todos", { method: "GET" });
        const todos = await response.json();
        setTodos(todos);

        if (todos.length > 0) {
          handleTodoSelect(todos[0]);
        }
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }

    loadTodos();
  }, []);

  const handleTodoSelect = (todo: TodoModel) => {
    setSelectedTodo(todo);
  }

  return (
    <div className="App">
      <TodoConfigure todos={todos} onSelect={handleTodoSelect} />

      {selectedTodo && (
        <div>
          <h2>{selectedTodo.name}</h2>
          {selectedTodo.sections.map((section) => (
            <div key={section.name}>
              <h3>{section.name}</h3>
              <ul>
                {section.tasks.map((task) => (
                  <li key={task.description}>
                    {task.description} - {task.completed ? 'Completed' : 'Not Completed'}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;