"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { getThemeTokens, type AppTheme } from "@/lib/design-tokens/tokens";
import { translate } from "@/lib/constants/i18n";
import { mockRepositories } from "@/lib/mock/repositories";
import { mockServices } from "@/lib/mock/services";
import { isStrongPassword, normalizePhone } from "@/lib/utils/validation";
import type {
  AppLanguage,
  AppUser,
  AuthMode,
  ChargingPlan,
  ChargingSession,
  FeedbackState,
  MockScenarioKey,
  ScannedSocket,
  SessionHistoryItem,
  TopupOrder,
  Transaction,
  VisitorTopupIntent
} from "@/lib/types/app";

type ToastTone = "success" | "danger";

type ToastState = {
  title: string;
  message?: string;
  tone: ToastTone;
} | null;

type Translator = (key: string, params?: Record<string, string | number>) => string;

type MockAppContextValue = {
  theme: AppTheme;
  language: AppLanguage;
  authMode: AuthMode;
  user: AppUser | null;
  balanceVnd: number;
  plans: ChargingPlan[];
  topupPackages: ReturnType<typeof mockRepositories.getTopupPackages>;
  scannedSocket: ScannedSocket | null;
  activeSession: ChargingSession | null;
  sessionHistory: SessionHistoryItem[];
  transactions: Transaction[];
  supportContact: ReturnType<typeof mockRepositories.getSupportContact>;
  supportFaqs: ReturnType<typeof mockRepositories.getSupportFaqs>;
  feedbackState: FeedbackState;
  scenario: MockScenarioKey;
  topupEnabled: boolean;
  plansRecoveryLoading: boolean;
  visitorTopupIntent: VisitorTopupIntent | null;
  toast: ToastState;
  t: Translator;
  setTheme: (theme: AppTheme) => void;
  setLanguage: (language: AppLanguage) => void;
  loginMember: (email: string, password: string) => Promise<void>;
  continueAsVisitor: () => Promise<void>;
  registerMember: (payload: {
    email: string;
    name: string;
    password: string;
    phone: string;
  }) => Promise<{ accountId: string; requiresVerification: boolean }>;
  upgradeVisitor: (payload: {
    confirmPassword: string;
    email?: string;
    fullName: string;
    password: string;
    phone: string;
  }) => Promise<void>;
  logout: () => void;
  applyScenario: (scenario: MockScenarioKey) => void;
  setScannedSocket: (socket: ScannedSocket | null) => void;
  clearToast: () => void;
  buyPlan: (
    plan: ChargingPlan,
    options?: { chargeFromBalance?: boolean }
  ) => Promise<"started" | "extended">;
  retryPendingSessionStart: () => Promise<void>;
  stopSession: () => Promise<void>;
  queueVisitorTopupIntent: (intent: Omit<VisitorTopupIntent, "status">) => void;
  resumeVisitorTopupIntent: () => Promise<"started" | "extended" | null>;
  clearVisitorTopupIntent: () => void;
  completeTopup: (order: TopupOrder) => void;
  saveProfile: (payload: { name: string; avatarUri?: string | null }) => Promise<void>;
  changePassword: (payload: {
    currentPassword: string;
    nextPassword: string;
    confirmPassword: string;
  }) => Promise<void>;
  submitFeedback: (payload: { topic: string; content: string }) => Promise<void>;
  rateSession: (sessionId: string, rating: number) => void;
  setScrollPosition: (key: string, value: number) => void;
  getScrollPosition: (key: string) => number;
};

type ProviderState = {
  theme: AppTheme;
  language: AppLanguage;
  authMode: AuthMode;
  user: AppUser | null;
  balanceVnd: number;
  plans: ChargingPlan[];
  topupPackages: ReturnType<typeof mockRepositories.getTopupPackages>;
  scannedSocket: ScannedSocket | null;
  activeSession: ChargingSession | null;
  sessionHistory: SessionHistoryItem[];
  transactions: Transaction[];
  supportContact: ReturnType<typeof mockRepositories.getSupportContact>;
  supportFaqs: ReturnType<typeof mockRepositories.getSupportFaqs>;
  feedbackState: FeedbackState;
  scenario: MockScenarioKey;
  topupEnabled: boolean;
  plansRecoveryLoading: boolean;
  visitorTopupIntent: VisitorTopupIntent | null;
  toast: ToastState;
};

const STORAGE_KEY = "charplug-web-settings";
const RUNTIME_STORAGE_KEY = "charplug-web-runtime";
const MockAppContext = createContext<MockAppContextValue | null>(null);

type PersistedRuntimeState = Pick<
  ProviderState,
  | "authMode"
  | "user"
  | "balanceVnd"
  | "scannedSocket"
  | "activeSession"
  | "sessionHistory"
  | "transactions"
  | "feedbackState"
  | "scenario"
  | "topupEnabled"
  | "visitorTopupIntent"
>;

function buildScenarioState(scenario: MockScenarioKey): ProviderState {
  const defaults = mockRepositories.getScenarioDefaults();
  const preset = mockRepositories.getScenarioState()[scenario];
  const shouldSeedSocket =
    preset.useActiveSessionSeed || scenario === "plans-faulted" || scenario === "station-offline";
  const scannedSocket = shouldSeedSocket ? mockRepositories.getDefaultScannedSocket() : null;
  const activeSession =
    preset.useActiveSessionSeed && scannedSocket
      ? {
          ...mockRepositories.getActiveSessionSeed(),
          hardwareId: scannedSocket.hardwareId,
          socketIndex: scannedSocket.socketIndex,
          stationId: scannedSocket.stationId,
          stationName: scannedSocket.stationName,
          stationAddress: scannedSocket.stationAddress,
          startedAt: new Date().toISOString()
        }
      : null;

  if (scannedSocket && scenario === "station-offline") {
    scannedSocket.status = "offline";
  }

  if (scannedSocket && scenario === "plans-faulted") {
    scannedSocket.status = "faulted";
  }

  if (activeSession && scenario === "plans-created-only") {
    activeSession.status = "pending";
    activeSession.startCommandStatus = "created_only";
  }

  return {
    theme: defaults.defaultTheme as AppTheme,
    language: defaults.defaultLanguage as AppLanguage,
    authMode: preset.authMode,
    user: preset.userKind === "visitor" ? mockRepositories.getVisitorUser() : mockRepositories.getMemberUser(),
    balanceVnd: preset.balanceVnd,
    plans: mockRepositories.getChargingPlans(),
    topupPackages: mockRepositories.getTopupPackages(),
    scannedSocket,
    activeSession,
    sessionHistory: preset.emptyDashboard ? [] : mockRepositories.getSessionHistory(),
    transactions: mockRepositories.getTransactions(),
    supportContact: mockRepositories.getSupportContact(),
    supportFaqs: mockRepositories.getSupportFaqs(),
    feedbackState:
      scenario === "feedback-locked"
        ? {
            lockedUntil: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            serverNotice: "locked"
          }
        : {},
    scenario,
    topupEnabled: preset.topupEnabled,
    plansRecoveryLoading: true,
    visitorTopupIntent: null,
    toast: null
  };
}

function createHistoryItem(session: ChargingSession): SessionHistoryItem {
  return {
    id: `history-${Date.now()}`,
    stationId: session.stationId,
    stationName: session.stationName,
    address: session.stationAddress,
    endedAt: new Date().toISOString(),
    energyKwh: Number(session.usedEnergyKwh.toFixed(2)),
    durationMinutes: Math.max(1, Math.round((session.totalSeconds - session.remainingSeconds) / 60)),
    amountVnd: session.estimatedAmountVnd
  };
}

export function MockAppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProviderState>(() => buildScenarioState("default"));
  const persistedRef = useRef<{ theme?: AppTheme; language?: AppLanguage } | null>(null);
  const scrollPositionsRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }
    try {
      persistedRef.current = JSON.parse(raw) as { theme?: AppTheme; language?: AppLanguage };
      setState((current) => ({
        ...current,
        theme: persistedRef.current?.theme ?? current.theme,
        language: persistedRef.current?.language ?? current.language
      }));
    } catch {
      persistedRef.current = null;
    }
  }, []);

  useEffect(() => {
    const raw = window.sessionStorage.getItem(RUNTIME_STORAGE_KEY);
    if (!raw) {
      setState((current) => ({ ...current, plansRecoveryLoading: false }));
      return;
    }

    try {
      const persisted = JSON.parse(raw) as PersistedRuntimeState;
      setState((current) => ({
        ...current,
        authMode: persisted.authMode ?? current.authMode,
        user: persisted.user ?? current.user,
        balanceVnd: persisted.balanceVnd ?? current.balanceVnd,
        scannedSocket:
          persisted.scannedSocket ??
          (persisted.activeSession
            ? {
                hardwareId: persisted.activeSession.hardwareId,
                socketIndex: persisted.activeSession.socketIndex,
                stationId: persisted.activeSession.stationId,
                stationName: persisted.activeSession.stationName,
                stationAddress: persisted.activeSession.stationAddress,
                status:
                  persisted.activeSession.status === "active" ||
                  persisted.activeSession.status === "extending" ||
                  persisted.activeSession.status === "pending" ||
                  persisted.activeSession.status === "stopping"
                    ? "charging"
                    : "available"
              }
            : current.scannedSocket),
        activeSession: persisted.activeSession ?? current.activeSession,
        sessionHistory: persisted.sessionHistory ?? current.sessionHistory,
        transactions: persisted.transactions ?? current.transactions,
        feedbackState: persisted.feedbackState ?? current.feedbackState,
        scenario: persisted.scenario ?? current.scenario,
        topupEnabled: persisted.topupEnabled ?? current.topupEnabled,
        visitorTopupIntent: persisted.visitorTopupIntent ?? current.visitorTopupIntent,
        plansRecoveryLoading: false
      }));
    } catch {
      setState((current) => ({ ...current, plansRecoveryLoading: false }));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ theme: state.theme, language: state.language })
    );
  }, [state.language, state.theme]);

  useEffect(() => {
    if (state.plansRecoveryLoading) {
      return;
    }

    const runtimeState: PersistedRuntimeState = {
      authMode: state.authMode,
      user: state.user,
      balanceVnd: state.balanceVnd,
      scannedSocket: state.scannedSocket,
      activeSession: state.activeSession,
      sessionHistory: state.sessionHistory,
      transactions: state.transactions,
      feedbackState: state.feedbackState,
      scenario: state.scenario,
      topupEnabled: state.topupEnabled,
      visitorTopupIntent: state.visitorTopupIntent
    };

    window.sessionStorage.setItem(RUNTIME_STORAGE_KEY, JSON.stringify(runtimeState));
  }, [
    state.activeSession,
    state.authMode,
    state.balanceVnd,
    state.feedbackState,
    state.plansRecoveryLoading,
    state.scannedSocket,
    state.scenario,
    state.sessionHistory,
    state.topupEnabled,
    state.transactions,
    state.user,
    state.visitorTopupIntent
  ]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", state.theme === "dark");
    root.dataset.theme = state.theme;

    const tokens = getThemeTokens(state.theme);
    root.style.setProperty("--cp-background", tokens.background);
    root.style.setProperty("--cp-foreground", tokens.foreground);
    root.style.setProperty("--cp-surface", tokens.surface);
    root.style.setProperty("--cp-surface-alt", tokens.surfaceAlt);
    root.style.setProperty("--cp-surface-full", tokens.surfaceFull);
    root.style.setProperty("--cp-accent", tokens.accent);
    root.style.setProperty("--cp-accent-soft", tokens.accentSoft);
    root.style.setProperty("--cp-accent-soft-2", tokens.accentSoft2);
    root.style.setProperty("--cp-border", tokens.border);
    root.style.setProperty("--cp-divider", tokens.divider);
    root.style.setProperty("--cp-input", tokens.input);
    root.style.setProperty("--cp-muted", tokens.muted);
    root.style.setProperty("--cp-muted-light", tokens.mutedLight);
    root.style.setProperty("--cp-on-accent", tokens.onAccent);
    root.style.setProperty("--cp-available", tokens.available);
    root.style.setProperty("--cp-available-soft", tokens.availableSoft);
    root.style.setProperty("--cp-success", tokens.success);
    root.style.setProperty("--cp-success-soft", tokens.successSoft);
    root.style.setProperty("--cp-warning", tokens.warning);
    root.style.setProperty("--cp-warning-soft", tokens.warningSoft);
    root.style.setProperty("--cp-danger", tokens.danger);
    root.style.setProperty("--cp-danger-soft", tokens.dangerSoft);
    root.style.setProperty("--cp-info", tokens.info);
    root.style.setProperty("--cp-info-soft", tokens.infoSoft);
    root.style.setProperty("--cp-session-stable", tokens.sessionStable);
    root.style.setProperty("--cp-session-stable-soft", tokens.sessionStableSoft);
    root.style.setProperty("--cp-session-warning", tokens.sessionWarning);
    root.style.setProperty("--cp-session-warning-soft", tokens.sessionWarningSoft);
    root.style.setProperty("--cp-session-danger", tokens.sessionDanger);
    root.style.setProperty("--cp-session-danger-soft", tokens.sessionDangerSoft);
    root.style.setProperty("--cp-shadow-base", tokens.shadowBase);
  }, [state.theme]);

  useEffect(() => {
    const applyViewportHeight = () => {
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--cp-vh", `${viewportHeight}px`);
    };

    applyViewportHeight();
    window.visualViewport?.addEventListener("resize", applyViewportHeight);
    window.addEventListener("resize", applyViewportHeight);

    return () => {
      window.visualViewport?.removeEventListener("resize", applyViewportHeight);
      window.removeEventListener("resize", applyViewportHeight);
    };
  }, []);

  useEffect(() => {
    if (!state.activeSession || state.activeSession.status !== "active") {
      return;
    }

    const interval = window.setInterval(() => {
      setState((current) => {
        if (!current.activeSession || current.activeSession.status !== "active") {
          return current;
        }

        const nextRemaining = Math.max(0, current.activeSession.remainingSeconds - 1);
        const nextUsed = Math.min(
          current.activeSession.totalEnergyKwh,
          Number(
            (
              current.activeSession.usedEnergyKwh +
              current.activeSession.totalEnergyKwh / current.activeSession.totalSeconds
            ).toFixed(3)
          )
        );

        if (nextRemaining === 0) {
          const completedHistory = createHistoryItem(current.activeSession);
          return {
            ...current,
            scannedSocket: current.scannedSocket
              ? { ...current.scannedSocket, status: "available" }
              : current.scannedSocket,
            activeSession: null,
            visitorTopupIntent: null,
            sessionHistory: [completedHistory, ...current.sessionHistory]
          };
        }

        return {
          ...current,
          activeSession: {
            ...current.activeSession,
            remainingSeconds: nextRemaining,
            usedEnergyKwh: nextUsed
          }
        };
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [state.activeSession]);

  const t = useCallback<Translator>(
    (key, params) => translate(state.language, key, params),
    [state.language]
  );

  const setTheme = useCallback((theme: AppTheme) => {
    setState((current) => ({ ...current, theme }));
  }, []);

  const setLanguage = useCallback((language: AppLanguage) => {
    setState((current) => ({ ...current, language }));
  }, []);

  const loginMember = useCallback(
    async (email: string, password: string) => {
      const user = await mockServices.login(email, password, t);
      setState((current) => ({
        ...current,
        authMode: "member",
        user,
        toast: null
      }));
    },
    [t]
  );

  const continueAsVisitor = useCallback(async () => {
    const defaults = mockRepositories.getScenarioDefaults();
    await new Promise((resolve) => setTimeout(resolve, 500));
    setState((current) => ({
      ...current,
      authMode: "visitor",
      user: mockRepositories.getVisitorUser(),
      balanceVnd: defaults.visitorBalanceVnd
    }));
  }, []);

  const registerMember = useCallback(
    async (payload: { email: string; name: string; password: string; phone: string }) => {
      await mockServices.register();
      const memberUser = mockRepositories.getMemberUser();
      const normalizedEmail = payload.email.trim().toLowerCase();
      const normalizedPhone = normalizePhone(payload.phone);

      if (normalizedEmail === memberUser.email.trim().toLowerCase()) {
        throw new Error("register_error_email_exists");
      }
      if (normalizedPhone === normalizePhone(memberUser.phone)) {
        throw new Error("register_error_phone_exists");
      }

      return {
        accountId: `pending-${Date.now()}`,
        requiresVerification: true
      };
    },
    []
  );

  const upgradeVisitor = useCallback(async (payload: {
    confirmPassword: string;
    email?: string;
    fullName: string;
    password: string;
    phone: string;
  }) => {
    const defaults = mockRepositories.getScenarioDefaults();
    await new Promise((resolve) => setTimeout(resolve, 700));
    const memberUser = mockRepositories.getMemberUser();
    const normalizedEmail = payload.email?.trim().toLowerCase() ?? "";
    const normalizedPhone = normalizePhone(payload.phone);

    if (state.authMode !== "visitor") {
      throw new Error("upgrade_error_session_invalid");
    }
    if (normalizedPhone === normalizePhone(memberUser.phone)) {
      throw new Error("upgrade_error_phone_exists");
    }
    if (normalizedEmail && normalizedEmail === memberUser.email.trim().toLowerCase()) {
      throw new Error("upgrade_error_email_exists");
    }
    if (payload.password !== payload.confirmPassword) {
      throw new Error("upgrade_error_password_mismatch");
    }
    if (!isStrongPassword(payload.password)) {
      throw new Error("upgrade_error_password_weak");
    }

    setState((current) => ({
      ...current,
      authMode: "member",
      user: current.user
        ? {
            ...current.user,
            name: payload.fullName.trim() || current.user.name,
            email: normalizedEmail,
            phone: payload.phone.trim()
          }
        : {
            ...mockRepositories.getMemberUser(),
            name: payload.fullName.trim() || memberUser.name,
            email: normalizedEmail,
            phone: payload.phone.trim()
          },
      balanceVnd: current.balanceVnd > 0 ? current.balanceVnd : defaults.upgradeBalanceVnd
    }));
  }, [state.authMode]);

  const logout = useCallback(() => {
    setState((current) => ({
      ...current,
      authMode: "guest",
      user: null,
      scannedSocket: null,
      activeSession: null,
      toast: null
    }));
  }, []);

  const applyScenario = useCallback((scenario: MockScenarioKey) => {
    setState((current) => {
      const next = buildScenarioState(scenario);
      return {
        ...next,
        theme: current.theme,
        language: current.language
      };
    });
  }, []);

  const setScannedSocket = useCallback((scannedSocket: ScannedSocket | null) => {
    setState((current) => ({ ...current, scannedSocket }));
  }, []);

  const clearToast = useCallback(() => {
    setState((current) => ({ ...current, toast: null }));
  }, []);

  const buyPlan = useCallback(
    async (plan: ChargingPlan, options?: { chargeFromBalance?: boolean }) => {
      await new Promise((resolve) => setTimeout(resolve, 900));

      let action: "started" | "extended" = "started";
      setState((current) => {
        const chargeFromBalance = options?.chargeFromBalance !== false;
        if (!current.scannedSocket) {
          throw new Error(t("plans_error_scan_required"));
        }

        if (chargeFromBalance && current.balanceVnd < plan.priceVnd) {
          throw new Error(t("plans_error_balance"));
        }

        const nextBalance = chargeFromBalance ? current.balanceVnd - plan.priceVnd : current.balanceVnd;
        const nextTransactions = chargeFromBalance
          ? [
              {
                id: `tx-${Date.now()}`,
                type: "spend" as const,
                packageLabel: plan.name,
                amountVnd: plan.priceVnd,
                date: new Date().toISOString(),
                address: current.scannedSocket.stationAddress
              },
              ...current.transactions
            ]
          : current.transactions;

        if (current.activeSession) {
          action = "extended";
          window.setTimeout(() => {
            setState((value) => {
              if (!value.activeSession) {
                return value;
              }
              return {
                ...value,
                activeSession: {
                  ...value.activeSession,
                  status: "active",
                  startCommandStatus: "acknowledged",
                  totalSeconds: value.activeSession.totalSeconds + plan.durationMinutes * 60,
                  remainingSeconds: value.activeSession.remainingSeconds + plan.durationMinutes * 60,
                  totalEnergyKwh: Number(
                    (value.activeSession.totalEnergyKwh + plan.energyKwh).toFixed(2)
                  ),
                  estimatedAmountVnd: value.activeSession.estimatedAmountVnd + plan.priceVnd,
                  extendCommandStatus: "acknowledged",
                  pendingExtendPlanId: null
                },
                visitorTopupIntent: null,
                toast: {
                  title: t("session_extend_success_title"),
                  message: t("session_extend_success_message"),
                  tone: "success"
                }
              };
            });
          }, 1600);

          return {
            ...current,
            balanceVnd: nextBalance,
            transactions: nextTransactions,
            activeSession: {
              ...current.activeSession,
              status: "extending",
              extendCommandStatus: "sent",
              pendingExtendPlanId: plan.id
            }
          };
        }

        const startedAt = new Date().toISOString();
        const shouldCreateOnly = current.scenario === "plans-created-only";
        window.setTimeout(() => {
          setState((value) => {
            if (!value.activeSession) {
              return value;
            }
            if (value.activeSession.startCommandStatus === "created_only") {
              return value;
            }
            return {
              ...value,
              activeSession: {
                ...value.activeSession,
                status: "active",
                startCommandStatus: "acknowledged"
              }
            };
          });
        }, 1600);

        return {
          ...current,
          balanceVnd: nextBalance,
          transactions: nextTransactions,
          scannedSocket: { ...current.scannedSocket, status: "charging" },
          visitorTopupIntent: null,
          activeSession: {
            id: `session-${Date.now()}`,
            hardwareId: current.scannedSocket.hardwareId,
            socketIndex: current.scannedSocket.socketIndex,
            stationId: current.scannedSocket.stationId,
            stationName: current.scannedSocket.stationName,
            stationAddress: current.scannedSocket.stationAddress,
            planId: plan.id,
            planName: plan.name,
            status: "pending",
            totalSeconds: plan.durationMinutes * 60,
            remainingSeconds: plan.durationMinutes * 60,
            totalEnergyKwh: plan.energyKwh,
            usedEnergyKwh: 0,
            powerWatts: 3600,
            estimatedAmountVnd: plan.priceVnd,
            startedAt,
            startCommandStatus: shouldCreateOnly ? "created_only" : "sent",
            extendCommandStatus: null
          }
        };
      });

      return action;
    },
    [t]
  );

  const retryPendingSessionStart = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    setState((current) => {
      if (!current.activeSession || current.activeSession.status !== "pending") {
        return current;
      }

      return {
        ...current,
        activeSession: {
          ...current.activeSession,
          startCommandStatus: "sent"
        }
      };
    });

    window.setTimeout(() => {
      setState((current) => {
        if (!current.activeSession || current.activeSession.status !== "pending") {
          return current;
        }

        return {
          ...current,
          activeSession: {
            ...current.activeSession,
            status: "active",
            startCommandStatus: "acknowledged"
          }
        };
      });
    }, 1400);
  }, []);

  const stopSession = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setState((current) => {
      if (!current.activeSession) {
        return current;
      }

      const session = { ...current.activeSession, status: "completed" as const };
      return {
        ...current,
        activeSession: null,
        visitorTopupIntent: null,
        scannedSocket: current.scannedSocket ? { ...current.scannedSocket, status: "available" } : null,
        sessionHistory: [createHistoryItem(session), ...current.sessionHistory]
      };
    });
  }, []);

  const queueVisitorTopupIntent = useCallback((intent: Omit<VisitorTopupIntent, "status">) => {
    setState((current) => ({
      ...current,
      visitorTopupIntent: {
        ...intent,
        status: "awaiting_topup"
      }
    }));
  }, []);

  const clearVisitorTopupIntent = useCallback(() => {
    setState((current) => ({
      ...current,
      visitorTopupIntent: null
    }));
  }, []);

  const resumeVisitorTopupIntent = useCallback(async () => {
    const pendingIntent = state.visitorTopupIntent;
    if (!pendingIntent || pendingIntent.status !== "ready_to_resume") {
      return null;
    }

    return buyPlan(pendingIntent.plan);
  }, [buyPlan, state.visitorTopupIntent]);

  const completeTopup = useCallback(
    (order: TopupOrder) => {
      setState((current) => ({
        ...current,
        balanceVnd: current.balanceVnd + order.amountVnd,
        visitorTopupIntent:
          order.mode === "visitor-plan" || order.mode === "visitor-extend"
            ? current.visitorTopupIntent
              ? {
                  ...current.visitorTopupIntent,
                  status: "ready_to_resume"
                }
              : current.visitorTopupIntent
            : current.visitorTopupIntent,
        transactions: [
          {
            id: `tx-${Date.now()}`,
            type: "topup",
            packageLabel: `${order.amountVnd.toLocaleString("vi-VN")}`,
            amountVnd: order.amountVnd,
            date: new Date().toISOString()
          },
          ...current.transactions
        ],
        toast:
          order.mode === "standard"
            ? { title: t("topup_success_standard"), message: undefined, tone: "success" }
            : current.toast
      }));
    },
    [t]
  );

  const saveProfile = useCallback(
    async (payload: { name: string; avatarUri?: string | null }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setState((current) => ({
        ...current,
        user: current.user
          ? {
              ...current.user,
              name: payload.name.trim() || current.user.name,
              avatarUri: payload.avatarUri ?? current.user.avatarUri
            }
          : current.user,
        toast: { title: t("profile_save_success"), tone: "success" }
      }));
    },
    [t]
  );

  const changePassword = useCallback(
    async (payload: { currentPassword: string; nextPassword: string; confirmPassword: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      if (!payload.currentPassword.trim()) {
        throw new Error(t("change_password_error_current_required"));
      }
      if (payload.currentPassword !== mockRepositories.getMockCredentials().memberPassword) {
        throw new Error(t("change_password_error_invalid_current"));
      }
      if (payload.nextPassword !== payload.confirmPassword) {
        throw new Error(t("change_password_error_mismatch"));
      }
      if (!isStrongPassword(payload.nextPassword)) {
        throw new Error(t("change_password_error_weak"));
      }
      setState((current) => ({
        ...current,
        toast: {
          title: t("change_password_success_toast_title"),
          message: t("change_password_success_toast_message"),
          tone: "success"
        }
      }));
    },
    [t]
  );

  const submitFeedback = useCallback(
    async (payload: { topic: string; content: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      const trimmedContent = payload.content.trim();
      const lockedUntilMs = state.feedbackState.lockedUntil
        ? new Date(state.feedbackState.lockedUntil).getTime()
        : 0;

      if (state.authMode === "guest") {
        throw new Error(t("feedback_auth_required"));
      }
      if (lockedUntilMs && lockedUntilMs > Date.now()) {
        setState((current) => ({
          ...current,
          feedbackState: {
            ...current.feedbackState,
            serverNotice: "locked"
          }
        }));
        throw new Error(
          state.feedbackState.lockedUntil
            ? t("feedback_locked_message_until", {
                date: new Date(state.feedbackState.lockedUntil).toLocaleString(
                  state.language === "vi" ? "vi-VN" : "en-US"
                )
              })
            : t("feedback_locked_message_default")
        );
      }
      if (
        payload.topic !== "GENERAL" &&
        payload.topic !== "BUG_REPORT" &&
        payload.topic !== "IMPROVEMENT" &&
        payload.topic !== "FEATURE_REQUEST"
      ) {
        throw new Error(t("feedback_invalid_type"));
      }
      if (!trimmedContent) {
        throw new Error(t("feedback_content_required"));
      }
      if (trimmedContent.length > 2000) {
        throw new Error(t("feedback_content_too_long"));
      }
      if (trimmedContent.toLowerCase().includes("ngu")) {
        setState((current) => ({
          ...current,
          feedbackState: {
            ...current.feedbackState,
            serverNotice: "bad-language"
          }
        }));
        throw new Error(t("feedback_bad_language"));
      }

      const now = Date.now();
      const lastSubmitted = state.feedbackState.lastSubmittedAt
        ? new Date(state.feedbackState.lastSubmittedAt).getTime()
        : 0;

      if (lastSubmitted && now - lastSubmitted < 60_000) {
        setState((current) => ({
          ...current,
          feedbackState: {
            ...current.feedbackState,
            serverNotice: "rate-limit"
          }
        }));
        throw new Error(t("feedback_rate_limit_button", { time: "01:00" }));
      }

      setState((current) => ({
        ...current,
        feedbackState: {
          ...current.feedbackState,
          lastSubmittedAt: new Date().toISOString(),
          serverNotice: null
        },
        toast: {
          title: t("feedback_success_toast_title"),
          message: t("feedback_success_toast_message"),
          tone: "success"
        }
      }));
    },
    [
      state.authMode,
      state.feedbackState.lastSubmittedAt,
      state.feedbackState.lockedUntil,
      state.language,
      t
    ]
  );

  const rateSession = useCallback((sessionId: string, rating: number) => {
    setState((current) => ({
      ...current,
      sessionHistory: current.sessionHistory.map((item) =>
        item.id === sessionId ? { ...item, rating } : item
      )
    }));
  }, []);

  const setScrollPosition = useCallback((key: string, value: number) => {
    scrollPositionsRef.current[key] = value;
  }, []);

  const getScrollPosition = useCallback((key: string) => {
    return scrollPositionsRef.current[key] ?? 0;
  }, []);

  const value = useMemo<MockAppContextValue>(
    () => ({
      ...state,
      t,
      setTheme,
      setLanguage,
      loginMember,
      continueAsVisitor,
      registerMember,
      upgradeVisitor,
      logout,
      applyScenario,
      setScannedSocket,
      clearToast,
      buyPlan,
      retryPendingSessionStart,
      stopSession,
      queueVisitorTopupIntent,
      resumeVisitorTopupIntent,
      clearVisitorTopupIntent,
      completeTopup,
      saveProfile,
      changePassword,
      submitFeedback,
      rateSession,
      setScrollPosition,
      getScrollPosition
    }),
    [
      state,
      t,
      setTheme,
      setLanguage,
      loginMember,
      continueAsVisitor,
      registerMember,
      upgradeVisitor,
      logout,
      applyScenario,
      setScannedSocket,
      clearToast,
      buyPlan,
      retryPendingSessionStart,
      stopSession,
      queueVisitorTopupIntent,
      resumeVisitorTopupIntent,
      clearVisitorTopupIntent,
      completeTopup,
      saveProfile,
      changePassword,
      submitFeedback,
      rateSession,
      setScrollPosition,
      getScrollPosition
    ]
  );

  return <MockAppContext.Provider value={value}>{children}</MockAppContext.Provider>;
}

export function useMockApp() {
  const context = useContext(MockAppContext);
  if (!context) {
    throw new Error("useMockApp must be used inside MockAppProvider");
  }
  return context;
}
