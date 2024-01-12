import { Form, ListGroup } from "react-bootstrap";
import { Task as TaskModel } from "../models/task";
import { TaskStatusInput } from "../network/interfaces/task";

interface TaskProps {
    task: TaskModel,
    onUpdateTaskStatus: (task: TaskModel, taskCompleted: TaskStatusInput) => void,
}

const Task = ({ task, onUpdateTaskStatus}: TaskProps) => {

    return (
        <ListGroup>
            <Form.Check
                type="checkbox"
                id={task._id}
                label={task.taskDescription}
                checked={task.taskCompleted}
                onChange={() => onUpdateTaskStatus(task, {taskCompleted: !task.taskCompleted})}
            />
        </ListGroup>

    );
}

export default Task;