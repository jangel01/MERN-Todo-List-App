import { Form, ListGroup } from "react-bootstrap";
import { Task as TaskModel} from "../models/todo";
import { useState } from "react";

interface TaskProps {
    task: TaskModel,
}

const Task = ({task} : TaskProps) => {
    const [isCompleted, setCompleted] = useState(task.completed);

    // const handleCheckboxChange = async () => {
    //     try {

    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    return (
        <> 
        <ListGroup>
            <Form.Check
            type="checkbox"
            id={task._id}
            label={task.description}
            checked={isCompleted}
            />
        </ListGroup>
        </>
    );
}

export default Task;