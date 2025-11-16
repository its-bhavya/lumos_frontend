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
      <path d="M12 2a7 7 0 1 0 10 10" />
      <path d="M12 2v10" />
      <path d="m16.2 7.8 1.4-1.4" />
      <path d="m20 12-2-2" />
    </svg>
  );
}
