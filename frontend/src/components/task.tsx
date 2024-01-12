import { Form, ListGroup } from "react-bootstrap";
import { Task as TaskModel } from "../models/task";
import { TaskStatusInput } from "../network/interfaces/task";
import styleUtils from "../styles/utils.module.css";

interface TaskProps {
    task: TaskModel,
    onUpdateTaskDescription: (task: TaskModel) => void,
    onUpdateTaskStatus: (task: TaskModel, taskCompleted: TaskStatusInput) => void,
}

const Task = ({ task, onUpdateTaskDescription, onUpdateTaskStatus }: TaskProps) => {

    return (
        <ListGroup>
            <div className="d-flex">
                <Form.Check
                    type="checkbox"
                    id={task._id}
                    checked={task.taskCompleted}
                    onChange={() => onUpdateTaskStatus(task, { taskCompleted: !task.taskCompleted })}
                    className={`${styleUtils.cursorPointer}`}
                />

                <Form.Check.Label className={`${styleUtils.cursorPointer} ${styleUtils.textHoverEffect} flex-grow-1`}
                    onClick={() => onUpdateTaskDescription(task)}
                >
                    {task.taskDescription}
                </Form.Check.Label>
            </div>
        </ListGroup>

    );
}

export default Task;