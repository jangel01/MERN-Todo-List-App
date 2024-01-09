import { Card } from "react-bootstrap";
import { Section as SectionModel } from "../models/todo";
import { ReactNode } from "react";
import { MdDelete } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import styles from "../styles/section.module.css"

interface SectionProps {
    section: SectionModel,
    className?: string,
    children?: ReactNode;
}

const Section = ({ section, className, children }: SectionProps) => {
    return (
        <Card className={`${styles.todoCard} ${className}`}>
            <Card.Body>
                <Card.Title>
                    <div className={styles.headerContainer}>
                        <div>
                            {section.name}
                        </div>
                        <div className={styles.iconsContainer}>
                            <MdModeEditOutline className={styles.editIcon}/>
                            <MdDelete className={styles.trashIcon}/>
                        </div>
                    </div>

                </Card.Title>
                <Card.Text>

                    {children}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default Section;