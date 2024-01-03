import React, { useEffect, useState } from 'react';
import './App.css';
import { Todo as TodoModel } from './models/todo';
import TodoConfigure from './components/todoConfigure';
import AddEditTodoDialog from './components/AddEditTodoDialog';

function App() {
  const [todos, setTodos] = useState<TodoModel[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<TodoModel | null>(null);

  const [showAddTodoDialog, setShowAddTodoDialog] = useState(false);
  const [showEditTodoDialog, setShowEditTodoDialog] = useState(false);

  useEffect(() => {
    async function loadTodos() {
      try {
        const response = await fetch("/api/todos", { method: "GET" });
        const todos = await response.json();
        setTodos(todos);

        if (todos.length > 0) {
          setSelectedTodo(todos[0]);
        }
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }

    loadTodos();
  }, []);

  return (
    <div className="App">
      <TodoConfigure selectedTodo = {selectedTodo} todos={todos} onSelect={(todo) => setSelectedTodo(todo)} onNewTodoClicked={() => setShowAddTodoDialog(true)} onEditTodoClicked={() => setShowEditTodoDialog(true)} />

      {showAddTodoDialog && <AddEditTodoDialog
        onDismiss={() => setShowAddTodoDialog(false)}
        onTodoSaved={(newTodo) => {
          setTodos([...todos, newTodo]);
          setSelectedTodo(newTodo);
          setShowAddTodoDialog(false);
        }}
      />}

      {selectedTodo && showEditTodoDialog && <AddEditTodoDialog
        todoToEdit={selectedTodo}
        onDismiss={() => setShowEditTodoDialog(false)}
        onTodoSaved={(updatedTodo) => {
          setTodos(todos.map(existingTodo => existingTodo._id === updatedTodo._id ? updatedTodo : existingTodo));
          setSelectedTodo(updatedTodo);
          setShowEditTodoDialog(false)
        }}
      />}

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
};

export default App;