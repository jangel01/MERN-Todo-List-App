import { Section as SectionModel } from "../models/section";
import { Todo as TodoModel } from "../models/todo";
import { useEffect, useState } from "react";
import * as SectionsApi from "../network/sections_api";
import { Button, Col, Row } from "react-bootstrap";
import sectionLayoutStyles from "../styles/sectionLayout.module.css";
import Section from "./section";
import AddEditSectionDialog from "./AddEditSectionDialog";
import styleUtils from "../styles/utils.module.css";
import { FaPlus } from "react-icons/fa";

interface SectionLayoutProps {
    todo: TodoModel | null,
}

const SectionLayout = ({ todo }: SectionLayoutProps) => {
    const [sections, setSections] = useState<SectionModel[]>([]);
    const [selectedSection, setSelectedSection] = useState<SectionModel | null>(null);

    const [showAddSectionDialog, setShowAddSectionDialog] = useState(false);

    useEffect(() => {
        async function loadSections() {
            try {
                if (todo) {
                    const sections = await SectionsApi.fetchSections(todo._id);
                    setSections(sections);
                }

            } catch (error) {
                console.error(error);
                alert(error);
            }
        }

        loadSections();
    }, [todo])

    async function deleteSection(section: SectionModel) {
        try {
            if (todo) {
                await SectionsApi.deleteSection(todo._id, section._id)

                setSections(sections.filter(existingSection => existingSection._id !== section._id))
            }

        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <div>
            {todo && showAddSectionDialog && <AddEditSectionDialog
                todoId={todo._id}
                onDismiss={() => setShowAddSectionDialog(false)}
                onSectionSaved={(newSection) => {
                    setSections([...sections, newSection]);
                    setShowAddSectionDialog(false);
                }}
            />}

            {todo && selectedSection && <AddEditSectionDialog
                todoId={todo._id}
                sectionToEdit={selectedSection}
                onDismiss={() => setSelectedSection(null)}
                onSectionSaved={(updatedSection) => {
                    setSections(sections.map(existingSection => existingSection._id === updatedSection._id ? updatedSection : existingSection));

                    setSelectedSection(null);
                }}
            />}

            {todo && <Button
                variant="success"
                className={`${styleUtils.blockCenter} ${styleUtils.flexCenter} my-3`}
                onClick={() => setShowAddSectionDialog(true)}>
                <FaPlus />
                New Section</Button>}

            {todo ? (
                <Row xs={1} md={2} xl={3} className={`g-4 ${sectionLayoutStyles.sectionGrid}`}>
                    {sections.map((section) => (
                        <Col key={section._id}>
                            <Section
                                section={section}
                                onEditSectionIconClicked={setSelectedSection}
                                onDeleteSectionIconClicked={deleteSection} />
                        </Col>
                    ))}
                </Row>
            ) : (
                <div>No todo item selected.</div>
            )}
        </div>
    );
}

export default SectionLayout;