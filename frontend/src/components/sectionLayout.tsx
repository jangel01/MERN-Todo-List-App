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
import AdvancedPagination from "./AdvancedPagination";

interface SectionLayoutProps {
    todo: TodoModel | null,
}

const SectionLayout = ({ todo }: SectionLayoutProps) => {
    const [sections, setSections] = useState<SectionModel[]>([]);
    const [selectedSection, setSelectedSection] = useState<SectionModel | null>(null);

    const [showAddSectionDialog, setShowAddSectionDialog] = useState(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const maxSectionsPerPage = 6;
    const lastSectionIndex = currentPage * maxSectionsPerPage;
    const firstSectionIndex = lastSectionIndex - maxSectionsPerPage;
    const currentSections = sections.slice(firstSectionIndex, lastSectionIndex);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function deleteSection(section: SectionModel) {
        try {
            if (todo) {
                await SectionsApi.deleteSection(todo._id, section._id)

                const updatedSections = sections.filter(existingSection => existingSection._id !== section._id)

                const pageIndex = Math.ceil(updatedSections.length / maxSectionsPerPage);
                
                setSections(updatedSections);
                setCurrentPage(pageIndex);
            }

        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    const handlePaginationClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }

    const handleSectionAdded = (newSection: SectionModel) => {
        const pageIndex = Math.ceil((sections.length + 1) / maxSectionsPerPage);

        setCurrentPage(pageIndex);
        setSections([...sections, newSection]);
        setShowAddSectionDialog(false);
    };

    return (
        <div>
            {todo && showAddSectionDialog && <AddEditSectionDialog
                todoId={todo._id}
                onDismiss={() => setShowAddSectionDialog(false)}
                onSectionSaved={(newSection) => handleSectionAdded(newSection)}
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
                Section</Button>}

            {sections.length > 0 ? (
                <>
                    <Row xs={1} md={2} xl={3} className={`g-4 mx-0 ${sectionLayoutStyles.sectionGrid}`}>
                        {currentSections.map((section) => (
                            <Col key={section._id}>
                                <Section
                                    section={section}
                                    onEditSectionIconClicked={setSelectedSection}
                                    onDeleteSectionIconClicked={deleteSection} />
                            </Col>
                        ))}
                    </Row>

                    <AdvancedPagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(sections.length / maxSectionsPerPage)}
                        onPageChange={(pageNumber) => handlePaginationClick(pageNumber)}
                    />
                </>
            ) : (
                <p>Ready to get organized? Create a section for your todo!</p>
            )}
        </div>
    );
}

export default SectionLayout;