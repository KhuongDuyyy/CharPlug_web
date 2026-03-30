import type { AppTheme } from "@/lib/design-tokens/tokens";

export type AppLanguage = "vi" | "en";
export type AuthMode = "guest" | "member" | "visitor";
export type TopupMode = "standard" | "visitor-plan" | "visitor-extend";
export type StationSort = "distance" | "voucher" | "rating";
export type DeviceStatus =
  | "available"
  | "charging"
  | "offline"
  | "faulted"
  | "checking"
  | "completed";
export type SessionStatus = "idle" | "pending" | "active" | "extending" | "stopping" | "completed";
export type TopupStatus = "pending" | "paid" | "expired" | "failed";
export type AccountView = "profile" | "buy-points" | "history" | "feedback" | "support";
export type MockScenarioKey =
  | "default"
  | "visitor"
  | "empty-dashboard"
  | "station-offline"
  | "stations-route-error"
  | "active-session"
  | "plans-created-only"
  | "plans-faulted"
  | "topup-create-error"
  | "topup-session-expired"
  | "topup-paid"
  | "topup-expired"
  | "topup-failed"
  | "feedback-locked"
  | "support-contact-error"
  | "support-faq-empty"
  | "insufficient-balance"
  | "topup-disabled";

export type SessionCommandStatus =
  | "sent"
  | "created_only"
  | "acknowledged"
  | "failed"
  | "timeout";

export type SessionExtendCommandStatus =
  | "queued"
  | "sent"
  | "acknowledged"
  | "failed"
  | "timeout";

export type StationTableCellType = "text" | "multiline" | "currency_vnd" | "tag";

export type StationDetailBlock =
  | {
      id: string;
      type: "heading";
      level: 1 | 2 | 3;
      text: string;
    }
  | {
      id: string;
      type: "paragraph";
      text: string;
    }
  | {
      id: string;
      type: "bullet_list" | "numbered_list";
      items: string[];
    }
  | {
      id: string;
      type: "tag_group";
      title?: string;
      tags: string[];
    }
  | {
      id: string;
      type: "table";
      title?: string;
      columns: Array<{
        key: string;
        label: string;
        cellType: StationTableCellType;
      }>;
      rows: Array<Record<string, number | string | string[]>>;
    }
  | {
      id: string;
      type: "callout";
      variant: "info" | "success" | "warning" | "danger";
      title?: string;
      text: string;
    }
  | {
      id: string;
      type: "divider";
    }
  | {
      id: string;
      type: "quote";
      title?: string;
      text: string;
    };

export interface StationDocumentContent {
  id: string;
  blocks: StationDetailBlock[];
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUri?: string | null;
}

export interface Voucher {
  id: string;
  label: string;
  description?: string;
}

export interface StationSocket {
  index: number;
  status: DeviceStatus;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  description: string;
  rating: number;
  distanceKm: number | null;
  lat?: number;
  lng?: number;
  vouchers: Voucher[];
  sockets: StationSocket[];
  document?: StationDocumentContent;
}

export interface ChargingPlan {
  id: string;
  name: string;
  priceVnd: number;
  durationMinutes: number;
  energyKwh: number;
  isPopular?: boolean;
}

export interface ScannedSocket {
  hardwareId: string;
  socketIndex: number;
  stationId: string;
  stationName: string;
  stationAddress: string;
  status: DeviceStatus;
}

export interface ChargingSession {
  id: string;
  hardwareId: string;
  socketIndex: number;
  stationId: string;
  stationName: string;
  stationAddress: string;
  planId: string;
  planName: string;
  status: SessionStatus;
  totalSeconds: number;
  remainingSeconds: number;
  totalEnergyKwh: number;
  usedEnergyKwh: number;
  powerWatts?: number | null;
  estimatedAmountVnd: number;
  startedAt: string;
  startCommandStatus?: SessionCommandStatus;
  extendCommandStatus?: SessionExtendCommandStatus | null;
  pendingExtendPlanId?: string | null;
}

export interface VisitorTopupIntent {
  status: "awaiting_topup" | "ready_to_resume";
  mode: "visitor-plan" | "visitor-extend";
  plan: ChargingPlan;
  shortfallAmount: number;
}

export interface SessionHistoryItem {
  id: string;
  stationId: string;
  stationName: string;
  address: string;
  endedAt: string;
  energyKwh: number;
  durationMinutes: number;
  amountVnd: number;
  rating?: number;
}

export interface Transaction {
  id: string;
  type: "topup" | "spend";
  packageLabel: string;
  amountVnd: number;
  date: string;
  address?: string;
}

export interface TopupPackage {
  id: string;
  priceLabel: string;
  priceVnd: number;
}

export interface TopupOrder {
  orderId: string;
  amountVnd: number;
  accountName: string;
  accountNumber: string;
  bankName: string;
  transferContent: string;
  qrPayload: string;
  status: TopupStatus;
  createdAt: string;
  mode: TopupMode;
  planName?: string;
  packageId?: string;
}

export interface SupportFaq {
  id: string;
  question: string;
  answer: string;
}

export interface SupportContact {
  phone: string;
  zalo: string;
  email: string;
  address: string;
}

export interface FeedbackState {
  lockedUntil?: string | null;
  lastSubmittedAt?: string | null;
  serverNotice?: "bad-language" | "rate-limit" | "locked" | null;
}
