import { Card } from "react-bootstrap";
import { Section as SectionModel } from "../models/section";
import { Task as TaskModel } from "../models/task";
import sectionLayoutStyles from "../styles/sectionLayout.module.css";
import sectionStyles from "../styles/section.module.css";
import { MdDelete } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { useEffect, useState } from "react";
import * as TasksApi from "../network/tasks_api";
import Task from "./task";
import { TaskStatusInput } from "../network/interfaces/task";

interface SectionProps {
    section: SectionModel,
    onEditSectionIconClicked: (section: SectionModel) => void,
    onDeleteSectionIconClicked: (section: SectionModel) => void,
}

const Section = ({ section, onEditSectionIconClicked, onDeleteSectionIconClicked }: SectionProps) => {
    const [tasks, setTasks] = useState<TaskModel[]>([]);

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

    return (
        <Card className={`${sectionStyles.sectionCard} ${sectionLayoutStyles.section}`}>
            <Card.Body>
                <Card.Title>
                    <div className={sectionStyles.headerContainer}>
                        <div>
                            {section.sectionName}
                        </div>
                        <div className={sectionStyles.iconsContainer}>
                            <MdModeEditOutline className={sectionStyles.editIcon} onClick={() => onEditSectionIconClicked(section)} />
                            <MdDelete className={sectionStyles.trashIcon} onClick={() => onDeleteSectionIconClicked(section)} />
                        </div>
                    </div>
                </Card.Title>
                <Card.Text>
                    {tasks.map((task) => (
                        <Task task={task} key={task._id} onUpdateTaskStatus={onUpdateTaskStatus}/>
                    ))}
                </Card.Text>
            </Card.Body>
        </Card >
    );
}

export default Section;