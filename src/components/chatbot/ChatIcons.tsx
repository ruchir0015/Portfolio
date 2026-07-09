import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function ChatSparkIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      {/* Outer compass ring */}
      <circle cx="12" cy="12" r="9.5" strokeWidth="1.5" />
      {/* Cardinal tick marks */}
      <line x1="12" y1="2.5" x2="12" y2="4.5" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="19.5" x2="12" y2="21.5" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2.5" y1="12" x2="4.5" y2="12" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19.5" y1="12" x2="21.5" y2="12" strokeWidth="1.5" strokeLinecap="round" />
      {/* Compass needle — north tip (filled triangle) */}
      <polygon
        points="12,4.5 9.5,13.5 12,12 14.5,13.5"
        strokeWidth="1.2"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.9"
      />
      {/* Compass needle — south tip (hollow triangle) */}
      <polygon
        points="12,19.5 9.5,13.5 12,12 14.5,13.5"
        strokeWidth="1.2"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.25"
      />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="m6 6 12 12M18 6 6 18" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M3 11.5 20 4l-4.8 16-2.8-6.4L3 11.5Z"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="m12.3 13.6 7.7-9.6" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function MicrophoneIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="9" y="3" width="6" height="11" rx="3" strokeWidth="1.5" />
      <path d="M6.5 10.5a5.5 5.5 0 1 0 11 0M12 17v4M9 21h6" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SpeakerOnIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M5 14h3.4L13 18V6L8.4 10H5v4Z"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M16 9.5a4 4 0 0 1 0 5M18.8 7a7.5 7.5 0 0 1 0 10" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SpeakerOffIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M5 14h3.4L13 18V6L8.4 10H5v4Z"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="m17.5 8.5 4 4m0-4-4 4" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
