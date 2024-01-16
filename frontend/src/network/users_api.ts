import { User as UserModel} from "../models/user";
import { LoginCredentials, SignupCredentials } from "./interfaces/user";
import fetchData from "./utils/fetchData";

export async function getLoggedInUser(): Promise<UserModel>{
    const response = await fetchData("/api/users", {method: "GET"});
    return response.json();
}

export async function signUp(credentials: SignupCredentials): Promise<UserModel> {
    const response = await fetchData("/api/users/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    return response.json();
}

export async function login(credentials: LoginCredentials): Promise<UserModel> {
    const response = await fetchData("/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    return response.json();
}

export async function logout() {
    await fetchData("/api/users/logout", {method: "POST"});
}