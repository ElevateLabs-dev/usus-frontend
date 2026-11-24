"use client";

import { useState } from "react";

type Plan = {
  name: string;
  price: number;
  description: string;
  features: string[];
};

type Invoice = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "Paid" | "Pending" | "Failed";
};

const plans: Plan[] = [
  {
    name: "Starter",
    price: 49,
    description: "For small teams getting started with AI training.",
    features: [
      "Up to 25 trainees",
      "Basic AI scenarios",
      "Knowledge base access",
      "Standard support",
    ],
  },
  {
    name: "Professional",
    price: 99,
    description: "For growing organisations that need more flexibility.",
    features: [
      "Up to 100 trainees",
      "Advanced AI scenarios",
      "Expanded knowledge base",
      "Team performance analytics",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: 0,
    description: "For larger organisations with specific requirements.",
    features: [
      "Custom trainee limits",
      "Advanced AI capabilities",
      "Custom integrations",
      "Dedicated support",
      "Flexible billing",
    ],
  },
];

const initialInvoices: Invoice[] = [
  {
    id: "INV-2026-001",
    date: "23 Nov 2026",
    description: "Professional subscription",
    amount: 99,
    status: "Paid",
  },
  {
    id: "INV-2026-002",
    date: "23 Oct 2026",
    description: "Professional subscription",
    amount: 99,
    status: "Paid",
  },
  {
    id: "INV-2026-003",
    date: "23 Sep 2026",
    description: "Professional subscription",
    amount: 99,
    status: "Paid",
  },
];

function Icon({
  name,
  size = 18,
}: {
  name: string;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "card":
      return (
        <svg {...common}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20M6 15h3" />
        </svg>
      );

    case "download":
      return (
        <svg {...common}>
          <path d="M12 3v12m-5-5 5 5 5-5" />
          <path d="M5 17v4h14v-4" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m18 6-12 12M6 6l12 12" />
        </svg>
      );

    case "receipt":
      return (
        <svg {...common}>
          <path d="M4 3v18l4-2 4 2 4-2 4 2V3l-4 2-4-2-4 2z" />
          <path d="M8 9h8M8 13h8" />
        </svg>
      );

    case "shield":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );

    default:
      return null;
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState("Professional");
  const [billingCycle, setBillingCycle] = useState<
    "Monthly" | "Yearly"
  >("Monthly");

  const [activeModal, setActiveModal] = useState<
    "plans" | "cancel" | "payment" | null
  >(null);

  const [selectedPlan, setSelectedPlan] = useState("Professional");
  const [paymentNotice, setPaymentNotice] = useState("");

  const [invoices] = useState(initialInvoices);

  const [cancelled, setCancelled] = useState(false);

  const currentPlanDetails = plans.find(
    (plan) => plan.name === currentPlan,
  );

  const currentPrice =
    currentPlanDetails?.price ?? 0;

  const renewalDate = "23 December 2026";

  function closeModal() {
    setActiveModal(null);
    setPaymentNotice("");
  }

  function handlePlanChange() {
    if (selectedPlan === "Enterprise") {
      setPaymentNotice(
        "Please contact our sales team to discuss Enterprise pricing.",
      );
      return;
    }

    setCurrentPlan(selectedPlan);
    setActiveModal(null);
    setPaymentNotice("");
  }

  function handleCancellation() {
    setCancelled(true);
    setActiveModal(null);
  }

  return (
    <main className="w-full min-w-0 space-y-7">

      {/* PAGE HEADER */}

      <div>
        <p className="text-xs font-medium text-[var(--usus-primary)]">
          Organisation Settings
        </p>

        <h1 className="mt-2 text-2xl font-semibold text-[var(--usus-text)]">
          Billing & Subscription
        </h1>

        <p className="mt-2 text-sm text-[var(--usus-text-muted)]">
          Manage your subscription, payment methods and billing history.
        </p>
      </div>

      {/* BILLING OVERVIEW */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <OverviewCard
          label="Current plan"
          value={currentPlan}
          detail="Subscription plan"
        />

        <OverviewCard
          label="Monthly cost"
          value={
            currentPrice === 0
              ? "Custom"
              : formatCurrency(
                  billingCycle === "Yearly"
                    ? currentPrice * 0.8
                    : currentPrice,
                )
          }
          detail={
            billingCycle === "Yearly"
              ? "Per month, billed annually"
              : "Per month"
          }
        />

        <OverviewCard
          label="Team members"
          value="8 / 100"
          detail="Available seats"
        />

        <OverviewCard
          label="Next renewal"
          value="23 Dec"
          detail="23 December 2026"
        />

      </section>

      {/* MAIN BILLING LAYOUT */}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">

        {/* LEFT CONTENT */}

        <div className="min-w-0 space-y-6">

          {/* CURRENT PLAN */}

          <section className="border border-[var(--usus-border)] bg-[var(--usus-surface)]">

            <div className="flex flex-col justify-between gap-4 border-b border-[var(--usus-border)] p-5 sm:flex-row sm:items-center">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--usus-text-muted)]">
                  Current subscription
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[var(--usus-text)]">
                  {currentPlan}
                </h2>

                <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
                  {currentPlanDetails?.description}
                </p>
              </div>

              <span className={`w-fit px-3 py-1.5 text-xs font-medium ${
                cancelled
                  ? "bg-[var(--usus-surface-soft)] text-[var(--usus-danger)]"
                  : "bg-[var(--usus-primary-soft)] text-[var(--usus-primary)]"
              }`}>
                {cancelled ? "Cancellation requested" : "Active"}
              </span>

            </div>

            <div className="grid gap-6 p-5 sm:grid-cols-2">

              <div>
                <p className="text-xs text-[var(--usus-text-muted)]">
                  Subscription price
                </p>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-[var(--usus-text)]">
                    {currentPrice === 0
                      ? "Custom"
                      : formatCurrency(
                          billingCycle === "Yearly"
                            ? currentPrice * 0.8
                            : currentPrice,
                        )}
                  </span>

                  {currentPrice !== 0 && (
                    <span className="text-sm text-[var(--usus-text-muted)]">
                      / month
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs text-[var(--usus-text-muted)]">
                  {billingCycle} billing
                </p>
              </div>

              <div>
                <p className="text-xs text-[var(--usus-text-muted)]">
                  Next billing date
                </p>

                <p className="mt-3 text-lg font-semibold text-[var(--usus-text)]">
                  {renewalDate}
                </p>

                <p className="mt-2 text-xs text-[var(--usus-text-muted)]">
                  Your subscription renews automatically.
                </p>
              </div>

            </div>

            <div className="flex flex-wrap gap-3 border-t border-[var(--usus-border)] p-5">

              <button
                type="button"
                onClick={() => {
                  setSelectedPlan(currentPlan);
                  setActiveModal("plans");
                }}
                className="bg-[var(--usus-primary)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--usus-primary-hover)]"
              >
                Update plan
              </button>

              <button
                type="button"
                onClick={() => setActiveModal("cancel")}
                disabled={cancelled}
                className="border border-[var(--usus-border)] px-5 py-2.5 text-sm text-[var(--usus-text)] transition-colors hover:bg-[var(--usus-surface-soft)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel plan
              </button>

            </div>

          </section>

          {/* PAYMENT METHOD */}

          <section className="border border-[var(--usus-border)] bg-[var(--usus-surface)]">

            <div className="flex flex-col justify-between gap-3 border-b border-[var(--usus-border)] p-5 sm:flex-row sm:items-center">

              <div>
                <h2 className="font-semibold text-[var(--usus-text)]">
                  Payment method
                </h2>

                <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
                  Manage the payment method used for your subscription.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal("payment")}
                className="inline-flex items-center gap-2 border border-[var(--usus-border)] px-4 py-2 text-sm text-[var(--usus-text)] hover:bg-[var(--usus-surface-soft)]"
              >
                <Icon name="plus" size={15} />
                Add payment method
              </button>

            </div>

            <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-16 items-center justify-center border border-[var(--usus-border)] bg-[var(--usus-surface-soft)]">
                  <Icon name="card" size={25} />
                </div>

                <div>
                  <p className="text-sm font-medium text-[var(--usus-text)]">
                    Visa ending in 4242
                  </p>

                  <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
                    Expires 02/2028
                  </p>

                  <span className="mt-2 inline-block bg-[var(--usus-primary-soft)] px-2 py-1 text-[10px] font-medium text-[var(--usus-primary)]">
                    Default
                  </span>
                </div>

              </div>

              <button
                type="button"
                onClick={() => setActiveModal("payment")}
                className="text-left text-sm font-medium text-[var(--usus-primary)] hover:underline sm:text-right"
              >
                Manage payment methods
              </button>

            </div>

            <div className="flex items-center gap-2 border-t border-[var(--usus-border)] px-5 py-3 text-xs text-[var(--usus-text-muted)]">
              <Icon name="shield" size={15} />
              Payment information is handled securely by our payment provider.
            </div>

          </section>

          {/* BILLING HISTORY */}

          <section className="border border-[var(--usus-border)] bg-[var(--usus-surface)]">

            <div className="border-b border-[var(--usus-border)] p-5">
              <h2 className="font-semibold text-[var(--usus-text)]">
                Billing history
              </h2>

              <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
                View your previous invoices and payments.
              </p>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[600px] text-left">

                <thead className="bg-[var(--usus-surface-soft)]">
                  <tr>
                    <th className="px-5 py-3 text-xs font-medium text-[var(--usus-text-muted)]">
                      Invoice
                    </th>

                    <th className="px-5 py-3 text-xs font-medium text-[var(--usus-text-muted)]">
                      Date
                    </th>

                    <th className="px-5 py-3 text-xs font-medium text-[var(--usus-text-muted)]">
                      Description
                    </th>

                    <th className="px-5 py-3 text-xs font-medium text-[var(--usus-text-muted)]">
                      Amount
                    </th>

                    <th className="px-5 py-3 text-xs font-medium text-[var(--usus-text-muted)]">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-medium text-[var(--usus-text-muted)]">
                      Invoice
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--usus-border-soft)]">

                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-[var(--usus-surface-soft)]">

                      <td className="px-5 py-4 text-xs font-medium text-[var(--usus-text)]">
                        {invoice.id}
                      </td>

                      <td className="px-5 py-4 text-xs text-[var(--usus-text-muted)]">
                        {invoice.date}
                      </td>

                      <td className="px-5 py-4 text-xs text-[var(--usus-text-muted)]">
                        {invoice.description}
                      </td>

                      <td className="px-5 py-4 text-xs font-medium text-[var(--usus-text)]">
                        {formatCurrency(invoice.amount)}
                      </td>

                      <td className="px-5 py-4">
                        <InvoiceStatus status={invoice.status} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          title="Invoice download will be enabled after backend integration"
                          className="inline-flex items-center gap-1 text-xs text-[var(--usus-primary)] hover:underline"
                        >
                          <Icon name="download" size={14} />
                          Download
                        </button>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

            <div className="border-t border-[var(--usus-border)] px-5 py-4 text-xs text-[var(--usus-text-muted)]">
              Showing {invoices.length} recent invoices.
            </div>

          </section>

        </div>

        {/* RIGHT SIDEBAR */}

        <aside className="space-y-5">

          {/* BILLING SUMMARY */}

          <section className="border border-[var(--usus-border)] bg-[var(--usus-surface)] p-5">

            <h3 className="font-semibold text-[var(--usus-text)]">
              Billing summary
            </h3>

            <div className="mt-5 space-y-4">

              <SummaryRow
                label="Current plan"
                value={currentPlan}
              />

              <SummaryRow
                label="Billing cycle"
                value={billingCycle}
              />

              <SummaryRow
                label="Team members"
                value="8 members"
              />

              <SummaryRow
                label="Available seats"
                value="92 seats"
              />

              <div className="border-t border-[var(--usus-border)] pt-4">

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--usus-text-muted)]">
                    Estimated monthly total
                  </span>

                  <span className="font-semibold text-[var(--usus-text)]">
                    {currentPrice === 0
                      ? "Custom"
                      : formatCurrency(
                          billingCycle === "Yearly"
                            ? currentPrice * 0.8
                            : currentPrice,
                        )}
                  </span>
                </div>

              </div>

            </div>

          </section>

          {/* BILLING CYCLE */}

          <section className="border border-[var(--usus-border)] bg-[var(--usus-surface)] p-5">

            <h3 className="font-semibold text-[var(--usus-text)]">
              Billing cycle
            </h3>

            <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
              Choose how frequently you want to be billed.
            </p>

            <div className="mt-4 space-y-3">

              {(["Monthly", "Yearly"] as const).map((cycle) => (
                <button
                  key={cycle}
                  type="button"
                  onClick={() => setBillingCycle(cycle)}
                  className={`flex w-full items-center justify-between border p-3 text-sm transition-colors ${
                    billingCycle === cycle
                      ? "border-[var(--usus-primary)] bg-[var(--usus-primary-soft)] text-[var(--usus-text)]"
                      : "border-[var(--usus-border)] text-[var(--usus-text-muted)] hover:bg-[var(--usus-surface-soft)]"
                  }`}
                >

                  <span>{cycle}</span>

                  {billingCycle === cycle && (
                    <Icon
                      name="check"
                      size={16}
                    />
                  )}

                </button>
              ))}

            </div>

            <p className="mt-3 text-xs leading-5 text-[var(--usus-text-soft)]">
              Selecting a billing cycle here is a preview only. Changes will require confirmation through the payment provider.
            </p>

          </section>

          {/* HELP */}

          <section className="border border-[var(--usus-border)] bg-[var(--usus-surface)] p-5">

            <h3 className="font-semibold text-[var(--usus-text)]">
              Need help?
            </h3>

            <p className="mt-2 text-sm leading-6 text-[var(--usus-text-muted)]">
              Contact our team if you have questions about your subscription or billing.
            </p>

            <a
              href="mailto:support@usus.com"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--usus-primary)] hover:underline"
            >
              Contact support
              <Icon name="arrow" size={15} />
            </a>

          </section>

        </aside>

      </div>

      {/* MODALS */}

      {activeModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >

          <div className="my-auto w-full max-w-2xl border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-[var(--usus-border)] p-5">

              <div>
                <h2 className="text-lg font-semibold text-[var(--usus-text)]">
                  {activeModal === "plans" && "Choose a subscription plan"}
                  {activeModal === "cancel" && "Cancel subscription"}
                  {activeModal === "payment" && "Payment methods"}
                </h2>

                <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
                  {activeModal === "plans" &&
                    "Choose the plan that works best for your organisation."}

                  {activeModal === "cancel" &&
                    "Review the implications before cancelling."}

                  {activeModal === "payment" &&
                    "Manage your organisation's payment methods."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="text-[var(--usus-text-muted)] hover:text-[var(--usus-text)]"
                aria-label="Close modal"
              >
                <Icon name="close" />
              </button>

            </div>

            <div className="p-5">

              {/* PLAN MODAL */}

              {activeModal === "plans" && (
                <div className="space-y-4">

                  {plans.map((plan) => (
                    <button
                      key={plan.name}
                      type="button"
                      onClick={() => setSelectedPlan(plan.name)}
                      className={`w-full border p-5 text-left transition-colors ${
                        selectedPlan === plan.name
                          ? "border-[var(--usus-primary)] bg-[var(--usus-primary-soft)]"
                          : "border-[var(--usus-border)] hover:bg-[var(--usus-surface-soft)]"
                      }`}
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>
                          <h3 className="font-semibold text-[var(--usus-text)]">
                            {plan.name}
                          </h3>

                          <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
                            {plan.description}
                          </p>
                        </div>

                        <div className="text-right">

                          <p className="font-semibold text-[var(--usus-text)]">
                            {plan.price === 0
                              ? "Custom"
                              : `${formatCurrency(plan.price)}/mo`}
                          </p>

                          {selectedPlan === plan.name && (
                            <span className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--usus-primary)]">
                              <Icon name="check" size={14} />
                              Selected
                            </span>
                          )}

                        </div>

                      </div>

                      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                        {plan.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-2 text-xs text-[var(--usus-text-muted)]"
                          >
                            <Icon
                              name="check"
                              size={13}
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>

                    </button>
                  ))}

                  {paymentNotice && (
                    <p className="border border-[var(--usus-border)] bg-[var(--usus-surface-soft)] p-3 text-sm text-[var(--usus-text-muted)]">
                      {paymentNotice}
                    </p>
                  )}

                  <div className="flex justify-end gap-3 pt-3">

                    <button
                      type="button"
                      onClick={closeModal}
                      className="border border-[var(--usus-border)] px-5 py-2.5 text-sm text-[var(--usus-text)]"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handlePlanChange}
                      className="bg-[var(--usus-primary)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--usus-primary-hover)]"
                    >
                      Continue
                    </button>

                  </div>

                </div>
              )}

              {/* CANCEL MODAL */}

              {activeModal === "cancel" && (
                <div>

                  <div className="border border-[var(--usus-border)] bg-[var(--usus-surface-soft)] p-4">

                    <p className="text-sm font-medium text-[var(--usus-text)]">
                      Are you sure you want to cancel your subscription?
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[var(--usus-text-muted)]">
                      You may lose access to paid features when your current billing period ends. Your organisation&apos;s data and documents should remain subject to the applicable retention policy.
                    </p>

                  </div>

                  <div className="mt-6 flex justify-end gap-3">

                    <button
                      type="button"
                      onClick={closeModal}
                      className="border border-[var(--usus-border)] px-5 py-2.5 text-sm text-[var(--usus-text)]"
                    >
                      Keep subscription
                    </button>

                    <button
                      type="button"
                      onClick={handleCancellation}
                      className="bg-[var(--usus-danger)] px-5 py-2.5 text-sm font-medium text-white"
                    >
                      Confirm cancellation
                    </button>

                  </div>

                </div>
              )}

              {/* PAYMENT METHOD MODAL */}

              {activeModal === "payment" && (
                <div className="space-y-5">

                  <div className="border border-[var(--usus-border)] p-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-14 items-center justify-center bg-[var(--usus-surface-soft)]">
                        <Icon name="card" size={23} />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-[var(--usus-text)]">
                          Visa ending in 4242
                        </p>

                        <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
                          Expires 02/2028 · Default payment method
                        </p>
                      </div>

                    </div>

                  </div>

                  <div className="border border-[var(--usus-primary)] bg-[var(--usus-primary-soft)] p-4">

                    <div className="flex items-start gap-3">

                      <Icon name="shield" size={20} />

                      <div>
                        <h3 className="text-sm font-semibold text-[var(--usus-text)]">
                          Secure payment setup
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-[var(--usus-text-muted)]">
                          New payment methods will be added through a secure payment provider checkout. USUS will not directly collect or store your full card number, expiry date or security code.
                        </p>
                      </div>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentNotice(
                        "Payment provider integration is not connected yet. This action will be enabled once the secure checkout endpoint is available.",
                      );
                    }}
                    className="flex w-full items-center justify-center gap-2 border border-[var(--usus-border)] px-5 py-3 text-sm font-medium text-[var(--usus-text)] hover:bg-[var(--usus-surface-soft)]"
                  >
                    <Icon name="plus" size={16} />
                    Add new payment method
                  </button>

                  {paymentNotice && (
                    <p className="border border-[var(--usus-border)] bg-[var(--usus-surface-soft)] p-3 text-sm text-[var(--usus-text-muted)]">
                      {paymentNotice}
                    </p>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-[var(--usus-primary)] px-5 py-2.5 text-sm font-medium text-white"
                    >
                      Close
                    </button>
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </main>
  );
}

/* ============================================================
   OVERVIEW CARD
============================================================ */

function OverviewCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="border border-[var(--usus-border)] bg-[var(--usus-surface)] p-5">

      <p className="text-xs text-[var(--usus-text-muted)]">
        {label}
      </p>

      <p className="mt-3 text-xl font-semibold text-[var(--usus-text)]">
        {value}
      </p>

      <p className="mt-2 text-xs text-[var(--usus-text-soft)]">
        {detail}
      </p>

    </div>
  );
}

/* ============================================================
   SUMMARY ROW
============================================================ */

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-[var(--usus-text-muted)]">
        {label}
      </span>

      <span className="text-xs font-medium text-[var(--usus-text)]">
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   INVOICE STATUS
============================================================ */

function InvoiceStatus({
  status,
}: {
  status: Invoice["status"];
}) {
  const styles = {
    Paid: "bg-[var(--usus-primary-soft)] text-[var(--usus-primary)]",
    Pending: "bg-[var(--usus-surface-soft)] text-[var(--usus-warning)]",
    Failed: "bg-[var(--usus-surface-soft)] text-[var(--usus-danger)]",
  };

  return (
    <span className={`inline-flex px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}