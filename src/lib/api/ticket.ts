import { apiFetch } from "../apiClient";

export interface TicketCounterResponse {
  current_count: number;
}

export const fetchTicketCounter = (): Promise<TicketCounterResponse> =>
  apiFetch<TicketCounterResponse>("/ticket/counter");

export interface TicketExistsResponse {
  exists: boolean;
}

export const fetchTicketExists = (): Promise<TicketExistsResponse> =>
  apiFetch<TicketExistsResponse>("/ticket/exists");

export interface IssuedTicketInfo {
  user_id: string;
  ticket_number: number;
  status: string;
  issued_at: string;
}

export interface TicketUserInfo {
  user_id: number;
  created_at?: string;
  updated_at?: string;
  department?: string;
  email?: string;
  name?: string;
  oauth_id?: string;
  role?: string;
  social_type?: string;
  student_id?: string;
}

export interface TicketInfoSuccessResponse {
  result: "SUCCESS";
  ticket: IssuedTicketInfo;
  user_info?: TicketUserInfo;
}

export interface TicketInfoFailResponse {
  result: "FAIL";
  message?: string;
}

export type TicketInfoResponse = TicketInfoSuccessResponse | TicketInfoFailResponse;

export const fetchTicketInfo = (): Promise<TicketInfoResponse> =>
  apiFetch<TicketInfoResponse>("/ticket/info");

export interface TicketRequestSuccessResponse {
  message: string;
}

export const requestTicketReservation = (): Promise<TicketRequestSuccessResponse> =>
  apiFetch<TicketRequestSuccessResponse>("/ticket", {
    method: "POST",
    baseUrl: import.meta.env.VITE_TICKET_API_BASE_URL,
    credentials: "omit",
  });

export const redeemTicketWithPassword = (password: string): Promise<string> =>
  apiFetch<string>("/ticket/use", {
    method: "PATCH",
    body: { password },
  });
