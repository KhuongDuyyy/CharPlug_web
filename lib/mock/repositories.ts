import {
  mockActiveSessionSeed,
  mockCredentials,
  mockScenarioDefaults,
  mockScenarioKeys,
  mockScenarioState,
  mockTopupBankAccount,
  mockVerificationFallbackEmail,
  chargingPlans,
  defaultScannedSocket,
  memberUser,
  sessionHistory,
  stations,
  supportContact,
  supportFaqs,
  topupPackages,
  transactions,
  visitorUser
} from "@/lib/mock/data";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export const mockRepositories = {
  getMemberUser: () => clone(memberUser),
  getVisitorUser: () => clone(visitorUser),
  getChargingPlans: () => clone(chargingPlans),
  getTopupPackages: () => clone(topupPackages),
  getStations: () => clone(stations),
  getStationById: (id: string) => clone(stations.find((station) => station.id === id) ?? null),
  getDefaultScannedSocket: () => clone(defaultScannedSocket),
  getSessionHistory: () => clone(sessionHistory),
  getTransactions: () => clone(transactions),
  getSupportContact: () => clone(supportContact),
  getSupportFaqs: () => clone(supportFaqs),
  getMockCredentials: () => clone(mockCredentials),
  getVerificationFallbackEmail: () => mockVerificationFallbackEmail,
  getTopupBankAccount: () => clone(mockTopupBankAccount),
  getScenarioKeys: () => clone(mockScenarioKeys),
  getScenarioDefaults: () => clone(mockScenarioDefaults),
  getScenarioState: () => clone(mockScenarioState),
  getActiveSessionSeed: () => clone(mockActiveSessionSeed)
};
