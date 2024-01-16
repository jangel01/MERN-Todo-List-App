import { useEffect, useState } from 'react';
import { Todo as TodoModel } from './models/todo';
import * as TodosApi from "./network/todos_api"
import { Button, Container, Spinner } from 'react-bootstrap';
import TodoConfigure from './components/todoConfigure';
import AddEditTodoDialog from './components/AddEditTodoDialog';
import SectionLayout from './components/sectionLayout';
import appStyles from './styles/App.module.css';
import styleUtils from "./styles/utils.module.css";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

function App() {
  const [todos, setTodos] = useState<TodoModel[]>([]);
  const [todosLoading, setTodosLoading] = useState(true);
  const [showTodosLoadingError, setShowTodosLoadingError] = useState(false);

  const [selectedTodo, setSelectedTodo] = useState<TodoModel | null>(null);
  const [currentTodoIndex, setCurrentTodoIndex] = useState<number>(0);

  const [showAddTodoDialog, setShowAddTodoDialog] = useState(false);
  const [showEditTodoDialog, setShowEditTodoDialog] = useState(false);

  useEffect(() => {
    async function loadTodos() {
      try {
        setShowTodosLoadingError(false);
        setTodosLoading(true);

        const todos = await TodosApi.fetchTodos();
        setTodos(todos);

        if (todos.length > 0) {
          setSelectedTodo(todos[0]);
        }
      } catch (error) {
        console.error(error);
        setShowTodosLoadingError(true);
      } finally {
        setTodosLoading(false);
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
        setCurrentTodoIndex(0);
        return updatedTodos;
      });

      setShowEditTodoDialog(false);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const handleBackClick = () => {
    if (currentTodoIndex > 0) {
      setCurrentTodoIndex(currentTodoIndex - 1);
      setSelectedTodo(todos[currentTodoIndex - 1]);
    }
  }

  const handleForwardClick = () => {
    if (currentTodoIndex < todos.length - 1) {
      setCurrentTodoIndex(currentTodoIndex + 1);
      setSelectedTodo(todos[currentTodoIndex + 1]);
    }
  }

  const updateCurrentTodoIndex = (selectedTodo: TodoModel) => {
    const index = todos.findIndex((todo) => todo._id === selectedTodo._id);
    setCurrentTodoIndex(index);
    setSelectedTodo(todos[index]);
  };

  return (
    <div>
      {showAddTodoDialog && <AddEditTodoDialog
        onDismiss={() => setShowAddTodoDialog(false)}
        onTodoSaved={(newTodo) => {
          setTodos((prevTodos) => {
            const updatedTodos = [...prevTodos, newTodo];
            setCurrentTodoIndex(updatedTodos.length - 1);
            return updatedTodos;
          });

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
        {todosLoading && <Spinner animation='border' variant='primary' />}
        {showTodosLoadingError && <p className='my-2'>Something went wrong loading todos. Please refresh the page.</p>}

        {!todosLoading && !showTodosLoadingError &&
          <>
            {todos.length > 0 ?
              <>
                <TodoConfigure
                  selectedTodo={selectedTodo}
                  todos={todos}
                  onSelect={(todo) => updateCurrentTodoIndex(todo)}
                  onNewTodoClicked={() => setShowAddTodoDialog(true)}
                  onEditTodoClicked={() => setShowEditTodoDialog(true)}
                />

                <h1 className="py-2" style={{ wordWrap: 'break-word' }}>{selectedTodo?.todoName}</h1>

                <IoIosArrowBack
                  onClick={handleBackClick}
                  style={{ fontSize: "1.5rem" }}
                  className={currentTodoIndex === 0 ? `${styleUtils.lighterIcon}` : `${styleUtils.cursorPointer}`} />

                <IoIosArrowForward
                  onClick={handleForwardClick}
                  style={{ fontSize: "1.5rem" }}
                  className={currentTodoIndex === todos.length - 1 ? `${styleUtils.lighterIcon}` : `${styleUtils.cursorPointer}`} />

                <SectionLayout todo={selectedTodo} key={selectedTodo?._id} />
              </>
              :
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
            }
          </>
        }
      </Container>
    </div>
  );
};

export default App;