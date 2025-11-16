import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
        <path d="M9.5 2c-1.8 0-3.5 1-4.5 2.5C3.2 7.2 4.3 11 8 11c2.5 0 4.2-1 5.5-2.5" />
        <path d="M14.5 2c1.8 0 3.5 1 4.5 2.5c1.8 2.7 1 6.5-1.5 6.5c-2.5 0-4.2-1-5.5-2.5" />
        <path d="M8 11v2.5c0 1.4.9 2.5 2 2.5h0c1.1 0 2-.9 2-2V11" />
        <path d="M12 11h0" />
        <path d="M12 22v-3" />
        <path d="M10 22h4" />
        <path d="M12 16.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" />
    </svg>
  );
}