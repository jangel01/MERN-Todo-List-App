import { Section as SectionModel} from "../models/section";
import { SectionInput } from "./interfaces/section";
import fetchData from "./utils/fetchData";

export async function fetchSections(todoId: string): Promise<SectionModel[]> {
    const response = await fetchData("/api/sections/" + todoId + "/getSections/", { method: "GET" });
    return response.json();
}

export async function fetchSection(todoId: string, sectionId: string): Promise<SectionModel> {
    const body = {todoId}

    const response = await fetchData("/api/sections/" + sectionId + "/getSection/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });
    return response.json();
}

export async function createSection(todoId: string, section: SectionInput) {
    const body = {...section, todoId};

    const response = await fetchData("/api/sections/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });

    return response.json();
}

export async function updateSection(todoId: string, sectionId: string, section: SectionInput) {
    const body = {...section, todoId};

    const response = await fetchData("/api/sections/" + sectionId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });

    return response.json();
}

export async function deleteSection(todoId: string, sectionId: string) {
    const body = {todoId};

    await fetchData("api/sections/" + sectionId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });
}