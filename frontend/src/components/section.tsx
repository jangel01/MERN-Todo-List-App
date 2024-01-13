import { Card } from "react-bootstrap";
import { Section as SectionModel } from "../models/section";
import { Task as TaskModel } from "../models/task";
import sectionLayoutStyles from "../styles/sectionLayout.module.css";
import sectionStyles from "../styles/section.module.css";
import { MdDelete } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { useEffect, useState } from "react";
import * as TasksApi from "../network/tasks_api";
import { TaskStatusInput } from "../network/interfaces/task";
import { FaPlus } from "react-icons/fa";
import styleUtils from "../styles/utils.module.css";
import AddEditTaskDialog from "./AddEditTaskDialog";
import Task from "./task";

interface SectionProps {
    section: SectionModel,
    onEditSectionIconClicked: (section: SectionModel) => void,
    onDeleteSectionIconClicked: (section: SectionModel) => void,
}

const Section = ({ section, onEditSectionIconClicked, onDeleteSectionIconClicked }: SectionProps) => {
    const [tasks, setTasks] = useState<TaskModel[]>([]);

    const [showAddEditTaskDialog, setShowAddEditTaskDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskModel | null>(null);

    useEffect(() => {
        async function loadTasks() {
            try {
                if (section) {
                    const tasks = await TasksApi.fetchTasks(section._id);
                    setTasks(tasks);
                }

            } catch (error) {
                console.error(error);
                alert(error);
            }
        }

        loadTasks();
    }, [section]);

    const onUpdateTaskStatus = async (task: TaskModel, taskCompleted: TaskStatusInput) => {
        try {
            const updatedTask = await TasksApi.updateTaskStatus(section._id, task._id, taskCompleted);

            setTasks(tasks.map(existingTask => existingTask._id === task._id ? updatedTask : existingTask))

        } catch (error) {
            console.error(error);
            alert(error);
        }
    };

    async function deleteTask(task: TaskModel) {
        try {
            await TasksApi.deleteTask(section._id, task._id);
            setTasks(tasks.filter(existingTask => existingTask._id !== task._id))
            setSelectedTask(null);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <div>
            {section && showAddEditTaskDialog && <AddEditTaskDialog
                sectionId={section._id}
                onDismiss={() => setShowAddEditTaskDialog(false)}
                onTaskSaved={(newTask) => {
                    setTasks([...tasks, newTask]);
                    setShowAddEditTaskDialog(false);
                }}
            />}

            {section && selectedTask && <AddEditTaskDialog
                sectionId={section._id}
                taskToEdit={selectedTask}
                onDismiss={() => setSelectedTask(null)}
                onTaskSaved={(updatedTask) => {
                    setTasks(tasks.map(existingTask => existingTask._id === updatedTask._id ? updatedTask : existingTask))
                    setSelectedTask(null);
                }}
                onDeleteTaskClicked={deleteTask}
            />}

            <Card className={`${sectionStyles.sectionCard} ${sectionStyles.sectionCardBody} ${sectionLayoutStyles.section}`}>
                <Card.Body>
                    <Card.Title>
                        <div className={sectionStyles.headerContainer}>
                            <div className={`font-weight-bold ${sectionStyles.nameContainer}`}>
                                {section.sectionName}
                            </div>
                            <div className={sectionStyles.iconsContainer}>
                                <MdModeEditOutline
                                    className={sectionStyles.editIcon}
                                    onClick={() => onEditSectionIconClicked(section)} />
                                <MdDelete className={sectionStyles.trashIcon} onClick={() => onDeleteSectionIconClicked(section)} />
                            </div>
                        </div>
                    </Card.Title>
                    <Card.Text>
                        <div className="d-flex my-2">
                            <FaPlus className={`${styleUtils.cursorPointer} ml-auto`} onClick={() => setShowAddEditTaskDialog(true)} />
                        </div>

                        {tasks.length > 0 ? (
                            <div className="overflow-auto py-2" style={{ maxHeight: "6.25rem" }}>
                                {tasks.map((task) => (
                                    <Task
                                        task={task}
                                        key={task._id}
                                        onUpdateTaskDescription={setSelectedTask}
                                        onUpdateTaskStatus={onUpdateTaskStatus} />
                                ))}
                            </div>
                        ) : (
                            <p>This section looks a bit lonely. How about adding a task?</p>
                        )}
                    </Card.Text>
                </Card.Body>
            </Card >
        </div>

    );
}


export default Section;