import { constants } from "../constants/constants";
import { authService } from "./authService";
import { useUserStore } from "../stores/userStore";

interface RequestConfig {
  params?: Record<string, string>;
  headers?: Record<string, string>;
  method?: string;
  body?: Record<string, any> | string;
  timeout?: number;
}

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}

const handleUnauthorized = async () => {
  // Clear auth token
  useUserStore.getState().setToken(null);

  // Login again in the background with the stored credentials
  const credentials = useUserStore.getState().credentials;
  if (credentials) {
    const { clientCode, username, password } = credentials;
    await authService.login({ clientCode, username, password });
  }
};

const makeRequest = async <T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> => {
  const token = useUserStore.getState().token;

  // Ensure endpoint starts with a forward slash
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  // Construct the full URL
  let fullUrl = `${constants.API_URL}${normalizedEndpoint}`;

  // Add query params if they exist
  if (config.params) {
    const queryParams = new URLSearchParams(config.params).toString();
    if (queryParams) {
      fullUrl += `?${queryParams}`;
    }
  }

  // Basic headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Add auth token if exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Add any custom headers
  if (config.headers) {
    Object.assign(headers, config.headers);
  }

  let body: string | undefined = undefined;
  if (config.body) {
    if (typeof config.body === "string") {
      body = config.body;
    } else if (
      headers["Content-Type"]?.includes("application/x-www-form-urlencoded")
    ) {
      body = new URLSearchParams(
        config.body as Record<string, string>
      ).toString();
    } else {
      body = JSON.stringify(config.body);
    }
  }

  try {
    const response = await fetch(fullUrl, {
      method: config.method || "GET",
      headers,
      body,
    });

    // Handle unauthorized responses
    if (response.status === 401) {
      await handleUnauthorized();
      throw new HttpError(401, "Unauthorized access");
    }

    // Handle non-OK responses
    if (!response.ok) {
      let errorMessage = "Request failed";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If parsing json fails, use status text
        errorMessage = response.statusText || errorMessage;
      }

      console.error("API Error:", {
        status: response.status,
        message: errorMessage,
        url: fullUrl,
      });

      throw new HttpError(response.status, errorMessage);
    }

    // Parse response
    const data = await response.json();
    return data as T;
  } catch (error: any) {
    console.error("Request Failed:", {
      error,
      url: fullUrl,
      method: config.method || "GET",
    });

    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      throw new Error(
        "Network connection failed. Please check your internet connection."
      );
    }

    throw error;
  }
};

export const httpHelper = {
  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    try {
      return await makeRequest<T>(endpoint, config);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      if (error instanceof Error) {
        console.error(error);
        throw new Error(`Network error: ${error.message}`);
      }
      throw new Error("An unknown error occurred");
    }
  },

  get<T>(endpoint: string, config: RequestConfig = {}) {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  },

  post<T>(
    endpoint: string,
    body: Record<string, any> | string,
    config: RequestConfig = {}
  ) {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body,
    });
  },

  put<T>(
    endpoint: string,
    body: Record<string, any>,
    config: RequestConfig = {}
  ) {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body,
    });
  },

  delete<T>(endpoint: string, config: RequestConfig = {}) {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  },
};
