import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15.5 13a.5.5 0 0 1-.5-.5V10a4 4 0 0 0-4-4H7" />
      <path d="M10 18a3 3 0 0 1-3-3V9" />
      <path d="M14 20a2 2 0 0 0 2-2 2 2 0 0 0-2-2" />
      <path d="M7.5 13h1" />
    </svg>
  );
}
