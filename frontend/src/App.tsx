import { useEffect, useState } from 'react';
import './App.css';
import { Todo as TodoModel } from './models/todo';
import * as TodosApi from "./network/todos_api"
import { Container} from 'react-bootstrap';
import TodoConfigure from './components/todoConfigure';
import AddEditTodoDialog from './components/AddEditTodoDialog';
import SectionLayout from './components/sectionLayout';

function App() {
  const [todos, setTodos] = useState<TodoModel[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<TodoModel | null>(null);

  const [showAddTodoDialog, setShowAddTodoDialog] = useState(false);
  const [showEditTodoDialog, setShowEditTodoDialog] = useState(false);

  useEffect(() => {
    async function loadTodos() {
      try {
        const todos = await TodosApi.fetchTodos();
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

  async function deleteTodo(todo: TodoModel) {
    try {
      await TodosApi.deleteTodo(todo._id);
      setTodos(todos.filter(existingTodo => existingTodo._id !== todo._id))
      setSelectedTodo(todos.length > 0 ? todos[0] : null);
      setShowEditTodoDialog(false);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <div className="App">
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
        onDeleteTodoClicked={() => deleteTodo(selectedTodo)}
        onDismiss={() => setShowEditTodoDialog(false)}
        onTodoSaved={(updatedTodo) => {
          setTodos(todos.map(existingTodo => existingTodo._id === updatedTodo._id ? updatedTodo : existingTodo));
          setSelectedTodo(updatedTodo);
          setShowEditTodoDialog(false);
        }}
      />}

      <Container>
        <TodoConfigure
          selectedTodo={selectedTodo}
          todos={todos}
          onSelect={(todo) => setSelectedTodo(todo)}
          onNewTodoClicked={() => setShowAddTodoDialog(true)}
          onEditTodoClicked={() => setShowEditTodoDialog(true)} />

          <SectionLayout todo={selectedTodo}/>
      </Container>
    </div>
  );
};

export default App;