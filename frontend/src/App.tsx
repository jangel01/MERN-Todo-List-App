import React, { useEffect, useState } from 'react';
import './App.css';
import { Section as SectionModel, Todo as TodoModel } from './models/todo';
import TodoConfigure from './components/todoConfigure';
import AddEditTodoDialog from './components/AddEditTodoDialog';
import { Button, Col, Container, Row } from 'react-bootstrap';
import styles from "./styles/TodoPage.module.css";
import styleUtils from "./styles/utils.module.css";
import { FaPlus } from "react-icons/fa";
import AddEditSectionDialog from './components/AddEditSectionDialog';
import * as TodosApi from "./network/todos_api"
import Section from './components/section';

function App() {
  const [todos, setTodos] = useState<TodoModel[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<TodoModel | null>(null);
  const [sectionToEdit, setSectionToEdit] = useState<SectionModel | null>(null);

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

  async function deleteSection(section: SectionModel) {
    try {
      const todoId = selectedTodo?._id || ""
      await TodosApi.deleteSection(todoId, section._id)

      const updatedSections = selectedTodo?.sections.filter(existingSection => existingSection._id !== section._id);
      
      if (selectedTodo && updatedSections) {
        setSelectedTodo({
            ...selectedTodo,
            sections: updatedSections
        });

        setTodos(todos.map(todo => 
            todo._id === selectedTodo._id ? { ...todo, sections: updatedSections } : todo
        ));
    }

    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

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
        onDeleteTodoClicked={() => deleteTodo(selectedTodo)}
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

      {selectedTodo && sectionToEdit && <AddEditSectionDialog
        todoId={selectedTodo._id}
        sectionToEdit={sectionToEdit}
        onDismiss={() => setSectionToEdit(null)}
        onSectionSaved={(updatedSection) => {
          const updatedSections = selectedTodo.sections.map(section => (
            section._id === updatedSection._id ? updatedSection : section
          ))

          setSelectedTodo({ ...selectedTodo, sections: updatedSections })
          setTodos(todos.map(todo => todo._id === selectedTodo._id ? { ...todo, sections: updatedSections } : todo));
          setSectionToEdit(null);
        }}
      />}

      {selectedTodo && <Button className={`${styleUtils.blockCenter} ${styleUtils.flexCenter}`} onClick={() => setShowAddSectionDialog(true)}>
        <FaPlus />
        New Section</Button>}

      <Container>
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.sectionGrid}`}>
          {selectedTodo && selectedTodo.sections.map(section => (
            <Col>
              <Section onSectionToEdit={setSectionToEdit} onSectionToDelete={deleteSection} section={section} className={styles.section}>
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