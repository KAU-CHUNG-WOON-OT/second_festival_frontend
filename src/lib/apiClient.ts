import { getAccessToken } from "./authStorage";

interface ApiErrorDetail {
  code?: string;
  message?: string;
  fieldErrors?: Array<{ field?: string; reason?: string }>;
}

interface ApiResponse<T> {
  success: boolean;
  code?: string;
  message?: string;
  data?: T;
  error?: ApiErrorDetail | null;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  detail?: ApiErrorDetail | null;

  constructor(message: string, status: number, code?: string, detail?: ApiErrorDetail | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.detail = detail;
  }
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
  /** Override the default `VITE_API_BASE_URL` for this call. */
  baseUrl?: string;
}

const resolveBaseUrl = (override?: string): string => {
  const base = override ?? import.meta.env.VITE_API_BASE_URL;
  if (!base) {
    throw new Error("API base URL is not configured.");
  }
  return base.endsWith("/") ? base.slice(0, -1) : base;
};

export const apiFetch = async <T = unknown>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> => {
  const { body, auth = true, baseUrl, headers, ...rest } = options;

  const url = `${resolveBaseUrl(baseUrl)}${path.startsWith("/") ? path : `/${path}`}`;

  const performRequest = async (token: string | null): Promise<Response> => {
    const requestHeaders = new Headers(headers);
    if (body !== undefined && !requestHeaders.has("Content-Type")) {
      requestHeaders.set("Content-Type", "application/json");
    }
    if (auth && token && !requestHeaders.has("Authorization")) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }

    return fetch(url, {
      credentials: "include",
      ...rest,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  };

  let response = await performRequest(auth ? getAccessToken() : null);

  if (response.status === 401 && auth) {
    const { refreshAccessToken } = await import("./authRefresh");
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await performRequest(newToken);
    }
  }

  let payload: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  const objectPayload =
    payload && typeof payload === "object" ? (payload as ApiResponse<T>) : null;
  const stringPayload = typeof payload === "string" ? payload : null;

  if (!response.ok || objectPayload?.success === false) {
    throw new ApiError(
      stringPayload ??
        objectPayload?.error?.message ??
        objectPayload?.message ??
        response.statusText,
      response.status,
      objectPayload?.error?.code ?? objectPayload?.code,
      objectPayload?.error,
    );
  }

  return (objectPayload?.data ?? payload) as T;
};
