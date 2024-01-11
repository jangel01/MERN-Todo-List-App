import { Card } from "react-bootstrap";
import { Section as SectionModel } from "../models/section";
import sectionLayoutStyles from "../styles/sectionLayout.module.css";
import sectionStyles from "../styles/section.module.css";
import { MdDelete } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";

interface SectionProps {
    section: SectionModel,
    onEditSectionIconClicked: (section : SectionModel) => void,
    onDeleteSectionIconClicked: (section : SectionModel) => void,
}

const Section = ({ section, onEditSectionIconClicked, onDeleteSectionIconClicked }: SectionProps) => {
    return (
        <Card className={`${sectionStyles.sectionCard} ${sectionLayoutStyles.section}`}>
            <Card.Body>
                <Card.Title>
                    <div className={sectionStyles.headerContainer}>
                        <div>
                            {section.sectionName}
                        </div>
                        <div className={sectionStyles.iconsContainer}>
                            <MdModeEditOutline className={sectionStyles.editIcon} onClick={() => onEditSectionIconClicked(section)}/>
                            <MdDelete className={sectionStyles.trashIcon} onClick={() => onDeleteSectionIconClicked(section)}/>
                        </div>
                    </div>

                </Card.Title>
                <Card.Text>
                </Card.Text>
            </Card.Body>
        </Card >
    );
}

export default Section;