import Image from "next/image";

interface UsusLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Map sizes directly to Tailwind classes instead of raw pixels
const sizeClasses = {
  sm: "w-[70px] h-[20px]",
  md: "w-[180px] h-[130px]",
  lg: "w-[150px] h-[135px]",
};

export function UsusLogo({ size = "md", className }: UsusLogoProps) {
  return (
    <div className={className}>
      {/* Light theme */}
      <Image
        src="/brand/logos/Usus-black.svg"
        alt="USUS"
        // Pass base numbers for Next.js layout reservation
        width={100}
        height={35}
        // Use Tailwind to strictly enforce the sizes and preserve aspect ratio
        className={`usus-logo-light object-contain ${sizeClasses[size]}`}
      />

      {/* Dark theme */}
      <Image
        src="/brand/logos/Usus-white.svg"
        alt="USUS"
        width={100}
        height={35}
        className={`usus-logo-dark object-contain ${sizeClasses[size]}`}
      />
    </div>
  );
}
