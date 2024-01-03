import { Button, Form, Modal } from "react-bootstrap";
import { Section as SectionModel} from "../models/todo";
import { useForm } from "react-hook-form";
import { SectionInput } from "../network/todos_api";
import TextInputField from "./form/TextInputField";
import * as TodosApi from "../network/todos_api"

interface AddEditSectionDialogProps {
    sectionToEdit? : SectionModel | null,
    todoId: string,
    onDismiss: () => void,
    onSectionSaved: (Section: SectionModel) => void,
}

const AddEditSectionDialog = ({sectionToEdit, todoId, onDismiss, onSectionSaved}: AddEditSectionDialogProps) => {
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<SectionInput>({
        defaultValues: {
            name: sectionToEdit?.name || ""
        }
    });

    async function onSubmit(input: SectionInput) {
        try {
            let sectionResponse: SectionModel;

            sectionResponse = await TodosApi.createSection(todoId, input);

            // if (todoToEdit) {
            //     todoResponse = await TodosApi.updateTodo(todoToEdit._id, input);
            // } else {
            //     todoResponse = await TodosApi.createTodo(input);
            // }

            onSectionSaved(sectionResponse);
        } catch (error) {
            console.error(error);
        }
    }

    return ( 
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {sectionToEdit ? "Edit Section" : "Add section"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form id ="addEditSectionForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                    name = "name"
                    label = "Section Name"
                    type = "text"
                    placeholder = "Section Name"
                    register = {register}
                    error={errors.name}
                    />
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button type="submit" form="addEditSectionForm" disabled={isSubmitting}>Save</Button>
            </Modal.Footer>
        </Modal>
     );
}
 
export default AddEditSectionDialog;