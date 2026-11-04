import Image from "next/image";

interface UsusLogoProps {
  className?: string;
}

export function UsusLogo({ className = "" }: UsusLogoProps) {
  return (
    <div
      className={`relative flex w-[95px] shrink-0 items-center sm:w-[100px] md:w-[110px] lg:w-[130px] ${className}`}
    >
      <Image
        src="/brand/logos/Usus-black.svg"
        alt="USUS"
        width={160}
        height={56}
        priority
        className="usus-logo-light h-auto w-full object-contain"
      />

      <Image
        src="/brand/logos/Usus-white.svg"
        alt="USUS"
        width={160}
        height={56}
        priority
        className="usus-logo-dark h-auto w-full object-contain"
      />
    </div>
  );
}