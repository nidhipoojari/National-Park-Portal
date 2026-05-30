// Typed API client for the NPS Portal Express backend (Phase 2).
// Works in both Server Components (server fetch) and Client Components.

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

// ---------- Response types (Oracle returns UPPERCASE column names) ----------

export type ParkRow = {
  PARK_ID: number;
  PARK_NAME: string;
  ADDRESS: string;
  STATE: string;
  ZIPCODE: string;
};

export type FacilityRow = {
  FACILITY_ID: number;
  FACILITY_NAME: string;
  PARK_ID: number;
  FACILITY_TYPE: number; // 1=entrance 2=campsite 3=tour 4=parking
  DAILY_PRICE: number;
  CHILD_PRICE: number;
  CANCELLATION_FEE: number;
  TYPE_LABEL?: string;
};

export type TransactionRow = {
  TRANSACTION_ID: number;
  VISITOR_ID: number;
  TRANSACTION_TYPE: number;
  FACILITY_ID: number;
  START_TIME: string;
  NUMBER_OF_DAYS: number;
  NUM_ADULTS: number;
  NUM_CHILDREN: number;
  TOTAL_PRICE: number;
  STATUS: number;
  TRANSACTION_DATE?: string | null;
};

export type ParkDetail = {
  park: ParkRow;
  facilities: FacilityRow[];
};

export type VisitorRow = {
  VISITOR_ID: number;
  VISITOR_NAME: string;
  VISITOR_EMAIL: string;
  IS_ADMIN: number;
};

// Procedure endpoints return DBMS_OUTPUT lines.
export type ProcOutput = { output: string[]; message?: string };

// ---------- Core fetch helpers ----------

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  init?: RequestInit & { cache?: RequestCache }
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    // Always fresh data for this dynamic portal.
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });

  let body: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!res.ok) {
    const msg =
      (body && typeof body === "object" && "error" in body
        ? String((body as { error: unknown }).error)
        : typeof body === "string"
          ? body
          : res.statusText) || `Request failed (${res.status})`;
    throw new ApiError(res.status, msg);
  }

  return body as T;
}

function get<T>(path: string) {
  return request<T>(path, { method: "GET" });
}

function send<T>(path: string, method: string, body?: unknown) {
  return request<T>(path, {
    method,
    body: body == null ? undefined : JSON.stringify(body),
  });
}

const qs = (params: Record<string, string | number | undefined>) => {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
};

// ---------- Endpoint functions ----------

export const api = {
  health: () => get<{ ok: boolean }>("/health"),

  // Parks
  getParks: () => get<ParkRow[]>("/api/parks"),
  getPark: (id: number) => get<ParkDetail>(`/api/parks/${id}`),

  // Facilities
  getFacilities: (opts: { parkId?: number; type?: number } = {}) =>
    get<FacilityRow[]>(`/api/facilities${qs(opts)}`),

  // Campsites
  getAvailableCampsites: (opts: {
    parkName: string;
    start: string;
    end: string;
    people?: number;
  }) => get<ProcOutput>(`/api/campsites/available${qs(opts)}`),
  reserveCampsite: (body: {
    facilityId: number;
    visitorId: number;
    startDate: string;
    numDays: number;
    adults?: number;
    children?: number;
  }) => send<ProcOutput>("/api/campsites/reserve", "POST", body),

  // Tours
  getParkTours: (parkName: string) =>
    get<ProcOutput>(`/api/tours/by-park/${encodeURIComponent(parkName)}`),
  getAvailableTours: (opts: { name: string; date: string; spots?: number }) =>
    get<ProcOutput>(`/api/tours/available${qs(opts)}`),
  reserveTour: (body: {
    facilityId: number;
    visitorId: number;
    startTime: string;
    adults?: number;
    children?: number;
  }) => send<ProcOutput>("/api/tours/reserve", "POST", body),

  // Visitors
  addVisitor: (body: {
    name: string;
    email: string;
    address?: string;
    state?: string;
    zipcode?: string;
  }) => send<ProcOutput>("/api/visitors", "POST", body),
  getVisitorByEmail: (email: string) =>
    get<VisitorRow>(`/api/visitors/by-email${qs({ email })}`),
  getVisitorTransactions: (name: string) =>
    get<ProcOutput>(`/api/visitors/${encodeURIComponent(name)}/transactions`),

  // Parking
  getParkingLots: (parkName: string) =>
    get<ProcOutput>(`/api/parking/by-park/${encodeURIComponent(parkName)}`),
  updateParkingStatus: (facilityId: number, spotsTaken: number) =>
    send<ProcOutput>(`/api/parking/${facilityId}/status`, "PATCH", { spotsTaken }),

  // Transactions
  getTransactions: () => get<TransactionRow[]>("/api/transactions"),
  cancelTransaction: (id: number) =>
    send<ProcOutput>(`/api/transactions/${id}/cancel`, "POST"),

  // Stats
  getStats: (opts: { start: string; end: string }) =>
    get<ProcOutput>(`/api/stats${qs(opts)}`),
};

export { ApiError };

// Facility type helpers
export const FACILITY_TYPE = {
  ENTRANCE: 1,
  CAMPSITE: 2,
  TOUR: 3,
  PARKING: 4,
} as const;

export function facilityTypeLabel(type: number): string {
  switch (type) {
    case 1:
      return "Entrance";
    case 2:
      return "Campsite";
    case 3:
      return "Tour";
    case 4:
      return "Parking";
    default:
      return "Facility";
  }
}
