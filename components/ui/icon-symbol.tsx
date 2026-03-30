"use client";

import type { ReactNode, SVGProps } from "react";

type SvgIconProps = {
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
};

function createSvg(
  viewBox: string,
  render: (props: Required<Pick<SvgIconProps, "color" | "strokeWidth">>) => ReactNode
) {
  return function SvgIcon({
    size = 18,
    color = "currentColor",
    className,
    strokeWidth = 1.8
  }: SvgIconProps) {
    return (
      <svg
        viewBox={viewBox}
        width={size}
        height={size}
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {render({ color, strokeWidth })}
      </svg>
    );
  };
}

const icons = {
  "arrow.triangle.2.circlepath": createSvg("0 0 24 24", ({ color, strokeWidth }) => (
    <>
      <path
        d="M7 7.5A7.5 7.5 0 0 1 19.3 6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path d="M18.7 3.7v3.8h-3.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M17 16.5A7.5 7.5 0 0 1 4.7 18"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path d="M5.3 20.3v-3.8h3.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </>
  )),
  "bolt.fill": createSvg("0 0 24 24", ({ color }) => (
    <path
      fill={color}
      d="M13.4 2.8a1 1 0 0 1 .9 1.3L12.6 10H18a1 1 0 0 1 .8 1.6l-8.2 10a1 1 0 0 1-1.8-.8l1.7-6.8H6a1 1 0 0 1-.8-1.6l6.4-8.9a1 1 0 0 1 1.8.3Z"
    />
  )),
  "cart.fill": createSvg("0 0 24 24", ({ color }) => (
    <>
      <path fill={color} d="M4.2 5a1 1 0 0 1 1-1h1.7a1 1 0 0 1 1 .8l.4 1.7h10a1 1 0 0 1 1 1.2l-1.2 6.4a1 1 0 0 1-1 .8H9.3a1 1 0 0 1-1-.8L6.8 7H5.2a1 1 0 0 1-1-1Z" />
      <circle cx="10" cy="19" r="1.8" fill={color} />
      <circle cx="17" cy="19" r="1.8" fill={color} />
    </>
  )),
  checkmark: createSvg("0 0 24 24", ({ color, strokeWidth }) => (
    <path d="m5.5 12.5 4.2 4.2L18.5 8" stroke={color} strokeWidth={strokeWidth + 0.2} strokeLinecap="round" strokeLinejoin="round" />
  )),
  "checkmark.circle.fill": createSvg("0 0 24 24", ({ color }) => (
    <>
      <circle cx="12" cy="12" r="9.5" fill={color} />
      <path d="m8.1 12.1 2.6 2.7 5.2-5.4" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </>
  )),
  "chevron.down": createSvg("0 0 24 24", ({ color, strokeWidth }) => (
    <path d="m6.5 9.5 5.5 5.5 5.5-5.5" stroke={color} strokeWidth={strokeWidth + 0.2} strokeLinecap="round" strokeLinejoin="round" />
  )),
  "chevron.left": createSvg("0 0 24 24", ({ color, strokeWidth }) => (
    <path d="m14.8 5.5-6.6 6.5 6.6 6.5" stroke={color} strokeWidth={strokeWidth + 0.2} strokeLinecap="round" strokeLinejoin="round" />
  )),
  "chevron.right": createSvg("0 0 24 24", ({ color, strokeWidth }) => (
    <path d="m9.2 5.5 6.6 6.5-6.6 6.5" stroke={color} strokeWidth={strokeWidth + 0.2} strokeLinecap="round" strokeLinejoin="round" />
  )),
  "clock.fill": createSvg("0 0 24 24", ({ color }) => (
    <>
      <circle cx="12" cy="12" r="9.5" fill={color} />
      <path d="M12 7.2v5.4l3.8 2.3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  )),
  "envelope.fill": createSvg("0 0 24 24", ({ color }) => (
    <>
      <rect x="3.2" y="5.2" width="17.6" height="13.6" rx="2.4" fill={color} />
      <path d="m5.7 7.6 6.3 4.9 6.3-4.9" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  )),
  "ev.charger.fill": createSvg("0 0 24 24", ({ color }) => (
    <>
      <path fill={color} d="M8 3.5A2.5 2.5 0 0 0 5.5 6v12A2.5 2.5 0 0 0 8 20.5h8A2.5 2.5 0 0 0 18.5 18V6A2.5 2.5 0 0 0 16 3.5H8Z" />
      <path fill="#fff" d="M10 6.6h4v4.2h-4zM15.8 7.4a1 1 0 0 1 2 0v2.7a3 3 0 0 1-1.7 2.7l-.8.4v2.7a1 1 0 0 1-2 0v-3.3a1 1 0 0 1 .6-.9l1.3-.6a1 1 0 0 0 .6-.9V7.4Z" />
      <path fill="#fff" d="M11.6 11.7h1.5l-1.7 4.1h-.8l.7-2.3H10l1.6-3.5h.8l-.8 1.7Z" />
    </>
  )),
  "exclamationmark.circle.fill": createSvg("0 0 24 24", ({ color }) => (
    <>
      <circle cx="12" cy="12" r="9.5" fill={color} />
      <path d="M12 6.9v6.1" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" />
      <circle cx="12" cy="16.8" r="1.2" fill="#fff" />
    </>
  )),
  "exclamationmark.triangle.fill": createSvg("0 0 24 24", ({ color }) => (
    <>
      <path fill={color} d="M10.8 3.7a1.4 1.4 0 0 1 2.4 0l8 13.8a1.4 1.4 0 0 1-1.2 2.1H4a1.4 1.4 0 0 1-1.2-2.1l8-13.8Z" />
      <path d="M12 8.3v5.4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16.9" r="1.1" fill="#fff" />
    </>
  )),
  "house.fill": createSvg("0 0 24 24", ({ color }) => (
    <path fill={color} d="M11.2 3.9a1.3 1.3 0 0 1 1.6 0l7 5.6c.3.2.4.6.4 1v8a1.5 1.5 0 0 1-1.5 1.5h-4.1a1 1 0 0 1-1-1v-4.4h-3.2V19a1 1 0 0 1-1 1H5.3a1.5 1.5 0 0 1-1.5-1.5v-8c0-.4.2-.8.5-1l6.9-5.6Z" />
  )),
  "location.fill": createSvg("0 0 24 24", ({ color }) => (
    <>
      <path fill={color} d="M12 2.8a6.5 6.5 0 0 0-6.5 6.5c0 4.2 5.2 9.6 6.1 10.5a.6.6 0 0 0 .8 0c1-.9 6.1-6.3 6.1-10.5A6.5 6.5 0 0 0 12 2.8Z" />
      <circle cx="12" cy="9.3" r="2.5" fill="#fff" />
    </>
  )),
  "message.fill": createSvg("0 0 24 24", ({ color }) => (
    <path fill={color} d="M5.8 4.3h12.4a2.5 2.5 0 0 1 2.5 2.5v7.4a2.5 2.5 0 0 1-2.5 2.5H11l-4.3 3a.7.7 0 0 1-1.1-.6v-2.4H5.8a2.5 2.5 0 0 1-2.5-2.5V6.8a2.5 2.5 0 0 1 2.5-2.5Z" />
  )),
  "paperplane.fill": createSvg("0 0 24 24", ({ color }) => (
    <path fill={color} d="m21 4.5-3.8 15.4a1 1 0 0 1-1.6.5l-4.4-3.4-2.5 2.4a1 1 0 0 1-1.7-.7v-3.5l10.7-8.8-13 7.4-4-1.4a1 1 0 0 1 0-1.9L19.7 3.6A1 1 0 0 1 21 4.5Z" />
  )),
  "person.fill": createSvg("0 0 24 24", ({ color }) => (
    <>
      <circle cx="12" cy="8.3" r="3.6" fill={color} />
      <path fill={color} d="M7 19.3a5 5 0 0 1 5-4h0a5 5 0 0 1 5 4v.9H7v-.9Z" />
    </>
  )),
  "phone.fill": createSvg("0 0 24 24", ({ color }) => (
    <path fill={color} d="M7.1 3.8c.5-.5 1.3-.6 1.9-.2l2.3 1.6c.7.5 1 1.4.7 2.2l-.8 2a1 1 0 0 0 .2 1l2.6 2.6a1 1 0 0 0 1 .2l2-.8c.8-.3 1.7 0 2.2.7l1.6 2.3c.4.6.3 1.4-.2 1.9l-1.2 1.2c-.8.8-2 1.1-3.1.8-2.1-.6-4.4-2.1-6.7-4.4C8.3 13.5 6.8 11.2 6.2 9.1c-.3-1.1 0-2.3.8-3.1l1.2-1.2Z" />
  )),
  "qr.code": createSvg("0 0 24 24", ({ color }) => (
    <>
      <rect x="3.2" y="3.2" width="6.4" height="6.4" rx="1.2" fill={color} />
      <rect x="5.1" y="5.1" width="2.6" height="2.6" rx=".6" fill="#fff" />
      <rect x="14.4" y="3.2" width="6.4" height="6.4" rx="1.2" fill={color} />
      <rect x="16.3" y="5.1" width="2.6" height="2.6" rx=".6" fill="#fff" />
      <rect x="3.2" y="14.4" width="6.4" height="6.4" rx="1.2" fill={color} />
      <rect x="5.1" y="16.3" width="2.6" height="2.6" rx=".6" fill="#fff" />
      <rect x="14.7" y="14.7" width="1.9" height="1.9" rx=".4" fill={color} />
      <rect x="17.7" y="14.7" width="1.9" height="1.9" rx=".4" fill={color} />
      <rect x="14.7" y="17.7" width="1.9" height="1.9" rx=".4" fill={color} />
      <rect x="19" y="18" width="1.8" height="2.8" rx=".4" fill={color} />
      <rect x="18" y="17" width="2.8" height="1.8" rx=".4" fill={color} />
    </>
  )),
  "qrcode.viewfinder": createSvg("0 0 24 24", ({ color }) => (
    <>
      <path d="M8 4.2H5.8A1.6 1.6 0 0 0 4.2 5.8V8" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M16 4.2h2.2a1.6 1.6 0 0 1 1.6 1.6V8" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M19.8 16v2.2a1.6 1.6 0 0 1-1.6 1.6H16" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M8 19.8H5.8a1.6 1.6 0 0 1-1.6-1.6V16" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <rect x="8.2" y="8.2" width="7.6" height="7.6" rx="1.8" fill={color} opacity=".22" />
      <rect x="10" y="10" width="4" height="4" rx="1" fill={color} />
    </>
  )),
  settings: createSvg("0 0 24 24", ({ color }) => (
    <>
      <path fill={color} d="M12 7.8A4.2 4.2 0 1 0 12 16.2 4.2 4.2 0 1 0 12 7.8Zm9.1 4.2-.2-.8-1.8-.7a7.8 7.8 0 0 0-.6-1.5l.8-1.8-.6-.6-1.8.8a7.8 7.8 0 0 0-1.5-.6l-.7-1.8-.8-.2-.8.2-.7 1.8a7.8 7.8 0 0 0-1.5.6l-1.8-.8-.6.6.8 1.8c-.3.5-.5 1-.6 1.5l-1.8.7-.2.8.2.8 1.8.7c.1.5.3 1 .6 1.5l-.8 1.8.6.6 1.8-.8c.5.3 1 .5 1.5.6l.7 1.8.8.2.8-.2.7-1.8c.5-.1 1-.3 1.5-.6l1.8.8.6-.6-.8-1.8c.3-.5.5-1 .6-1.5l1.8-.7.2-.8Z" />
      <circle cx="12" cy="12" r="2.3" fill="#fff" />
    </>
  )),
  "star.fill": createSvg("0 0 24 24", ({ color }) => (
    <path fill={color} d="m12 2.8 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17l-5.6 3 1-6.2L2.9 9.4l6.2-.9L12 2.8Z" />
  )),
  "tag.fill": createSvg("0 0 24 24", ({ color }) => (
    <>
      <path fill={color} d="M4.5 8.1a2 2 0 0 1 .6-1.4l4.7-4.7h5.3a1.5 1.5 0 0 1 1.1.4l5.4 5.4a1.5 1.5 0 0 1 0 2.1l-8.7 8.7a1.5 1.5 0 0 1-2.1 0L4.9 12.7a2 2 0 0 1-.4-2.5Z" />
      <circle cx="14.3" cy="6.7" r="1.3" fill="#fff" />
    </>
  )),
  "wifi.slash": createSvg("0 0 24 24", ({ color, strokeWidth }) => (
    <>
      <path d="M4.4 8.8a11.4 11.4 0 0 1 12.7-1.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M6.9 12.1a7.9 7.9 0 0 1 6.2-.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="m3.7 4 16.6 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M10 15.5a3.8 3.8 0 0 1 1.9-.5c1 0 1.9.4 2.6 1" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="12" cy="19" r="1.4" fill={color} />
    </>
  )),
  "wrench.fill": createSvg("0 0 24 24", ({ color }) => (
    <path fill={color} d="M15.7 4a4.8 4.8 0 0 0-4.4 6.8l-6.7 6.7a1.6 1.6 0 1 0 2.3 2.2l6.7-6.7A4.8 4.8 0 0 0 20 7.3l-2.7 2.3-2.1-.3-.3-2L17.2 4a5.3 5.3 0 0 0-1.5 0Z" />
  )),
  xmark: createSvg("0 0 24 24", ({ color, strokeWidth }) => (
    <>
      <path d="M6 6 18 18" stroke={color} strokeWidth={strokeWidth + 0.2} strokeLinecap="round" />
      <path d="M18 6 6 18" stroke={color} strokeWidth={strokeWidth + 0.2} strokeLinecap="round" />
    </>
  ))
} as const;

export type IconSymbolName = keyof typeof icons;

type IconSymbolProps = SvgIconProps & {
  name: IconSymbolName;
} & Omit<SVGProps<SVGSVGElement>, "name" | "color">;

export function IconSymbol({
  name,
  size = 18,
  color = "currentColor",
  className,
  strokeWidth = 1.8
}: IconSymbolProps) {
  const Icon = icons[name];
  return <Icon size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}
