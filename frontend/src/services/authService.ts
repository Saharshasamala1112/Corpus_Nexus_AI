import api from "../api/axios";
import type { LoginRequest, LoginResponse } from "../types/auth";

export async function login(
  credentials: LoginRequest,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    credentials,
  );

  return response.data;
}

export async function forgotPasswordInit(
  phone: string,
): Promise<{ status: string; message: string; reference_id: string | null }> {
  const response = await api.post("/auth/forgot-password/init", { phone });
  return response.data;
}

export async function forgotPasswordConfirm(
  phone: string,
  otp_code: string,
  new_password: string,
  confirm_password: string,
): Promise<{ status: string; message: string; reference_id: string | null }> {
  const response = await api.post("/auth/forgot-password/confirm", {
    phone,
    otp_code,
    new_password,
    confirm_password,
  });
  return response.data;
}

export async function getCurrentUser(): Promise<{
  id: string;
  username: string;
  name: string;
  roles: { name: string }[];
  institution_id?: string | null;
  current_year_of_study?: string | null;
  college_roll_number?: string | null;
}> {
  const response = await api.get("/auth/me");
  return response.data;
}

export interface InstitutionInfo {
  id: string;
  college_name: string;
  university_name: string;
  academic_stream: string | null;
  medium: string | null;
  district: string | null;
  college_type: string | null;
  management_type: string | null;
  address: string | null;
}

export async function getInstitution(
  id: string,
): Promise<InstitutionInfo> {
  const response = await api.get(`/institutions/${id}`);
  return response.data;
}

export interface InstitutionEnums {
  districts: string[];
  college_types: string[];
  management_types: string[];
  mediums: string[];
  modes: string[];
  academic_streams: string[];
}

export async function getInstitutionEnums(): Promise<InstitutionEnums> {
  const response = await api.get("/institutions/enums");
  return response.data;
}

export interface ContributionData {
  total_contributions: number;
  credits: number;
}

export async function getUserContributions(
  userIdentifier: string,
): Promise<ContributionData> {
  const response = await api.get(
    `/users/${userIdentifier}/contributions`,
  );
  return response.data;
}