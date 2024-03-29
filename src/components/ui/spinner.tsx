import { cn } from "~/lib/utils";

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  color?: "#fff" | "#000";
}

export const LoadingSpinner = ({
  size = 24,
  color = "#000",
  className,
  ...props
}: ISVGProps) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("animate-spin", className)}
    >
      <path
        d="M8 1V.5H7V1h1ZM7 4.5V5h1v-.5H7Zm1 6V10H7v.5h1ZM7 14v.5h1V14H7ZM4.5 7.995H5v-1h-.5v1Zm-3.5-1H.5v1H1v-1ZM14 8h.5V7H14v1Zm-3.5-1.005H10v1h.5v-1ZM7 1v3.5h1V1H7Zm0 9.5V14h1v-3.5H7ZM4.5 6.995H1v1h3.5v-1ZM14 7l-3.5-.005v1L14 8V7ZM2.147 2.854l3 3 .708-.708-3-3-.708.708Zm10-.708-3 3 .708.708 3-3-.708-.708ZM2.854 12.854l3-3-.708-.708-3 3 .708.708Zm6.292-3 3 3 .708-.708-3-3-.708.708Z"
        fill={color}
      />
    </svg>
  );
};
