import { Button, Form, Modal } from "react-bootstrap";
import { Task as TaskModel } from "../models/task";
import { useForm } from "react-hook-form";
import TextInputField from "./form/TextInputField";
import * as TasksApi from "../network/tasks_api"
import { TaskDescriptionInput } from "../network/interfaces/task";

interface AddEditTaskDialogProps {
    sectionId: string,
    taskToEdit?: TaskModel | null,
    onDismiss: () => void,
    onTaskSaved: (Task: TaskModel) => void,
    onDeleteTaskClicked?: (task: TaskModel) => void,
}

const AddEditTaskDialog = ({ sectionId, taskToEdit, onDismiss, onTaskSaved, onDeleteTaskClicked }: AddEditTaskDialogProps) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TaskDescriptionInput>({
        defaultValues: {
            taskDescription: taskToEdit?.taskDescription || ""
        }
    });

    async function onSubmit(input: TaskDescriptionInput) {
        try {
            let taskResponse: TaskModel;

            if (taskToEdit) {
                taskResponse = await TasksApi.updateTaskDescription(sectionId, taskToEdit._id, input);
            } else {
                taskResponse = await TasksApi.createTask(sectionId, input);
            }

            onTaskSaved(taskResponse);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {taskToEdit ? "Edit Task" : "Add Task"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form id="addEditTaskForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="taskDescription"
                        label="Task"
                        type="text"
                        placeholder="Task"
                        register={register}
                        registerOptions ={{required: "Required"}}
                        error={errors.taskDescription}
                    />
                </Form>
                {taskToEdit && <Button variant="danger" 
                onClick={() => onDeleteTaskClicked && onDeleteTaskClicked(taskToEdit)}>Delete Task</Button>}
            </Modal.Body>

            <Modal.Footer>
                <Button type="submit" form="addEditTaskForm" disabled={isSubmitting}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddEditTaskDialog;