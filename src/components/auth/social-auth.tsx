import { Button } from "@/components/ui";

export function SocialAuth() {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        className="h-10 flex-1 rounded-full text-[11px]"
      >
        <span className="mr-2 font-bold text-[#4285F4]">G</span>
        Sign up with Google
      </Button>

      <Button
        type="button"
        variant="secondary"
        className="h-10 flex-1 rounded-full text-[11px]"
      >
        Single Sign On (SSO)
      </Button>
    </div>
  );
}
