import { apiFetch } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

interface LoginResponse {
    success: boolean;
    user: {
        id: string;
        name: string;
        email: string;
    };
}


export const registrationMuatation = async (data: { name: string; email: string; password: string }) => {
    const response = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Registration failed");
    }

    return response;
};



export const loginQuery = async (
    data: { email: string; password: string }
): Promise<LoginResponse> => {
    const response = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }
    const result: LoginResponse = await response.json();
    return result;
}

export const logoutQuery = async () => {
    const response = await apiFetch("/auth/logout", {
        method: "GET",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Logout failed");
    }
    return response;
}


export const useRegister = () =>
    useMutation({
        mutationKey: ["register"],
        mutationFn: registrationMuatation,
    });

export const useLogin = () =>
    useMutation<LoginResponse, Error, { email: string; password: string }>({
        mutationKey: ["login"],
        mutationFn: loginQuery,
    });

export const useLogout = () =>
    useMutation({
        mutationKey: ["logout"],
        mutationFn: logoutQuery,
    });