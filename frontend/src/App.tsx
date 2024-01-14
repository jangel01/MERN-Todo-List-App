import { useEffect, useState } from 'react';
import './App.css';
import { Todo as TodoModel } from './models/todo';
import * as TodosApi from "./network/todos_api"
import { Button, Container } from 'react-bootstrap';
import TodoConfigure from './components/todoConfigure';
import AddEditTodoDialog from './components/AddEditTodoDialog';
import SectionLayout from './components/sectionLayout';
import appStyles from './styles/App.module.css';
import styleUtils from "./styles/utils.module.css";
import { FaPlus } from "react-icons/fa";

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
  
      setTodos(prevTodos => {
        const updatedTodos = prevTodos.filter(existingTodo => existingTodo._id !== todo._id);
        setSelectedTodo(updatedTodos.length > 0 ? updatedTodos[0] : null);
        return updatedTodos;
      });

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

      <Container className={appStyles.pageContainer}>
        {todos.length > 0 ? (
          <>
            <TodoConfigure
              selectedTodo={selectedTodo}
              todos={todos}
              onSelect={(todo) => setSelectedTodo(todo)}
              onNewTodoClicked={() => setShowAddTodoDialog(true)}
              onEditTodoClicked={() => setShowEditTodoDialog(true)} />

            <SectionLayout todo={selectedTodo} key={selectedTodo?._id}/>
          </>
        ) : (
          <>
            <p>You have no todos. Go ahead and create one.</p>
            <Button
              variant="secondary"
              className={`${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
              onClick={() => setShowAddTodoDialog(true)}>
              <FaPlus />
              Todo
            </Button>
          </>
        )}
      </Container>
    </div>
  );
};

export default App;