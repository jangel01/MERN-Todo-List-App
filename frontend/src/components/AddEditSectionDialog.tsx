import { Button, Form, Modal } from "react-bootstrap";
import { Section as SectionModel} from "../models/todo";
import { useForm } from "react-hook-form";
import { SectionInput } from "../network/todos_api";
import TextInputField from "./form/TextInputField";
import * as TodosApi from "../network/todos_api"

interface AddEditSectionDialogProps {
    todoId: string,
    sectionToEdit? : SectionModel | null,
    onDismiss: () => void,
    onSectionSaved: (Section: SectionModel) => void,
}

const AddEditSectionDialog = ({todoId, sectionToEdit, onDismiss, onSectionSaved}: AddEditSectionDialogProps) => {
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<SectionInput>({
        defaultValues: {
            name: sectionToEdit?.name || ""
        }
    });

    async function onSubmit(input: SectionInput) {
        try {
            let sectionResponse: SectionModel;

            if (sectionToEdit) {
                sectionResponse = await TodosApi.updateSection(todoId, sectionToEdit._id, input);
            } else {
                sectionResponse = await TodosApi.createSection(todoId, input);
            }

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