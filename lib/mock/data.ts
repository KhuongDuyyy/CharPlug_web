import type {
  AppUser,
  AuthMode,
  ChargingPlan,
  ChargingSession,
  MockScenarioKey,
  ScannedSocket,
  SessionHistoryItem,
  Station,
  StationDocumentContent,
  SupportContact,
  SupportFaq,
  TopupPackage,
  Transaction
} from "@/lib/types/app";

export const memberUser: AppUser = {
  id: "user-1",
  name: "Nguyễn An",
  email: "an.nguyen@chargeplug.vn",
  phone: "0901 234 567",
  avatarUri: null
};

export const visitorUser: AppUser = {
  id: "visitor-1",
  name: "Tài khoản khách",
  email: "visitor@chargeplug.vn",
  phone: "",
  avatarUri: null
};

export const chargingPlans: ChargingPlan[] = [
  { id: "plan-1", name: "Charge 1", priceVnd: 15000, durationMinutes: 30, energyKwh: 0.5 },
  { id: "plan-2", name: "Charge 2", priceVnd: 32000, durationMinutes: 60, energyKwh: 1, isPopular: true },
  { id: "plan-3", name: "Charge 3", priceVnd: 60000, durationMinutes: 120, energyKwh: 2 },
  { id: "plan-4", name: "Charge 4", priceVnd: 90000, durationMinutes: 180, energyKwh: 3 }
];

export const topupPackages: TopupPackage[] = [
  { id: "pkg-50", priceLabel: "50.000", priceVnd: 50000 },
  { id: "pkg-100", priceLabel: "100.000", priceVnd: 100000 },
  { id: "pkg-200", priceLabel: "200.000", priceVnd: 200000 }
];

const stationKeangnamDocument: StationDocumentContent = {
  id: "station-doc-keangnam",
  blocks: [
    { id: "kg-heading", type: "heading", level: 1, text: "Khu vực sạc tầng B2" },
    {
      id: "kg-paragraph",
      type: "paragraph",
      text:
        "Đi theo lối bảo vệ tầng B2, giữ làn bên phải và dừng tại cụm ChargePlug gần sảnh E6 để bắt đầu phiên sạc."
    },
    {
      id: "kg-bullet",
      type: "bullet_list",
      items: [
        "Quét đúng mã QR trên từng ổ sạc trước khi chọn gói.",
        "Giữ xe trong ô chờ cho đến khi ứng dụng xác nhận bắt đầu sạc.",
        "Liên hệ bảo vệ nếu khu vực đang tạm thời bị chắn."
      ]
    },
    {
      id: "kg-numbered",
      type: "numbered_list",
      items: [
        "Đỗ xe vào đúng vị trí đánh dấu ChargePlug.",
        "Cắm đầu nối và kiểm tra đèn trạng thái trên ổ sạc.",
        "Mở ứng dụng, chọn gói và chờ thiết bị xác nhận."
      ]
    },
    {
      id: "kg-tags",
      type: "tag_group",
      title: "Tiện ích tại điểm sạc",
      tags: ["Bãi xe trong nhà", "Bảo vệ 24/7", "Có mái che"]
    },
    {
      id: "kg-table",
      type: "table",
      title: "Bảng giá tham khảo",
      columns: [
        { key: "package", label: "Gói", cellType: "text" },
        { key: "duration", label: "Thời gian", cellType: "text" },
        { key: "price", label: "Giá", cellType: "currency_vnd" },
        { key: "notes", label: "Ghi chú", cellType: "multiline" }
      ],
      rows: [
        {
          package: "Charge 1",
          duration: "30 phút",
          price: 15000,
          notes: "Phù hợp cho phiên sạc ngắn."
        },
        {
          package: "Charge 2",
          duration: "60 phút",
          price: 32000,
          notes: "Gói phổ biến nhất tại trạm này."
        }
      ]
    },
    {
      id: "kg-callout",
      type: "callout",
      variant: "info",
      title: "Lưu ý khi vào hầm",
      text:
        "Tín hiệu mạng có thể yếu ở đoạn đầu hầm. Hãy chờ ứng dụng tải xong trạng thái ổ sạc trước khi rời xe."
    },
    { id: "kg-divider", type: "divider" },
    {
      id: "kg-quote",
      type: "quote",
      title: "ChargePlug",
      text:
        "Nếu phiên sạc không bắt đầu sau khi đã quét mã, hãy kiểm tra lại đầu nối rồi gửi lại lệnh bắt đầu."
    }
  ]
};

const stationVinhomesDocument: StationDocumentContent = {
  id: "station-doc-vinhomes",
  blocks: [
    { id: "vh-heading", type: "heading", level: 1, text: "Cụm sạc sảnh thương mại" },
    {
      id: "vh-paragraph",
      type: "paragraph",
      text:
        "Trạm nằm đối diện lối vào hầm B1. Nhân viên hỗ trợ có mặt trong giờ hành chính để hướng dẫn xe vào đúng vị trí."
    },
    {
      id: "vh-tags",
      type: "tag_group",
      title: "Dịch vụ",
      tags: ["Có nhân viên hỗ trợ", "Gần sảnh thương mại"]
    }
  ]
};

const stationOceanDocument: StationDocumentContent = {
  id: "station-doc-ocean",
  blocks: [
    { id: "op-heading", type: "heading", level: 1, text: "Điểm sạc ngoài trời" },
    {
      id: "op-paragraph",
      type: "paragraph",
      text:
        "Khu vực sạc có mái che nhẹ và nằm cạnh cửa hàng tiện lợi. Ưu tiên cư dân và xe công nghệ vào giờ cao điểm."
    },
    {
      id: "op-callout",
      type: "callout",
      variant: "warning",
      title: "Lưu ý thời tiết",
      text: "Trong điều kiện mưa lớn, vui lòng kiểm tra đầu nối khô ráo trước khi bắt đầu sạc."
    }
  ]
};

export const stations: Station[] = [
  {
    id: "station-keangnam",
    name: "Trạm Keangnam",
    address: "Phạm Hùng, Nam Từ Liêm, Hà Nội",
    description: "Bãi đỗ tầng B2 gần sảnh E6. Thuận tiện cho xe vào buổi tối.",
    rating: 4.8,
    distanceKm: 1.2,
    lat: 21.0139,
    lng: 105.7806,
    vouchers: [
      {
        id: "voucher-1",
        label: "Giảm 10% cho phiên đầu tiên",
        description: "Áp dụng cho khách mới quét QR và bắt đầu phiên sạc đầu tiên tại trạm."
      }
    ],
    sockets: [
      { index: 0, status: "available" },
      { index: 1, status: "charging" }
    ],
    document: stationKeangnamDocument
  },
  {
    id: "station-vinhomes",
    name: "Trạm Vinhomes West",
    address: "Đại lộ Thăng Long, Nam Từ Liêm, Hà Nội",
    description: "Khu vực sảnh thương mại, có nhân viên hỗ trợ trong giờ hành chính.",
    rating: 4.7,
    distanceKm: 3.5,
    lat: 21.0108,
    lng: 105.7344,
    vouchers: [],
    sockets: [
      { index: 0, status: "available" },
      { index: 1, status: "available" }
    ],
    document: stationVinhomesDocument
  },
  {
    id: "station-ocean",
    name: "Trạm Ocean Park",
    address: "Đa Tốn, Gia Lâm, Hà Nội",
    description: "Điểm sạc ngoài trời, ưu tiên xe công nghệ và cư dân.",
    rating: 4.6,
    distanceKm: 12.8,
    lat: 20.9951,
    lng: 105.9386,
    vouchers: [
      {
        id: "voucher-2",
        label: "Tặng 5.000 VND cho phiên từ 60 phút",
        description: "Ưu đãi áp dụng cho phiên sạc tiêu chuẩn từ 60 phút trở lên."
      }
    ],
    sockets: [
      { index: 0, status: "offline" },
      { index: 1, status: "available" }
    ],
    document: stationOceanDocument
  }
];

export const defaultScannedSocket: ScannedSocket = {
  hardwareId: "CP-KEANGNAM-01",
  socketIndex: 0,
  stationId: "station-keangnam",
  stationName: "Trạm Keangnam",
  stationAddress: "Phạm Hùng, Nam Từ Liêm, Hà Nội",
  status: "available"
};

export const sessionHistory: SessionHistoryItem[] = [
  {
    id: "history-1",
    stationId: "station-keangnam",
    stationName: "Trạm Keangnam",
    address: "Phạm Hùng, Nam Từ Liêm, Hà Nội",
    endedAt: "2026-03-28T08:40:00+07:00",
    energyKwh: 1.8,
    durationMinutes: 78,
    amountVnd: 50000,
    rating: 5
  },
  {
    id: "history-2",
    stationId: "station-vinhomes",
    stationName: "Trạm Vinhomes West",
    address: "Đại lộ Thăng Long, Nam Từ Liêm, Hà Nội",
    endedAt: "2026-03-25T19:05:00+07:00",
    energyKwh: 1.2,
    durationMinutes: 60,
    amountVnd: 32000
  },
  {
    id: "history-3",
    stationId: "station-ocean",
    stationName: "Trạm Ocean Park",
    address: "Đa Tốn, Gia Lâm, Hà Nội",
    endedAt: "2026-03-20T07:15:00+07:00",
    energyKwh: 0.6,
    durationMinutes: 30,
    amountVnd: 15000
  }
];

export const transactions: Transaction[] = [
  {
    id: "tx-1",
    type: "topup",
    packageLabel: "100.000",
    amountVnd: 100000,
    date: "2026-03-22T09:20:00+07:00"
  },
  {
    id: "tx-2",
    type: "spend",
    packageLabel: "Charge 2",
    amountVnd: 32000,
    date: "2026-03-25T19:05:00+07:00",
    address: "Đại lộ Thăng Long, Nam Từ Liêm, Hà Nội"
  },
  {
    id: "tx-3",
    type: "spend",
    packageLabel: "Charge 1",
    amountVnd: 15000,
    date: "2026-03-28T08:40:00+07:00",
    address: "Phạm Hùng, Nam Từ Liêm, Hà Nội"
  }
];

export const supportContact: SupportContact = {
  phone: "1900 1234",
  zalo: "0901234567",
  email: "support@chargeplug.vn",
  address: "Tầng 12, Keangnam Hanoi Landmark 72, Hà Nội"
};

export const supportFaqs: SupportFaq[] = [
  {
    id: "faq-1",
    question: "Làm sao để nạp tiền?",
    answer:
      "Vào mục Tài khoản → Nạp tiền, chọn gói phù hợp và thanh toán qua thẻ hoặc ví điện tử."
  },
  {
    id: "faq-2",
    question: "Tôi có thể hoàn tiền không?",
    answer:
      "Số dư đã nạp không thể hoàn tiền trực tiếp. Vui lòng liên hệ hotline hoặc Zalo nếu cần hỗ trợ."
  },
  {
    id: "faq-3",
    question: "Số dư có thời hạn sử dụng không?",
    answer: "Số dư có hiệu lực trong 12 tháng kể từ ngày nạp."
  }
];

export const mockCredentials = {
  memberPassword: "Password@123"
} as const;

export const mockVerificationFallbackEmail = memberUser.email;

export const mockTopupBankAccount = {
  accountName: "CONG TY CHARGEPLUG",
  accountNumber: "1029384756",
  bankName: "VPBank"
} as const;

export const mockScenarioKeys = [
  "default",
  "visitor",
  "empty-dashboard",
  "station-offline",
  "stations-route-error",
  "active-session",
  "plans-created-only",
  "plans-faulted",
  "topup-create-error",
  "topup-session-expired",
  "topup-paid",
  "topup-expired",
  "topup-failed",
  "feedback-locked",
  "support-contact-error",
  "support-faq-empty",
  "insufficient-balance",
  "topup-disabled"
] as const satisfies readonly MockScenarioKey[];

export const mockScenarioDefaults = {
  defaultTheme: "light",
  defaultLanguage: "vi",
  defaultBalanceVnd: 50000,
  visitorBalanceVnd: 0,
  insufficientBalanceVnd: 10000,
  upgradeBalanceVnd: 50000
} as const;

export const mockActiveSessionSeed: Pick<
  ChargingSession,
  | "id"
  | "planId"
  | "planName"
  | "status"
  | "totalSeconds"
  | "remainingSeconds"
  | "totalEnergyKwh"
  | "usedEnergyKwh"
  | "powerWatts"
  | "estimatedAmountVnd"
  | "startCommandStatus"
> = {
  id: "session-live-1",
  planId: "plan-2",
  planName: "Charge 2",
  status: "active",
  totalSeconds: 3600,
  remainingSeconds: 2460,
  totalEnergyKwh: 1,
  usedEnergyKwh: 0.32,
  powerWatts: 3600,
  estimatedAmountVnd: 32000,
  startCommandStatus: "sent"
};

export const mockScenarioState = {
  default: {
    authMode: "member",
    userKind: "member",
    balanceVnd: mockScenarioDefaults.defaultBalanceVnd,
    topupEnabled: true,
    emptyDashboard: false,
    useActiveSessionSeed: false
  },
  visitor: {
    authMode: "visitor",
    userKind: "visitor",
    balanceVnd: mockScenarioDefaults.visitorBalanceVnd,
    topupEnabled: true,
    emptyDashboard: false,
    useActiveSessionSeed: false
  },
  "empty-dashboard": {
    authMode: "member",
    userKind: "member",
    balanceVnd: mockScenarioDefaults.defaultBalanceVnd,
    topupEnabled: true,
    emptyDashboard: true,
    useActiveSessionSeed: false
  },
  "station-offline": {
    authMode: "member",
    userKind: "member",
    balanceVnd: mockScenarioDefaults.defaultBalanceVnd,
    topupEnabled: true,
    emptyDashboard: false,
    useActiveSessionSeed: false
  },
  "stations-route-error": {
    authMode: "member",
    userKind: "member",
    balanceVnd: mockScenarioDefaults.defaultBalanceVnd,
    topupEnabled: true,
    emptyDashboard: false,
    useActiveSessionSeed: false
  },
  "active-session": {
    authMode: "member",
    userKind: "member",
    balanceVnd: mockScenarioDefaults.defaultBalanceVnd,
    topupEnabled: true,
    emptyDashboard: false,
    useActiveSessionSeed: true
  },
  "plans-created-only": {
    authMode: "member",
    userKind: "member",
    balanceVnd: mockScenarioDefaults.defaultBalanceVnd,
    topupEnabled: true,
    emptyDashboard: false,
    useActiveSessionSeed: true
  },
  "plans-faulted": {
    authMode: "member",
    userKind: "member",
    balanceVnd: mockScenarioDefaults.defaultBalanceVnd,
    topupEnabled: true,
    emptyDashboard: false,
    useActiveSessionSeed: false
  },
  "topup-create-error": {
    authMode: "member",
    userKind: "member",
    balanceVnd: mockScenarioDefaults.defaultBalanceVnd,
    topupEnabled: true,
    emptyDashboard: false,
    useActiveSessionSeed: false
  },
  "topup-session-expired": {
    authMode: "member",
    userKind: "member",
    balanceVnd: mockScenarioDefaults.defaultBalanceVnd,
    topupEnabled: true,
    emptyDashboard: false,
    useActiveSessionSeed: false
  },
  "topup-paid": {
    authMode: "member",
    userKind: "member",
    balanceVnd: mockScenarioDefaults.defaultBalanceVnd,
    topupEnabled: true,
    emptyDashboard: false,
    useActiveSessionSeed: false
  },
  "topup-expired": {
    authMode: "member",
    userKind: "member",
    balanceVnd: mockScenarioDefaults.defaultBalanceVnd,
    topupEnabled: true,
    emptyDashboard: false,
    useActiveSessionSeed: false
  },
  "topup-failed": {
    authMode: "member",
    userKind: "member",
    balanceVnd: mockScenarioDefaults.defaultBalanceVnd,
    topupEnabled: true,
    emptyDashboard: false,
    useActiveSessionSeed: false
  },
  "feedback-locked": {
    authMode: "member",
    userKind: "member",
    balanceVnd: mockScenarioDefaults.defaultBalanceVnd,
    topupEnabled: true,
    emptyDashboard: false,
    useActiveSessionSeed: false
  },
  "support-contact-error": {
    authMode: "member",
    userKind: "member",
    balanceVnd: mockScenarioDefaults.defaultBalanceVnd,
    topupEnabled: true,
    emptyDashboard: false,
    useActiveSessionSeed: false
  },
  "support-faq-empty": {
    authMode: "member",
    userKind: "member",
    balanceVnd: mockScenarioDefaults.defaultBalanceVnd,
    topupEnabled: true,
    emptyDashboard: false,
    useActiveSessionSeed: false
  },
  "insufficient-balance": {
    authMode: "member",
    userKind: "member",
    balanceVnd: mockScenarioDefaults.insufficientBalanceVnd,
    topupEnabled: true,
    emptyDashboard: false,
    useActiveSessionSeed: false
  },
  "topup-disabled": {
    authMode: "member",
    userKind: "member",
    balanceVnd: mockScenarioDefaults.defaultBalanceVnd,
    topupEnabled: false,
    emptyDashboard: false,
    useActiveSessionSeed: false
  }
} as const satisfies Record<
  MockScenarioKey,
  {
    authMode: AuthMode;
    userKind: "member" | "visitor";
    balanceVnd: number;
    topupEnabled: boolean;
    emptyDashboard: boolean;
    useActiveSessionSeed: boolean;
  }
>;
