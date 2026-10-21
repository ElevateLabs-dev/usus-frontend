"use client";

import Link from "next/link";
import { LogOut, Menu, User } from "lucide-react";
import { useRouter } from "next/navigation";

import { UsusLogo } from "@/components/brand/usus-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { NotificationBell } from "@/components/notifications/notification-bell";

import {
  logout,
} from "@/services/auth-service";

import {
  useAuthUser,
} from "@/hooks/use-auth-user";


interface TraineeHeaderProps {
  onMenuClick?: () => void;
}


export function TraineeHeader({
  onMenuClick,
}: TraineeHeaderProps) {
  const router = useRouter();

  /*
   * Get the currently authenticated user.
   *
   * This comes from the JWT stored by auth-service.
   */
  const user = useAuthUser();



  /*
   * User display information.
   *
   * We do not use a fake "John" fallback.
   */
  const displayEmail =
    user?.email ?? "Loading...";

  const displayRole =
    user?.role === "trainee"
      ? "Trainee"
      : user?.role === "company_admin"
        ? "Company Admin"
        : user?.role === "platform_admin"
          ? "Platform Admin"
          : user?.role === "manager"
            ? "Manager"
            : "User";

  const initials =
    user?.email
      ? user.email
          .trim()
          .charAt(0)
          .toUpperCase()
      : "U";


  /*
   * Logout.
   *
   * IMPORTANT:
   * logout() only removes the authentication
   * token. It does NOT delete training data.
   */
  function handleLogout() {
    logout();

    router.replace("/login");
  }


  return (
    <>
      <header
        className="
          fixed
          inset-x-0
          top-0
          z-50
          h-[72px]
          border-b
          border-[var(--usus-border)]
          bg-[var(--usus-header)]
          transition-colors
          duration-200
          md:h-[90px]
        "
      >
        <div
          className="
            flex
            h-full
            items-center
            justify-between
            px-3
            sm:px-6
            lg:px-8
          "
        >

          {/* =====================================================
              LOGO
          ====================================================== */}

          <div className="flex items-center">
            <UsusLogo size="lg" />
          </div>


          {/* =====================================================
              RIGHT CONTROLS
          ====================================================== */}

          <div
            className="
              flex
              items-center
              gap-2
              sm:gap-5
            "
          >

            <NotificationBell />

            {/* ===================================================
                THEME TOGGLE
            ==================================================== */}

            <div className="hidden md:block">
              <ThemeToggle />
            </div>


            {/* ===================================================
                MOBILE MENU
            ==================================================== */}

            <button
              type="button"
              onClick={onMenuClick}
              aria-label="Open navigation menu"
              className="
                flex
                h-10
                w-10
                cursor-pointer
                items-center
                justify-center
                rounded-xl
                text-[var(--usus-text-muted)]
                transition-colors
                duration-200
                hover:bg-[var(--usus-sidebar-hover)]
                hover:text-[var(--usus-text)]
                focus:outline-none
                focus:ring-2
                focus:ring-[var(--usus-primary)]
                md:hidden
              "
            >
              <Menu
                size={22}
                strokeWidth={1.9}
              />
            </button>


            {/* ===================================================
                USER MENU
            ==================================================== */}

            <div className="group relative">

              {/* User/profile button */}

              <button
                type="button"
                aria-label="Open user menu"
                className="
                  flex
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  px-1
                  py-1
                  transition-all
                  duration-200
                  hover:bg-[var(--usus-sidebar-hover)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--usus-primary)]
                  md:px-3
                "
              >

                {/* Avatar */}

                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-full
                    bg-[var(--usus-primary)]
                    text-sm
                    font-bold
                    text-black
                    transition-all
                    duration-200
                    md:group-hover:ring-2
                    md:group-hover:ring-[var(--usus-primary)]
                  "
                >
                  {initials}
                </div>


                {/* Email */}

                <p
                  className="
                    mt-1
                    hidden
                    max-w-[190px]
                    truncate
                    text-center
                    text-xs
                    font-semibold
                    leading-tight
                    text-[var(--usus-text)]
                    md:block
                  "
                >
                  {displayEmail}
                </p>


                {/* Role */}

                <p
                  className="
                    hidden
                    text-center
                    text-[10px]
                    font-normal
                    leading-tight
                    text-[var(--usus-text-muted)]
                    md:block
                  "
                >
                  {displayRole}
                </p>

              </button>


              {/* =================================================
                  DROPDOWN
              ================================================== */}

              <div
                className="
                  invisible
                  absolute
                  right-0
                  top-full
                  mt-2
                  w-60
                  translate-y-1
                  rounded-xl
                  border
                  border-[var(--usus-border)]
                  bg-[var(--usus-surface)]
                  p-2
                  opacity-0
                  shadow-[var(--usus-shadow)]
                  transition-all
                  duration-150
                  group-hover:visible
                  group-hover:translate-y-0
                  group-hover:opacity-100
                  group-focus-within:visible
                  group-focus-within:translate-y-0
                  group-focus-within:opacity-100
                "
              >

                {/* Account information */}

                <div
                  className="
                    border-b
                    border-[var(--usus-border-soft)]
                    px-3
                    py-3
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[var(--usus-primary)]
                        text-xs
                        font-bold
                        text-black
                      "
                    >
                      {initials}
                    </div>


                    <div
                      className="
                        min-w-0
                      "
                    >

                      <p
                        className="
                          truncate
                          text-sm
                          font-semibold
                          text-[var(--usus-text)]
                        "
                      >
                        {displayEmail}
                      </p>


                      <p
                        className="
                          mt-0.5
                          text-xs
                          text-[var(--usus-text-muted)]
                        "
                      >
                        {displayRole}
                      </p>

                    </div>

                  </div>

                </div>


                {/* Profile */}

                <Link
                  href="/profile"
                  className="
                    mt-1
                    flex
                    w-full
                    items-center
                    gap-2
                    rounded-lg
                    px-3
                    py-2.5
                    text-sm
                    text-[var(--usus-text-muted)]
                    transition
                    hover:bg-[var(--usus-sidebar-hover)]
                    hover:text-[var(--usus-text)]
                  "
                >
                  <User
                    size={16}
                  />

                  Profile
                </Link>


                {/* Logout */}

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-2
                    rounded-lg
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    text-[var(--usus-danger)]
                    transition
                    hover:bg-[var(--usus-sidebar-hover)]
                  "
                >
                  <LogOut
                    size={16}
                  />

                  Logout
                </button>

              </div>

            </div>

          </div>

        </div>
      </header>


    </>
  );
}