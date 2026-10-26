"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  ChevronDown,
  Lock,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  getScenarios,
  type BackendScenario,
} from "@/services/scenario-service";

import {
  getAuthUser,
  getUserRole,
} from "@/services/auth-state";

import { login } from "@/services/auth-service";

type SortOption =
  | "default"
  | "difficulty"
  | "name";

type Difficulty =
  | "all"
  | BackendScenario["difficulty"];

type Persona =
  | "all"
  | "friendly"
  | "frustrated"
  | "angry";

const difficulties: Array<
  "all" | BackendScenario["difficulty"]
> = [
  "all",
  "beginner",
  "intermediate",
  "advanced",
];

const personas: Persona[] = [
  "all",
  "friendly",
  "frustrated",
  "angry",
];

/*
 * useSearchParams needs a Suspense boundary.
 */
export default function ScenarioBrowserPage() {
  return (
    <Suspense>
      <ScenarioBrowserFromUrl />
    </Suspense>
  );
}

/*
 * ?difficulty=beginner (from the learning
 * path) opens the page filtered to that level.
 */
function ScenarioBrowserFromUrl() {
  const level = useSearchParams().get("difficulty");

  return (
    <ScenarioBrowser
      key={level ?? "all"}
      initialDifficulty={
        isDifficulty(level) ? level : "all"
      }
    />
  );
}

function isDifficulty(
  value: string | null,
): value is BackendScenario["difficulty"] {
  return (
    value === "beginner" ||
    value === "intermediate" ||
    value === "advanced"
  );
}

function ScenarioBrowser({
  initialDifficulty,
}: {
  initialDifficulty: Difficulty;
}) {
  /* =====================================================
     AUTH
  ===================================================== */

  const authUser = getAuthUser();
  const userRole = getUserRole();

  const isPlatformAdmin =
    userRole === "platform_admin";

  /* =====================================================
     SCENARIOS
  ===================================================== */

  const [scenarios, setScenarios] =
    useState<BackendScenario[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =====================================================
     FILTERS
  ===================================================== */

  const [search, setSearch] =
    useState("");

  const [difficulty, setDifficulty] =
    useState<Difficulty>(initialDifficulty);

  const [persona, setPersona] =
    useState<Persona>("all");

  const [sort, setSort] =
    useState<SortOption>("default");

  const [sortOpen, setSortOpen] =
    useState(false);

  /* =====================================================
     TENANT CONTEXT
  ===================================================== */

  const [
    tenantId,
    setTenantId,
  ] = useState("");

  const [
    currentTenantId,
    setCurrentTenantId,
  ] = useState<string | null>(
    authUser?.tenant_id ?? null,
  );

  const [
    tenantModalOpen,
    setTenantModalOpen,
  ] = useState(false);

  const [
    tenantUsername,
    setTenantUsername,
  ] = useState("");

  const [
    tenantPassword,
    setTenantPassword,
  ] = useState("");

  const [
    tenantLoading,
    setTenantLoading,
  ] = useState(false);

  const [
    tenantError,
    setTenantError,
  ] = useState("");

  /* =====================================================
     LOAD SCENARIOS
  ===================================================== */

  const loadScenarios =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getScenarios();

        setScenarios(data);
      } catch (err) {
        setScenarios([]);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load scenarios.",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  /*
   * Delay the initial request one tick.
   *
   * This avoids React's
   * "setState synchronously within an effect"
   * warning while still loading the real
   * backend data when the page opens.
   */
  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        void loadScenarios();
      }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadScenarios]);

  /* =====================================================
     TENANT SWITCH
  ===================================================== */

  async function handleTenantSwitch(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanTenantId =
      tenantId.trim();

    const cleanUsername =
      tenantUsername.trim();

    if (!cleanTenantId) {
      setTenantError(
        "Please enter a Tenant ID.",
      );
      return;
    }

    if (!cleanUsername) {
      setTenantError(
        "Please enter your username.",
      );
      return;
    }

    if (!tenantPassword) {
      setTenantError(
        "Please enter your password.",
      );
      return;
    }

    try {
      setTenantLoading(true);
      setTenantError("");

      /*
       * Reuse the existing login service.
       *
       * login() sends tenant_id as a query
       * parameter and stores the new JWT.
       */
      await login({
        username:
          cleanUsername,

        password:
          tenantPassword,

        tenant_id:
          cleanTenantId,
      });

      /*
       * Never retain the password.
       */
      setTenantPassword("");

      /*
       * Update the displayed tenant.
       */
      setCurrentTenantId(
        cleanTenantId,
      );

      /*
       * Close the modal.
       */
      setTenantModalOpen(false);

      /*
       * Load scenarios using the
       * newly stored tenant-scoped JWT.
       */
      await loadScenarios();
    } catch (err) {
      setTenantError(
        err instanceof Error
          ? err.message
          : "Unable to switch tenant.",
      );
    } finally {
      setTenantLoading(false);
    }
  }

  /* =====================================================
     FILTER + SORT
  ===================================================== */

  const filteredScenarios =
    useMemo(() => {
      let result = [
        ...scenarios,
      ];

      const searchTerm =
        search
          .trim()
          .toLowerCase();

      /* Search */
      if (searchTerm) {
        result =
          result.filter(
            (scenario) =>
              scenario.name
                .toLowerCase()
                .includes(
                  searchTerm,
                ) ||
              scenario.description
                .toLowerCase()
                .includes(
                  searchTerm,
                ) ||
              scenario.persona
                .toLowerCase()
                .includes(
                  searchTerm,
                ) ||
              scenario.difficulty
                .toLowerCase()
                .includes(
                  searchTerm,
                ),
          );
      }

      /* Difficulty */
      if (
        difficulty !==
        "all"
      ) {
        result =
          result.filter(
            (scenario) =>
              scenario.difficulty ===
              difficulty,
          );
      }

      /* Persona */
      if (
        persona !==
        "all"
      ) {
        result =
          result.filter(
            (scenario) =>
              scenario.persona ===
              persona,
          );
      }

      /* Sorting */
      switch (sort) {
        case "difficulty": {
          const order = {
            beginner: 1,
            intermediate: 2,
            advanced: 3,
          };

          result.sort(
            (a, b) =>
              order[a.difficulty] -
              order[b.difficulty],
          );

          break;
        }

        case "name":
          result.sort(
            (a, b) =>
              a.name.localeCompare(
                b.name,
              ),
          );

          break;

        case "default":
        default:
          break;
      }

      return result;
    }, [
      scenarios,
      search,
      difficulty,
      persona,
      sort,
    ]);

  const hasFilters =
    search !== "" ||
    difficulty !== "all" ||
    persona !== "all";

  function clearFilters() {
    setSearch("");
    setDifficulty("all");
    setPersona("all");
    setSort("default");
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="min-h-full bg-[var(--usus-background)]">
      <main className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 xl:px-12">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="mb-8">
          <p className="text-sm font-medium text-[var(--usus-text-muted)]">
            Training
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--usus-text)] sm:text-4xl">
                Scenario Browser
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--usus-text-muted)]">
                Choose a realistic
                customer situation
                and practice the
                skills you want to
                improve.
              </p>
            </div>

            <div className="text-sm text-[var(--usus-text-muted)]">
              <span className="font-semibold text-[var(--usus-text)]">
                {
                  filteredScenarios.length
                }
              </span>{" "}
              scenarios
            </div>
          </div>
        </section>

        {/* =================================================
            TENANT CONTEXT
        ================================================= */}

        {isPlatformAdmin && (
          <section
            className="
              mb-6
              rounded-2xl
              border
              border-[var(--usus-border)]
              bg-[var(--usus-surface)]
              p-4
              shadow-[var(--usus-shadow)]
            "
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium text-[var(--usus-text-muted)]">
                  Tenant context
                </p>

                <p className="mt-1 text-sm font-semibold text-[var(--usus-text)]">
                  {currentTenantId
                    ? currentTenantId
                    : "No tenant selected"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setTenantError("");
                  setTenantUsername("");
                  setTenantPassword("");
                  setTenantModalOpen(
                    true,
                  );
                }}
                className="
                  cursor-pointer
                  rounded-xl
                  bg-[var(--usus-primary)]
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-[#111111]
                  transition-all
                  hover:brightness-95
                  hover:shadow-md
                "
              >
                Change tenant
              </button>
            </div>
          </section>
        )}

        {/* =================================================
            FILTERS
        ================================================= */}

        <section
          className="
            mb-8
            rounded-2xl
            border
            border-[var(--usus-border)]
            bg-[var(--usus-surface)]
            p-4
            shadow-[var(--usus-shadow)]
          "
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

            {/* Search */}
            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className="
                  pointer-events-none
                  absolute
                  left-3.5
                  top-1/2
                  -translate-y-1/2
                  text-[var(--usus-text-muted)]
                "
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search scenarios, personas or difficulty..."
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-[var(--usus-border)]
                  bg-[var(--usus-background)]
                  pl-10
                  pr-4
                  text-sm
                  text-[var(--usus-text)]
                  outline-none
                  transition-all
                  placeholder:text-[var(--usus-text-soft)]
                  focus:border-[var(--usus-primary)]
                  focus:ring-2
                  focus:ring-[var(--usus-primary-soft)]
                "
              />
            </div>

            {/* Difficulty */}
            <div className="relative">
              <select
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(
                    event.target
                      .value as Difficulty,
                  )
                }
                className="
                  h-11
                  min-w-[160px]
                  cursor-pointer
                  appearance-none
                  rounded-xl
                  border
                  border-[var(--usus-border)]
                  bg-[var(--usus-background)]
                  px-4
                  pr-10
                  text-sm
                  text-[var(--usus-text)]
                  outline-none
                  transition-all
                  focus:border-[var(--usus-primary)]
                  focus:ring-2
                  focus:ring-[var(--usus-primary-soft)]
                "
              >
                {difficulties.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item ===
                      "all"
                        ? "All difficulties"
                        : item
                            .charAt(
                              0,
                            )
                            .toUpperCase() +
                          item.slice(
                            1,
                          )}
                    </option>
                  ),
                )}
              </select>

              <ChevronDown
                size={16}
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-[var(--usus-text-muted)]
                "
              />
            </div>

            {/* Persona */}
            <div className="relative">
              <select
                value={persona}
                onChange={(event) =>
                  setPersona(
                    event.target
                      .value as Persona,
                  )
                }
                className="
                  h-11
                  min-w-[160px]
                  cursor-pointer
                  appearance-none
                  rounded-xl
                  border
                  border-[var(--usus-border)]
                  bg-[var(--usus-background)]
                  px-4
                  pr-10
                  text-sm
                  text-[var(--usus-text)]
                  outline-none
                  transition-all
                  focus:border-[var(--usus-primary)]
                  focus:ring-2
                  focus:ring-[var(--usus-primary-soft)]
                "
              >
                {personas.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item ===
                      "all"
                        ? "All personas"
                        : item
                            .charAt(
                              0,
                            )
                            .toUpperCase() +
                          item.slice(
                            1,
                          )}
                    </option>
                  ),
                )}
              </select>

              <ChevronDown
                size={16}
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-[var(--usus-text-muted)]
                "
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setSortOpen(
                    (value) =>
                      !value,
                  )
                }
                className="
                  flex
                  h-11
                  min-w-[150px]
                  cursor-pointer
                  items-center
                  justify-between
                  gap-3
                  rounded-xl
                  border
                  border-[var(--usus-border)]
                  bg-[var(--usus-background)]
                  px-4
                  text-sm
                  text-[var(--usus-text)]
                  transition-all
                  hover:border-[var(--usus-primary)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--usus-primary-soft)]
                "
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal
                    size={16}
                  />

                  {sort ===
                    "default" &&
                    "Default"}

                  {sort ===
                    "difficulty" &&
                    "Difficulty"}

                  {sort === "name" &&
                    "Name"}
                </span>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    sortOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {sortOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-[calc(100%+8px)]
                    z-30
                    w-52
                    overflow-hidden
                    rounded-xl
                    border
                    border-[var(--usus-border)]
                    bg-[var(--usus-surface)]
                    p-1
                    shadow-xl
                  "
                >
                  {[
                    [
                      "default",
                      "Default",
                    ],
                    [
                      "difficulty",
                      "Difficulty",
                    ],
                    [
                      "name",
                      "Name",
                    ],
                  ].map(
                    ([
                      value,
                      label,
                    ]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setSort(
                            value as SortOption,
                          );

                          setSortOpen(
                            false,
                          );
                        }}
                        className="
                          w-full
                          cursor-pointer
                          rounded-lg
                          px-3
                          py-2.5
                          text-left
                          text-sm
                          text-[var(--usus-text)]
                          transition-colors
                          hover:bg-[var(--usus-sidebar-hover)]
                          hover:text-[var(--usus-primary-hover)]
                        "
                      >
                        {label}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Active filters */}
          {hasFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--usus-border)] pt-4">
              {search && (
                <span className="flex items-center gap-1.5 rounded-full bg-[var(--usus-primary-soft)] px-3 py-1.5 text-xs font-medium text-[var(--usus-text)]">
                  Search: {search}

                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    className="cursor-pointer rounded-full hover:text-[var(--usus-primary-hover)]"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}

              {difficulty !==
                "all" && (
                <span className="flex items-center gap-1.5 rounded-full bg-[var(--usus-primary-soft)] px-3 py-1.5 text-xs font-medium capitalize text-[var(--usus-text)]">
                  {difficulty}

                  <button
                    type="button"
                    onClick={() =>
                      setDifficulty(
                        "all",
                      )
                    }
                    className="cursor-pointer rounded-full hover:text-[var(--usus-primary-hover)]"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}

              {persona !==
                "all" && (
                <span className="flex items-center gap-1.5 rounded-full bg-[var(--usus-primary-soft)] px-3 py-1.5 text-xs font-medium capitalize text-[var(--usus-text)]">
                  {persona}

                  <button
                    type="button"
                    onClick={() =>
                      setPersona(
                        "all",
                      )
                    }
                    className="cursor-pointer rounded-full hover:text-[var(--usus-primary-hover)]"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="
                  ml-auto
                  cursor-pointer
                  text-xs
                  font-semibold
                  text-[var(--usus-text-muted)]
                  transition-colors
                  hover:text-[var(--usus-primary-hover)]
                "
              >
                Clear all
              </button>
            </div>
          )}
        </section>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <section className="rounded-2xl border border-[var(--usus-border)] bg-[var(--usus-surface)] px-6 py-16 text-center">
            <p className="text-sm text-[var(--usus-text-muted)]">
              Loading scenarios...
            </p>
          </section>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading &&
          error && (
            <section className="rounded-2xl border border-[var(--usus-border)] bg-[var(--usus-surface)] px-6 py-16 text-center">
              <h2 className="text-lg font-semibold text-[var(--usus-text)]">
                Unable to load
                scenarios
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--usus-text-muted)]">
                {error}
              </p>

              {isPlatformAdmin &&
                error
                  .toLowerCase()
                  .includes(
                    "tenant context required",
                  ) && (
                  <button
                    type="button"
                    onClick={() => {
                      setTenantError(
                        "",
                      );

                      setTenantModalOpen(
                        true,
                      );
                    }}
                    className="
                      mt-5
                      cursor-pointer
                      rounded-xl
                      bg-[var(--usus-primary)]
                      px-5
                      py-2.5
                      text-sm
                      font-semibold
                      text-[#111111]
                      transition-all
                      hover:brightness-95
                      hover:shadow-md
                    "
                  >
                    Enter Tenant ID
                  </button>
                )}
            </section>
          )}

        {/* =================================================
            SCENARIO GRID
        ================================================= */}

        {!loading &&
          !error &&
          filteredScenarios.length >
            0 && (
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredScenarios.map(
                (scenario) => (
                  <ScenarioCard
                    key={
                      scenario.id
                    }
                    scenario={
                      scenario
                    }
                  />
                ),
              )}
            </section>
          )}

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {!loading &&
          !error &&
          filteredScenarios.length ===
            0 && (
            <EmptyState
              hasFilters={
                hasFilters
              }
              onClear={
                clearFilters
              }
            />
          )}
      </main>

      {/* ===================================================
          TENANT SWITCH MODAL
      =================================================== */}

      {tenantModalOpen &&
        isPlatformAdmin && (
          <div
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/40
              px-5
              backdrop-blur-sm
            "
          >
            <div
              className="
                w-full
                max-w-md
                rounded-2xl
                border
                border-[var(--usus-border)]
                bg-[var(--usus-surface)]
                p-6
                shadow-2xl
              "
            >
              {/* Modal header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--usus-text)]">
                    Change tenant
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[var(--usus-text-muted)]">
                    Enter the tenant
                    you want to work
                    with. You will
                    remain logged in.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (
                      !tenantLoading
                    ) {
                      setTenantModalOpen(
                        false,
                      );
                    }
                  }}
                  className="
                    cursor-pointer
                    rounded-lg
                    p-1.5
                    text-[var(--usus-text-muted)]
                    transition-colors
                    hover:bg-[var(--usus-muted)]
                    hover:text-[var(--usus-text)]
                  "
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={
                  handleTenantSwitch
                }
                className="mt-6 space-y-4"
              >
                {/* Tenant ID */}
                <div>
                  <label
                    htmlFor="tenant-id"
                    className="mb-1.5 block text-sm font-medium text-[var(--usus-text)]"
                  >
                    Tenant ID
                  </label>

                  <input
                    id="tenant-id"
                    type="text"
                    value={tenantId}
                    onChange={(
                      event,
                    ) =>
                      setTenantId(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Enter tenant ID"
                    autoComplete="off"
                    disabled={
                      tenantLoading
                    }
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-[var(--usus-border)]
                      bg-[var(--usus-background)]
                      px-4
                      text-sm
                      text-[var(--usus-text)]
                      outline-none
                      transition-all
                      placeholder:text-[var(--usus-text-soft)]
                      focus:border-[var(--usus-primary)]
                      focus:ring-2
                      focus:ring-[var(--usus-primary-soft)]
                    "
                  />
                </div>

                {/* Username */}
                <div>
                  <label
                    htmlFor="tenant-username"
                    className="mb-1.5 block text-sm font-medium text-[var(--usus-text)]"
                  >
                    Username
                  </label>

                  <input
                    id="tenant-username"
                    type="text"
                    value={
                      tenantUsername
                    }
                    onChange={(
                      event,
                    ) =>
                      setTenantUsername(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Enter your username"
                    autoComplete="username"
                    disabled={
                      tenantLoading
                    }
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-[var(--usus-border)]
                      bg-[var(--usus-background)]
                      px-4
                      text-sm
                      text-[var(--usus-text)]
                      outline-none
                      transition-all
                      placeholder:text-[var(--usus-text-soft)]
                      focus:border-[var(--usus-primary)]
                      focus:ring-2
                      focus:ring-[var(--usus-primary-soft)]
                    "
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="tenant-password"
                    className="mb-1.5 block text-sm font-medium text-[var(--usus-text)]"
                  >
                    Password
                  </label>

                  <input
                    id="tenant-password"
                    type="password"
                    value={
                      tenantPassword
                    }
                    onChange={(
                      event,
                    ) =>
                      setTenantPassword(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={
                      tenantLoading
                    }
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-[var(--usus-border)]
                      bg-[var(--usus-background)]
                      px-4
                      text-sm
                      text-[var(--usus-text)]
                      outline-none
                      transition-all
                      placeholder:text-[var(--usus-text-soft)]
                      focus:border-[var(--usus-primary)]
                      focus:ring-2
                      focus:ring-[var(--usus-primary-soft)]
                    "
                  />
                </div>

                {/* Error */}
                {tenantError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {tenantError}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        !tenantLoading
                      ) {
                        setTenantModalOpen(
                          false,
                        );
                      }
                    }}
                    disabled={
                      tenantLoading
                    }
                    className="
                      flex-1
                      cursor-pointer
                      rounded-xl
                      border
                      border-[var(--usus-border)]
                      bg-[var(--usus-background)]
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-[var(--usus-text)]
                      transition-colors
                      hover:bg-[var(--usus-muted)]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      tenantLoading
                    }
                    className="
                      flex-1
                      cursor-pointer
                      rounded-xl
                      bg-[var(--usus-primary)]
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-[#111111]
                      transition-all
                      hover:brightness-95
                      hover:shadow-md
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {tenantLoading
                      ? "Switching..."
                      : "Apply tenant"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}

/* =========================================================
   SCENARIO CARD
========================================================= */

function ScenarioCard({
  scenario,
}: {
  scenario: BackendScenario;
}) {
  return (
    <article
      className="
        group
        flex
        min-h-[300px]
        flex-col
        rounded-2xl
        border
        border-[var(--usus-border)]
        bg-[var(--usus-surface)]
        p-5
        shadow-[var(--usus-shadow)]
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-[var(--usus-primary)]
        hover:shadow-lg
      "
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-medium capitalize text-[var(--usus-text-muted)]">
          Customer scenario
        </span>

        <DifficultyBadge
          difficulty={
            scenario.difficulty
          }
        />
      </div>

      {/* Content */}
      <div className="mt-5">
        <h2 className="text-lg font-semibold text-[var(--usus-text)]">
          {scenario.name}
        </h2>

        <p className="mt-2 text-sm leading-6 text-[var(--usus-text-muted)]">
          {scenario.description}
        </p>
      </div>

      {/* Persona */}
      <div className="mt-5">
        <p className="mb-2 text-xs font-medium text-[var(--usus-text-muted)]">
          Customer persona
        </p>

        <div className="flex flex-wrap gap-1.5">
          <span
            className="
              rounded-full
              bg-[var(--usus-muted)]
              px-2.5
              py-1
              text-[10px]
              font-medium
              capitalize
              text-[var(--usus-text-muted)]
            "
          >
            {scenario.persona}
          </span>
        </div>
      </div>

      {/* Action */}
      <div className="mt-auto pt-6">
        {scenario.locked ? (
          <div>
            <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--usus-muted)] px-4 py-3 text-sm font-semibold text-[var(--usus-text-muted)]">
              <Lock size={15} />
              Locked
            </div>

            {scenario.locked_reason && (
              <p className="mt-2 text-center text-[11px] leading-5 text-[var(--usus-text-muted)]">
                {scenario.locked_reason}
              </p>
            )}
          </div>
        ) : (
        <Link
          href={`/scenarios/${scenario.id}`}
          className="
            flex
            w-full
            cursor-pointer
            items-center
            justify-center
            rounded-xl
            bg-[var(--usus-primary)]
            px-4
            py-3
            text-sm
            font-semibold
            text-[#111111]
            transition-all
            duration-200
            hover:brightness-95
            hover:shadow-md
            focus:outline-none
            focus:ring-2
            focus:ring-[var(--usus-primary)]
            focus:ring-offset-2
          "
        >
          Start scenario →
        </Link>
        )}
      </div>
    </article>
  );
}

/* =========================================================
   DIFFICULTY BADGE
========================================================= */

function DifficultyBadge({
  difficulty,
}: {
  difficulty: BackendScenario["difficulty"];
}) {
  return (
    <span
      className="
        rounded-full
        bg-[var(--usus-muted)]
        px-2.5
        py-1
        text-[10px]
        font-semibold
        capitalize
        text-[var(--usus-text)]
      "
    >
      {difficulty}
    </span>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <section
      className="
        flex
        min-h-[360px]
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-[var(--usus-border)]
        bg-[var(--usus-surface)]
        px-6
        text-center
      "
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--usus-muted)]">
        <Search
          size={20}
          className="text-[var(--usus-text-muted)]"
        />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-[var(--usus-text)]">
        No scenarios found
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--usus-text-muted)]">
        {hasFilters
          ? "Try changing your search or filters to find a scenario."
          : "There are currently no scenarios available."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="
            mt-5
            cursor-pointer
            rounded-xl
            bg-[var(--usus-primary)]
            px-5
            py-2.5
            text-sm
            font-semibold
            text-[#111111]
            transition-all
            hover:brightness-95
            hover:shadow-md
          "
        >
          Clear filters
        </button>
      )}
    </section>
  );
};