import { mockRepositories } from "@/lib/mock/repositories";
import type {
  ChargingPlan,
  MockScenarioKey,
  ScannedSocket,
  Station,
  StationSort,
  TopupMode,
  TopupOrder,
  TopupStatus
} from "@/lib/types/app";

const DEFAULT_DELAY = 650;

function wait(ms = DEFAULT_DELAY) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildFakeQr(orderId: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
      <rect width="320" height="320" fill="#ffffff"/>
      <rect x="24" y="24" width="88" height="88" fill="#111827"/>
      <rect x="40" y="40" width="56" height="56" fill="#ffffff"/>
      <rect x="56" y="56" width="24" height="24" fill="#111827"/>
      <rect x="208" y="24" width="88" height="88" fill="#111827"/>
      <rect x="224" y="40" width="56" height="56" fill="#ffffff"/>
      <rect x="240" y="56" width="24" height="24" fill="#111827"/>
      <rect x="24" y="208" width="88" height="88" fill="#111827"/>
      <rect x="40" y="224" width="56" height="56" fill="#ffffff"/>
      <rect x="56" y="240" width="24" height="24" fill="#111827"/>
      <rect x="144" y="144" width="16" height="16" fill="#111827"/>
      <rect x="176" y="144" width="16" height="16" fill="#111827"/>
      <rect x="208" y="144" width="16" height="16" fill="#111827"/>
      <rect x="144" y="176" width="16" height="16" fill="#111827"/>
      <rect x="176" y="176" width="16" height="16" fill="#111827"/>
      <rect x="224" y="176" width="16" height="16" fill="#111827"/>
      <rect x="144" y="208" width="16" height="16" fill="#111827"/>
      <rect x="192" y="208" width="16" height="16" fill="#111827"/>
      <rect x="240" y="208" width="16" height="16" fill="#111827"/>
      <text x="160" y="306" text-anchor="middle" font-family="Arial" font-size="14" fill="#111827">${orderId}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function sortStations(list: Station[], sort: StationSort) {
  const next = [...list];
  if (sort === "voucher") {
    next.sort((a, b) => b.vouchers.length - a.vouchers.length);
    return next;
  }
  if (sort === "rating") {
    next.sort((a, b) => b.rating - a.rating);
    return next;
  }
  next.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
  return next;
}

type MockTopupTerminalStatus = Exclude<TopupStatus, "pending">;

type MockTopupPaidPayload = {
  amountVnd: number;
  orderId: string;
  paidAt: string;
  transferContent: string;
};

type MockTopupStatusResponse = {
  amountVnd: number;
  isPaid: boolean;
  orderId: string;
  paidAt: string | null;
  status: TopupStatus;
  transferContent: string;
};

type MockTopupOrderRecord = {
  order: TopupOrder;
  paidListeners: Set<(payload: MockTopupPaidPayload) => void>;
  paidNotified: boolean;
  pollCount: number;
  terminalStatus: MockTopupTerminalStatus | null;
};

const MOCK_TOPUP_CREATE_ERROR = "mock_topup_create_error";
const MOCK_TOPUP_SESSION_EXPIRED = "mock_topup_session_expired";
const topupOrders = new Map<string, MockTopupOrderRecord>();

function getMockTopupTerminalStatus(
  scenario?: MockScenarioKey
): MockTopupTerminalStatus | null {
  if (scenario === "topup-paid") return "paid";
  if (scenario === "topup-expired") return "expired";
  if (scenario === "topup-failed") return "failed";
  return null;
}

function notifyTopupPaid(record: MockTopupOrderRecord) {
  if (record.paidNotified) {
    return;
  }

  record.paidNotified = true;
  const payload: MockTopupPaidPayload = {
    amountVnd: record.order.amountVnd,
    orderId: record.order.orderId,
    paidAt: new Date().toISOString(),
    transferContent: record.order.transferContent
  };

  record.paidListeners.forEach((listener) => listener(payload));
}

export const mockServices = {
  login: async (
    email: string,
    password: string,
    t: (key: "login_error") => string
  ) => {
    await wait();
    if (!email.trim() || !password.trim() || password.length < 6) {
      throw new Error(t("login_error"));
    }
    return mockRepositories.getMemberUser();
  },
  register: async () => {
    await wait(900);
    return mockRepositories.getMemberUser();
  },
  resendVerification: async () => {
    await wait(750);
    return true;
  },
  fetchDashboard: async (scenario: MockScenarioKey) => {
    await wait();
    return {
      stats: {
        totalEnergyKwh:
          scenario === "empty-dashboard"
            ? 0
            : mockRepositories
                .getSessionHistory()
                .reduce((sum, item) => sum + item.energyKwh, 0),
        totalMinutes:
          scenario === "empty-dashboard"
            ? 0
            : mockRepositories
                .getSessionHistory()
                .reduce((sum, item) => sum + item.durationMinutes, 0),
        totalSessions:
          scenario === "empty-dashboard" ? 0 : mockRepositories.getSessionHistory().length
      },
      history: scenario === "empty-dashboard" ? [] : mockRepositories.getSessionHistory()
    };
  },
  fetchStations: async (sort: StationSort, scenario: MockScenarioKey) => {
    await wait();
    const list = mockRepositories.getStations();
    if (scenario === "station-offline") {
      const first = list[0];
      if (first) {
        first.sockets[0].status = "offline";
      }
    }
    return sortStations(list, sort);
  },
  fetchStationDetail: async (
    id: string,
    scenario: MockScenarioKey,
    t: (key: "stations_no_results") => string
  ) => {
    await wait(700);
    const station = mockRepositories.getStationById(id);
    if (!station) {
      throw new Error(t("stations_no_results"));
    }
    if (scenario === "station-offline" && station.id === "station-keangnam") {
      station.sockets[0].status = "offline";
    }
    if (scenario === "plans-faulted" && station.id === "station-keangnam") {
      station.sockets[0].status = "faulted";
    }
    return station;
  },
  simulateScan: async (scenario?: MockScenarioKey): Promise<ScannedSocket> => {
    await wait(800);
    const socket = mockRepositories.getDefaultScannedSocket();
    if (scenario === "station-offline") {
      socket.status = "offline";
    }
    if (scenario === "plans-faulted") {
      socket.status = "faulted";
    }
    return socket;
  },
  createTopupOrder: async (
    amountVnd: number,
    mode: TopupMode,
    planName?: string,
    packageId?: string,
    scenario?: MockScenarioKey
  ): Promise<TopupOrder> => {
    await wait(800);
    if (scenario === "topup-session-expired") {
      throw new Error(MOCK_TOPUP_SESSION_EXPIRED);
    }
    if (scenario === "topup-create-error") {
      throw new Error(MOCK_TOPUP_CREATE_ERROR);
    }

    const bank = mockRepositories.getTopupBankAccount();
    const orderId = `QR${Date.now()}`;
    const order: TopupOrder = {
      orderId,
      amountVnd,
      accountName: bank.accountName,
      accountNumber: bank.accountNumber,
      bankName: bank.bankName,
      transferContent: `CP ${orderId}`,
      qrPayload: buildFakeQr(orderId),
      status: "pending",
      createdAt: new Date().toISOString(),
      mode,
      planName,
      packageId
    };

    const record: MockTopupOrderRecord = {
      order,
      paidListeners: new Set(),
      paidNotified: false,
      pollCount: 0,
      terminalStatus: getMockTopupTerminalStatus(scenario)
    };

    topupOrders.set(orderId, record);

    if (record.terminalStatus === "paid") {
      globalThis.setTimeout(() => {
        const nextRecord = topupOrders.get(orderId);
        if (!nextRecord) {
          return;
        }
        notifyTopupPaid(nextRecord);
      }, 6500);
    }

    return order;
  },
  getTopupOrderStatus: async (orderId: string): Promise<MockTopupStatusResponse | null> => {
    await wait(400);
    const record = topupOrders.get(orderId);

    if (!record) {
      return null;
    }

    record.pollCount += 1;

    if (record.terminalStatus === "paid" && record.pollCount >= 2) {
      notifyTopupPaid(record);
      return {
        amountVnd: record.order.amountVnd,
        isPaid: true,
        orderId: record.order.orderId,
        paidAt: new Date().toISOString(),
        status: "paid",
        transferContent: record.order.transferContent
      };
    }

    if (
      (record.terminalStatus === "expired" || record.terminalStatus === "failed") &&
      record.pollCount >= 2
    ) {
      return {
        amountVnd: record.order.amountVnd,
        isPaid: false,
        orderId: record.order.orderId,
        paidAt: null,
        status: record.terminalStatus,
        transferContent: record.order.transferContent
      };
    }

    return {
      amountVnd: record.order.amountVnd,
      isPaid: false,
      orderId: record.order.orderId,
      paidAt: null,
      status: "pending",
      transferContent: record.order.transferContent
    };
  },
  subscribeTopupPaid: (orderId: string, listener: (payload: MockTopupPaidPayload) => void) => {
    const record = topupOrders.get(orderId);
    if (!record) {
      return () => undefined;
    }

    record.paidListeners.add(listener);
    return () => {
      record.paidListeners.delete(listener);
    };
  },
  listPlans: async (): Promise<ChargingPlan[]> => {
    await wait(300);
    return mockRepositories.getChargingPlans();
  }
};
