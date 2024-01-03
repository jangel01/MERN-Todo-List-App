import React, { useEffect, useState } from 'react';
import './App.css';
import { Todo as TodoModel } from './models/todo';
import TodoConfigure from './components/todoConfigure';
import AddEditTodoDialog from './components/AddEditTodoDialog';
import { Button, Col, Container, Row } from 'react-bootstrap';
import Section from './components/section';
import styles from "./styles/TodoPage.module.css";
import styleUtils from "./styles/utils.module.css";
import { FaPlus } from "react-icons/fa";
import AddEditSectionDialog from './components/AddEditSectionDialog';

function App() {
  const [todos, setTodos] = useState<TodoModel[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<TodoModel | null>(null);

  const [showAddTodoDialog, setShowAddTodoDialog] = useState(false);
  const [showEditTodoDialog, setShowEditTodoDialog] = useState(false);
  const [showAddSectionDialog, setShowAddSectionDialog] = useState(false);

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
      <TodoConfigure selectedTodo={selectedTodo} todos={todos} onSelect={(todo) => setSelectedTodo(todo)} onNewTodoClicked={() => setShowAddTodoDialog(true)} onEditTodoClicked={() => setShowEditTodoDialog(true)} />

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

      {selectedTodo && showAddSectionDialog && <AddEditSectionDialog
        todoId={selectedTodo._id}
        onDismiss={() => setShowAddSectionDialog(false)}
        onSectionSaved={(newSection) => {
          const updatedTodo = { ...selectedTodo, sections: [...selectedTodo.sections, newSection] };
          setTodos(todos.map(existingTodo => existingTodo._id === selectedTodo._id ? updatedTodo : existingTodo));
          setSelectedTodo(updatedTodo);
          setShowAddSectionDialog(false);
        }}
      />}

      {selectedTodo && <Button className={`${styleUtils.blockCenter} ${styleUtils.flexCenter}`} onClick={() => setShowAddSectionDialog(true)}>
        <FaPlus />
        New Section</Button>}

      <Container>
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.sectionGrid}`}>
          {selectedTodo && selectedTodo.sections.map(section => (
            <Col>
              <Section section={section} className={styles.section}>
                {/* {section.tasks.map((task) => (
                  <p>{task.description}</p>
                ))} */}
              </Section>
            </Col>
          ))}

        </Row>
      </Container>

      {/* {selectedTodo && (
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
      )} */}

    </div>
  );
};

export default App;