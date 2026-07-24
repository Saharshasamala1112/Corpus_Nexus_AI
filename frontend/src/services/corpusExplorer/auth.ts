import { getProfile as getProfileRequest, login as loginRequest, logout as logoutRequest } from "./api";
import type { CorpusProfile } from "@/types/corpusExplorer";

export async function login(phone: string, password: string): Promise<{ access_token: string; username: string; phone: string }> {
    return loginRequest(phone, password);
}

export function logout(): void {
    logoutRequest();
}

export async function getProfile(): Promise<CorpusProfile> {
    return getProfileRequest();
}
