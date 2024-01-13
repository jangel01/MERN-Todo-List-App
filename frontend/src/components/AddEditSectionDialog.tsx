import { Button, Form, Modal } from "react-bootstrap";
import { Section as SectionModel} from "../models/section";
import { useForm } from "react-hook-form";
import { SectionInput } from "../network/interfaces/section";
import TextInputField from "./form/TextInputField";
import * as SectionsApi from "../network/sections_api"

interface AddEditSectionDialogProps {
    todoId: string,
    sectionToEdit? : SectionModel | null,
    onDismiss: () => void,
    onSectionSaved: (Section: SectionModel) => void,
}

const AddEditSectionDialog = ({todoId, sectionToEdit, onDismiss, onSectionSaved}: AddEditSectionDialogProps) => {
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<SectionInput>({
        defaultValues: {
            sectionName: sectionToEdit?.sectionName || ""
        }
    });

    async function onSubmit(input: SectionInput) {
        try {
            let sectionResponse: SectionModel;

            if (sectionToEdit) {
                sectionResponse = await SectionsApi.updateSection(todoId, sectionToEdit._id, input);
            } else {
                sectionResponse = await SectionsApi.createSection(todoId, input);
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
                    {sectionToEdit ? "Edit Section" : "Add Section"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form id ="addEditSectionForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                    name = "sectionName"
                    label = "Section Name"
                    type = "text"
                    placeholder = "Section Name"
                    register = {register}
                    error={errors.sectionName}
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