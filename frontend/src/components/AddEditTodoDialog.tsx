import { Button, Form, Modal } from "react-bootstrap";
import { Todo as TodoModel} from "../models/todo";
import { useForm } from "react-hook-form";
import { TodoInput } from "../network/todos_api";
import * as TodosApi from "../network/todos_api"
import TextInputField from "./form/TextInputField";


interface AddEditTodoDialogProps {
    todoToEdit?: TodoModel | null,
    onDismiss: () => void,
    onTodoSaved: (Todo: TodoModel) => void,
}

const AddEditTodoDialog = ({todoToEdit, onDismiss, onTodoSaved}: AddEditTodoDialogProps) => {
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<TodoInput>({
        defaultValues: {
            name: todoToEdit?.name || ""
        }
    });

    async function onSubmit(input: TodoInput) {
        try {
            let todoResponse: TodoModel;

            if (todoToEdit) {
                todoResponse = await TodosApi.updateTodo(todoToEdit._id, input);
            } else {
                todoResponse = await TodosApi.createTodo(input);
            }

            onTodoSaved(todoResponse);
        } catch (error) {
            console.error(error);
        }
    }

    return ( 
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {todoToEdit ? "Edit Todo" : "Add todo"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form id ="addEditTodoForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                    name = "name"
                    label = "Todo Name"
                    type = "text"
                    placeholder = "Todo Name"
                    register = {register}
                    registerOptions ={{required: "Required"}}
                    error={errors.name}
                    />
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button type="submit" form="addEditTodoForm" disabled={isSubmitting}>Save</Button>
            </Modal.Footer>
        </Modal>
     );
}
 
export default AddEditTodoDialog;