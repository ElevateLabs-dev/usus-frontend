"use client";

import Link from "next/link";

import {
  ArrowLeft,
  Camera,
  Mail,
  User,
  LogOut,
} from "lucide-react";

import { useRouter } from "next/navigation";

import {
  logout,
} from "@/services/auth-service";

import {
  useAuthUser,
} from "@/hooks/use-auth-user";


export default function ProfilePage() {

  const router =
    useRouter();

  const user =
    useAuthUser();


  function handleLogout() {
    logout();

    router.replace(
      "/login",
    );
  }


  if (!user) {
    return (
      <main
        className="
          min-h-screen
          bg-[var(--usus-background)]
          px-6 py-8
          text-[var(--usus-text)]
        "
      >
        <div
          className="
            mx-auto
            max-w-4xl
          "
        >
          <p
            className="
              text-sm
              text-[var(--usus-text-muted)]
            "
          >
            Loading profile...
          </p>
        </div>
      </main>
    );
  }


  const initials =
    user.email
      .charAt(0)
      .toUpperCase();


  const displayRole =
    user.role
      .replace(
        /_/g,
        " ",
      )
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase(),
      );


  return (
    <main
      className="
        min-h-screen
        bg-[var(--usus-background)]
        px-6 py-8
        text-[var(--usus-text)]
      "
    >

      <div
        className="
          mx-auto
          max-w-4xl
        "
      >

        {/* Header */}

        <div
          className="
            mb-8
            flex items-center
            gap-4
          "
        >

          <Link
            href="/dashboard"
            aria-label="Back to dashboard"
            className="
              flex h-9 w-9
              items-center
              justify-center
              rounded-full
              text-[var(--usus-text-muted)]
              transition
              hover:bg-[var(--usus-sidebar-hover)]
              hover:text-[var(--usus-text)]
            "
          >
            <ArrowLeft
              size={18}
            />
          </Link>


          <div>

            <h1
              className="
                text-2xl
                font-bold
              "
            >
              Profile
            </h1>


            <p
              className="
                mt-1
                text-sm
                text-[var(--usus-text-muted)]
              "
            >
              Manage your
              USUS profile.
            </p>

          </div>

        </div>


        {/* Profile card */}

        <section
          className="
            rounded-[var(--usus-radius)]
            border
            border-[var(--usus-border)]
            bg-[var(--usus-surface)]
            p-6
            shadow-[var(--usus-shadow)]
          "
        >

          {/* Avatar */}

          <div
            className="
              flex flex-col
              items-center
              border-b
              border-[var(--usus-border-soft)]
              pb-7
            "
          >

            <div
              className="
                relative
                flex h-24 w-24
                items-center
                justify-center
                rounded-full
                bg-[var(--usus-primary)]
                text-3xl
                font-bold
                text-black
              "
            >

              {initials}


              <button
                type="button"
                aria-label="Change profile photo"
                className="
                  absolute
                  bottom-0
                  right-0
                  flex h-8 w-8
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  border-[var(--usus-surface)]
                  bg-[var(--usus-text)]
                  text-[var(--usus-surface)]
                  transition
                  hover:bg-[var(--usus-primary)]
                  hover:text-black
                "
              >
                <Camera
                  size={14}
                />
              </button>

            </div>


            <h2
              className="
                mt-4
                max-w-full
                truncate
                text-center
                text-xl
                font-bold
              "
            >
              {user.email}
            </h2>


            <span
              className="
                mt-1
                rounded-full
                bg-[var(--usus-primary-soft)]
                px-3 py-1
                text-xs
                font-medium
              "
            >
              {displayRole}
            </span>

          </div>


          {/* Information */}

          <div
            className="
              mt-7
              space-y-5
            "
          >

            {/* Email */}

            <div
              className="
                flex items-center
                gap-4
              "
            >

              <div
                className="
                  flex h-10 w-10
                  items-center
                  justify-center
                  rounded-lg
                  bg-[var(--usus-surface-soft)]
                "
              >
                <Mail
                  size={17}
                />
              </div>


              <div
                className="
                  min-w-0
                "
              >

                <p
                  className="
                    text-xs
                    text-[var(--usus-text-muted)]
                  "
                >
                  Email
                </p>


                <p
                  className="
                    mt-1
                    truncate
                    font-medium
                    text-[var(--usus-text)]
                  "
                >
                  {user.email}
                </p>

              </div>

            </div>


            {/* Role */}

            <div
              className="
                flex items-center
                gap-4
              "
            >

              <div
                className="
                  flex h-10 w-10
                  items-center
                  justify-center
                  rounded-lg
                  bg-[var(--usus-surface-soft)]
                "
              >
                <User
                  size={17}
                />
              </div>


              <div>

                <p
                  className="
                    text-xs
                    text-[var(--usus-text-muted)]
                  "
                >
                  Role
                </p>


                <p
                  className="
                    mt-1
                    font-medium
                    text-[var(--usus-text)]
                  "
                >
                  {displayRole}
                </p>

              </div>

            </div>

          </div>


          {/* Logout */}

          <div
            className="
              mt-8
              border-t
              border-[var(--usus-border-soft)]
              pt-6
            "
          >

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="
                flex w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[var(--usus-border)]
                px-4 py-3
                text-sm
                font-medium
                text-[var(--usus-danger)]
                transition
                hover:bg-[var(--usus-sidebar-hover)]
              "
            >

              <LogOut
                size={17}
              />

              Logout

            </button>

          </div>

        </section>

      </div>

    </main>
  );
};