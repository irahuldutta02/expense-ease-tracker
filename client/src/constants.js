export const BASE_URL = "";
export const BACKEND_URL =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:5000";
export const USERS_URL = "/api/users";
export const EXPENSE_URL = "/api/expense";
export const MODE_URL = "/api/mode";
export const CATEGORY_URL = "/api/category";
export const PARTY_URL = "/api/party";
export const INSIGHT_URL = "/api/insight";
