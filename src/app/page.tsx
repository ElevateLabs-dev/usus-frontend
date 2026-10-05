import Link from "next/link";

import { ThemeToggle } from "@/components/theme/theme-toggle";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  ProgressBar,
  ProgressRing,
} from "@/components/ui";


export default function LandingPage() {
  return (
    <main
      className="
        min-h-screen
        bg-[var(--usus-background)]
        text-[var(--usus-text)]
        transition-colors
        duration-200
      "
    >

      {/* =====================================================
          TOP NAVIGATION
      ====================================================== */}

      <header
        className="
          sticky
          top-0
          z-40
          border-b
          border-[var(--usus-border)]
          bg-[var(--usus-header)]
          transition-colors
          duration-200
        "
      >
        <div
          className="
            mx-auto
            flex
            h-16
            w-full
            max-w-7xl
            items-center
            justify-between
            px-4
            sm:px-6
            lg:px-8
          "
        >

          {/* Brand */}

          <div className="flex items-center">
            <span
              className="
                text-lg
                font-bold
                tracking-[-0.03em]
                text-[var(--usus-text)]
              "
            >
              USUS
            </span>
          </div>


          {/* Navigation actions */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            {/* Theme */}

            <ThemeToggle />


            {/* Login */}

            <Link
              href="/login"
              className="
                inline-flex
                h-9
                items-center
                justify-center
                rounded-xl
                bg-[var(--usus-primary)]
                px-4
                text-sm
                font-semibold
                text-black
                transition-all
                duration-200
                hover:bg-[var(--usus-primary-hover)]
                focus:outline-none
                focus:ring-2
                focus:ring-[var(--usus-primary)]
                focus:ring-offset-2
                focus:ring-offset-[var(--usus-background)]
              "
            >
              Log in
            </Link>

          </div>

        </div>
      </header>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className="
          min-h-[calc(100vh-64px)]
          px-4
          py-8
          sm:px-6
          lg:px-8
        "
      >

        <div
          className="
            mx-auto
            w-full
            max-w-4xl
            space-y-8
          "
        >

          {/* =================================================
              PAGE INTRO
          ================================================== */}

          <section>

            <p
              className="
                mb-2
                text-xs
                font-medium
                uppercase
                tracking-[0.12em]
                text-[var(--usus-text-muted)]
              "
            >
              USUS Platform
            </p>


            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                text-[var(--usus-text)]
                sm:text-4xl
              "
            >
              USUS UI System
            </h1>


            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-[var(--usus-text-muted)]
              "
            >
              Shared components foundation.
            </p>

          </section>


          {/* =================================================
              COMPONENTS CARD
          ================================================== */}

          <Card>

            <CardHeader>
              <h2
                className="
                  font-semibold
                  text-[var(--usus-text)]
                "
              >
                Components
              </h2>
            </CardHeader>


            <CardContent
              className="
                space-y-6
              "
            >

              {/* Buttons */}

              <div>

                <p
                  className="
                    mb-3
                    text-sm
                    font-medium
                    text-[var(--usus-text)]
                  "
                >
                  Buttons
                </p>


                <div
                  className="
                    flex
                    flex-wrap
                    gap-3
                  "
                >

                  <Button>
                    Primary
                  </Button>


                  <Button variant="secondary">
                    Secondary
                  </Button>


                  <Button variant="outline">
                    Outline
                  </Button>


                  <Button variant="ghost">
                    Ghost
                  </Button>


                  <Button variant="danger">
                    Danger
                  </Button>

                </div>

              </div>


              {/* Badges */}

              <div>

                <p
                  className="
                    mb-3
                    text-sm
                    font-medium
                    text-[var(--usus-text)]
                  "
                >
                  Status badges
                </p>


                <div
                  className="
                    flex
                    flex-wrap
                    gap-3
                  "
                >

                  <Badge>
                    Default
                  </Badge>


                  <Badge variant="success">
                    Completed
                  </Badge>


                  <Badge variant="warning">
                    In Progress
                  </Badge>


                  <Badge variant="danger">
                    Failed
                  </Badge>


                  <Badge variant="info">
                    New
                  </Badge>

                </div>

              </div>


              {/* Input */}

              <div>

                <p
                  className="
                    mb-3
                    text-sm
                    font-medium
                    text-[var(--usus-text)]
                  "
                >
                  Input
                </p>


                <Input
                  placeholder="Search scenarios..."
                />

              </div>


              {/* Progress bar */}

              <div>

                <p
                  className="
                    mb-2
                    text-sm
                    font-medium
                    text-[var(--usus-text)]
                  "
                >
                  Training progress
                </p>


                <ProgressBar
                  value={72}
                />

              </div>


              {/* Progress ring */}

              <div>

                <p
                  className="
                    mb-3
                    text-sm
                    font-medium
                    text-[var(--usus-text)]
                  "
                >
                  Completion
                </p>


                <ProgressRing
                  value={78}
                />

              </div>

            </CardContent>

          </Card>


          {/* =================================================
              LOGIN CTA
          ================================================== */}

          <section
            className="
              flex
              flex-col
              items-start
              justify-between
              gap-5
              rounded-[var(--usus-radius)]
              border
              border-[var(--usus-border)]
              bg-[var(--usus-surface)]
              p-6
              shadow-[var(--usus-shadow)]
              sm:flex-row
              sm:items-center
            "
          >

            <div>

              <h2
                className="
                  text-lg
                  font-semibold
                  text-[var(--usus-text)]
                "
              >
                Ready to continue?
              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  text-[var(--usus-text-muted)]
                "
              >
                Sign in to access your
                USUS training dashboard.
              </p>

            </div>


            <Link
              href="/login"
              className="
                inline-flex
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[var(--usus-primary)]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-black
                transition-all
                duration-200
                hover:bg-[var(--usus-primary-hover)]
                focus:outline-none
                focus:ring-2
                focus:ring-[var(--usus-primary)]
                focus:ring-offset-2
                focus:ring-offset-[var(--usus-surface)]
              "
            >
              Log in
            </Link>

          </section>

        </div>

      </div>

    </main>
  );
};