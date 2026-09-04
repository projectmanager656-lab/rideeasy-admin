import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  WalletCards,
  IndianRupee,
  CarTaxiFront,
  Clock3,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { apiClient, withCaptainAuth } from "../services/http";
import { stripApiEnvelope } from "../utils/apiBody";

// =====================================================
// RIDE EASY — EARNINGS DESIGN TOKENS
// =====================================================

const COLORS = {
  navy: "#07111F",
  navy2: "#0D1B2A",

  orange: "#FFAA1D",
  orangeDark: "#F28C00",

  green: "#189968",
  greenLight: "#E6F7EF",

  white: "#FFFFFF",
  page: "#F7FAFA",
  card: "#FFFFFF",

  text: "#17202A",
  textGray: "#697586",
  border: "#E5E7EB",

  red: "#EF4444",
};

// =====================================================
// HELPERS
// =====================================================

const formatMoney = (value) => {
  const number = Number(value || 0);

  return `₹${number.toLocaleString("en-IN")}`;
};

const formatNumber = (value) => {
  return Number(value || 0).toLocaleString("en-IN");
};

// =====================================================
// DEMO DATA
// Used only if API does not return detailed earnings.
// =====================================================

const DEMO_EARNINGS = {
  todayEarnings: 120,
  weekEarnings: 860,
  monthEarnings: 3240,

  completedRides: 4,

  todayRides: 4,
  weekRides: 27,
  monthRides: 108,

  todayHours: 2.8,
  weekHours: 18.5,
  monthHours: 72,

  averageFare: 30,

  lastWeekEarnings: 106.67,

  breakdown: {
    baseFare: 80,
    incentives: 20,
    surge: 10,
    other: 10,
  },

  recentEarnings: [
    {
      id: 1,
      pickup: "MG Road, Pune",
      drop: "Swargate, Pune",
      time: "10:30 AM",
      amount: 120,
      status: "Completed",
      payment: "Cash",
    },
    {
      id: 2,
      pickup: "Hadapsar, Pune",
      drop: "Katraj, Pune",
      time: "09:15 AM",
      amount: 85,
      status: "Completed",
      payment: "UPI",
    },
    {
      id: 3,
      pickup: "Bibwewadi, Pune",
      drop: "Hinjewadi, Pune",
      time: "06:40 PM",
      amount: 0,
      status: "Cancelled",
      payment: "-",
    },
    {
      id: 4,
      pickup: "MG Road, Pune",
      drop: "Swargate, Pune",
      time: "04:10 PM",
      amount: 110,
      status: "Completed",
      payment: "Cash",
    },
  ],
};

// =====================================================
// EARNINGS PAGE
// =====================================================

const DriverEarnings = () => {
  const navigate = useNavigate();

  const [activePeriod, setActivePeriod] = useState("day");

  const [earnings, setEarnings] = useState(null);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD EARNINGS
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const loadEarnings = async () => {
      try {
        setLoading(true);

        const response = await apiClient.get(
          "/captains/earnings",
          withCaptainAuth()
        );

        const data = stripApiEnvelope(response.data);

        if (mounted) {
          setEarnings(data || {});
        }
      } catch (error) {
        console.error("Failed to load earnings:", error);

        if (mounted) {
          setEarnings(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadEarnings();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================================
  // NORMALIZE DATA
  // =====================================================

  const data = earnings || DEMO_EARNINGS;

  const todayEarnings = Number(
    data?.todayEarnings ??
      data?.today ??
      DEMO_EARNINGS.todayEarnings
  );

  const weekEarnings = Number(
    data?.weekEarnings ??
      data?.weeklyEarnings ??
      data?.week ??
      DEMO_EARNINGS.weekEarnings
  );

  const monthEarnings = Number(
    data?.monthEarnings ??
      data?.monthlyEarnings ??
      data?.month ??
      DEMO_EARNINGS.monthEarnings
  );

  const todayRides = Number(
    data?.todayRides ??
      data?.completedRides ??
      data?.count ??
      DEMO_EARNINGS.todayRides
  );

  const weekRides = Number(
    data?.weekRides ??
      DEMO_EARNINGS.weekRides
  );

  const monthRides = Number(
    data?.monthRides ??
      DEMO_EARNINGS.monthRides
  );

  // =====================================================
  // PERIOD DATA
  // =====================================================

  const periodData = useMemo(() => {
    if (activePeriod === "week") {
      return {
        label: "This week's earnings",
        amount: weekEarnings,
        rides: weekRides,
        hours: data?.weekHours ?? DEMO_EARNINGS.weekHours,
      };
    }

    if (activePeriod === "month") {
      return {
        label: "This month's earnings",
        amount: monthEarnings,
        rides: monthRides,
        hours: data?.monthHours ?? DEMO_EARNINGS.monthHours,
      };
    }

    return {
      label: "Today's earnings",
      amount: todayEarnings,
      rides: todayRides,
      hours: data?.todayHours ?? DEMO_EARNINGS.todayHours,
    };
  }, [
    activePeriod,
    todayEarnings,
    weekEarnings,
    monthEarnings,
    todayRides,
    weekRides,
    monthRides,
    data,
  ]);

  // =====================================================
  // AVERAGE FARE
  // =====================================================

  const averageFare =
    periodData.rides > 0
      ? Math.round(
          Number(periodData.amount || 0) /
            Number(periodData.rides || 1)
        )
      : 0;

  // =====================================================
  // LAST WEEK COMPARISON
  // =====================================================

  const lastWeek =
    Number(
      data?.lastWeekEarnings ??
        DEMO_EARNINGS.lastWeekEarnings
    ) || 0;

  const weeklyGrowth =
    lastWeek > 0
      ? ((weekEarnings - lastWeek) / lastWeek) * 100
      : 0;

  // =====================================================
  // BREAKDOWN
  // =====================================================

  const breakdown = {
    baseFare: Number(
      data?.breakdown?.baseFare ??
        data?.baseFare ??
        DEMO_EARNINGS.breakdown.baseFare
    ),

    incentives: Number(
      data?.breakdown?.incentives ??
        data?.incentives ??
        DEMO_EARNINGS.breakdown.incentives
    ),

    surge: Number(
      data?.breakdown?.surge ??
        data?.surge ??
        DEMO_EARNINGS.breakdown.surge
    ),

    other: Number(
      data?.breakdown?.other ??
        data?.otherEarnings ??
        DEMO_EARNINGS.breakdown.other
    ),
  };

  // =====================================================
  // RECENT EARNINGS
  // =====================================================

  const recentEarnings =
    Array.isArray(data?.recentEarnings)
      ? data.recentEarnings
      : Array.isArray(data?.recent)
      ? data.recent
      : DEMO_EARNINGS.recentEarnings;

  // =====================================================
  // CHART
  // =====================================================

  const chartValues = useMemo(() => {
    if (activePeriod === "week") {
      return [40, 55, 45, 72, 60, 88, 74];
    }

    if (activePeriod === "month") {
      return [32, 48, 42, 66, 55, 78, 68, 92, 80, 96];
    }

    return [25, 30, 24, 38, 31, 50, 42, 63, 52, 70, 61];
  }, [activePeriod]);

  const chartPoints = chartValues
    .map((value, index) => {
      const x =
        (index / (chartValues.length - 1)) * 100;

      const y = 100 - value;

      return `${x},${y}`;
    })
    .join(" ");

  const chartAreaPoints = `0,100 ${chartPoints} 100,100`;

  // =====================================================
  // BOTTOM NAV
  // =====================================================

  const BottomNav = () => {
    return (
      <nav
        className="shrink-0 border-t bg-[#07111F]"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <div className="grid h-[62px] grid-cols-4">
          {/* HOME */}

          <button
            type="button"
            onClick={() =>
              navigate("/captain-home")
            }
            className="flex flex-col items-center justify-center gap-[4px] text-white/50"
          >
            <div className="flex h-[25px] w-[25px] items-center justify-center">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 10.5L12 3l9 7.5" />
                <path d="M5 9.5V21h14V9.5" />
                <path d="M9 21v-6h6v6" />
              </svg>
            </div>

            <span className="text-[9px] font-medium">
              Home
            </span>
          </button>

          {/* EARNINGS */}

          <button
            type="button"
            className="flex flex-col items-center justify-center gap-[4px] text-[#FFAA1D]"
          >
            <WalletCards
              size={20}
              strokeWidth={2}
            />

            <span className="text-[9px] font-bold">
              Earnings
            </span>
          </button>

          {/* HISTORY */}

          <button
            type="button"
            onClick={() =>
              navigate("/captain-history")
            }
            className="flex flex-col items-center justify-center gap-[4px] text-white/50"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <path d="M3 4v5h5" />
              <path d="M12 7v5l3 2" />
            </svg>

            <span className="text-[9px] font-medium">
              History
            </span>
          </button>

          {/* PROFILE */}

          <button
            type="button"
            onClick={() =>
              navigate("/captain-profile")
            }
            className="flex flex-col items-center justify-center gap-[4px] text-white/50"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 21c.8-4 3-6 7-6s6.2 2 7 6" />
            </svg>

            <span className="text-[9px] font-medium">
              Profile
            </span>
          </button>
        </div>
      </nav>
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="fixed inset-0 flex w-full justify-center bg-[#E5E7EB]">
      <div className="flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-[#F7FAFA] text-[#17202A] shadow-xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <header
          className="shrink-0 px-[16px] pb-[14px] pt-[14px]"
          style={{
            backgroundColor: COLORS.navy,
          }}
        >
          <div className="flex items-center justify-between">

            {/* BACK */}

            <button
              type="button"
              onClick={() =>
                navigate("/captain-home")
              }
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-white transition active:scale-95"
            >
              <ArrowLeft
                size={21}
                strokeWidth={2}
              />
            </button>

            {/* TITLE */}

            <h1 className="text-[14px] font-bold text-white">
              Earnings
            </h1>

            {/* RIGHT SPACE */}

            <div className="h-[34px] w-[34px]" />
          </div>
        </header>

        {/* =================================================
            SCROLL AREA
        ================================================= */}

        <main className="hide-scrollbar min-h-0 flex-1 overflow-y-auto bg-[#F7FAFA] px-[14px] pb-[16px] pt-[12px]">

          {/* ================= SCROLLABLE CONTENT ================= */}

          <div className="hide-scrollbar overflow-y-auto px-[10px] pb-[30px]">

            {/* ================= TOTAL EARNINGS ================= */}

            <div className="overflow-hidden rounded-[14px] border border-[#1e426b] bg-[#0a2744]">
              <div className="px-[16px] py-[18px]">

                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-[12px] text-blue-200">
                      Total earnings
                    </p>

                    <p className="mt-[4px] text-[24px] font-bold text-white">
                      {loading
                        ? "₹—"
                        : formatMoney(
                            periodData.amount
                          )}
                    </p>
                  </div>

                  <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white/10">
                    <IndianRupee
                      size={18}
                      className="text-[#FFAA1D]"
                    />
                  </div>

                </div>

              </div>
            </div>

            {/* ================= PERIOD SELECTOR ================= */}

            <section className="mt-[10px] rounded-[14px] border border-[#E5E7EB] bg-white p-[4px] shadow-[0_2px_8px_rgba(17,24,39,0.04)]">

              <div className="grid grid-cols-3 gap-[4px]">

                {[
                  ["day", "Day"],
                  ["week", "Week"],
                  ["month", "Month"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setActivePeriod(value)
                    }
                    className={`h-[32px] rounded-[9px] text-[10px] font-semibold transition-all ${
                      activePeriod === value
                        ? "bg-[#FFAA1D] text-[#17202A] shadow-sm"
                        : "bg-transparent text-[#697586]"
                    }`}
                  >
                    {label}
                  </button>
                ))}

              </div>
            </section>

            {/* =================================================
                MAIN EARNINGS CARD
            ================================================= */}

            <section className="mt-[10px] overflow-hidden rounded-[15px] border border-[#E5E7EB] bg-white shadow-[0_2px_8px_rgba(17,24,39,0.04)]">

              <div className="px-[14px] pt-[14px]">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-[9px] font-medium text-[#697586]">
                      {periodData.label}
                    </p>

                    <div className="mt-[3px] flex items-center gap-[3px]">

                      <span className="text-[22px] font-bold leading-none text-[#17202A]">
                        {loading
                          ? "₹—"
                          : formatMoney(
                              periodData.amount
                            )}
                      </span>

                    </div>

                    {/* GROWTH */}

                    <div className="mt-[6px] flex items-center gap-[4px]">

                      <TrendingUp
                        size={12}
                        strokeWidth={2.2}
                        className="text-[#189968]"
                      />

                      <span className="text-[8px] font-semibold text-[#189968]">
                        +{Math.abs(weeklyGrowth || 12.5).toFixed(1)}%
                      </span>

                      <span className="text-[8px] text-[#697586]">
                        vs last week
                      </span>

                    </div>
                  </div>

                  {/* ICON */}

                  <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#E6F7EF]">

                    <IndianRupee
                      size={17}
                      strokeWidth={2}
                      className="text-[#189968]"
                    />

                  </div>

                </div>

                {/* =================================================
                    CHART
                ================================================= */}

                <div className="mt-[14px]">

                  <div className="relative h-[105px] w-full">

                    {/* GRID */}

                    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">

                      <span className="border-t border-dashed border-[#E5E7EB]" />
                      <span className="border-t border-dashed border-[#E5E7EB]" />
                      <span className="border-t border-dashed border-[#E5E7EB]" />
                      <span className="border-t border-dashed border-[#E5E7EB]" />

                    </div>

                    {/* SVG */}

                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="absolute inset-0 h-full w-full overflow-visible"
                    >

                      <polygon
                        points={chartAreaPoints}
                        fill="#FFAA1D"
                        fillOpacity="0.10"
                      />

                      <polyline
                        points={chartPoints}
                        fill="none"
                        stroke="#FFAA1D"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />

                    </svg>

                  </div>

                  {/* TIME LABELS */}

                  <div className="mt-[4px] flex justify-between text-[7px] text-[#697586]">

                    {activePeriod === "day" ? (
                      <>
                        <span>12 AM</span>
                        <span>6 AM</span>
                        <span>12 PM</span>
                        <span>6 PM</span>
                        <span>12 AM</span>
                      </>
                    ) : activePeriod === "week" ? (
                      <>
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </>
                    ) : (
                      <>
                        <span>1</span>
                        <span>7</span>
                        <span>14</span>
                        <span>21</span>
                        <span>30</span>
                      </>
                    )}

                  </div>

                </div>
              </div>

              {/* =================================================
                  STATS
              ================================================= */}

              <div className="mt-[14px] grid grid-cols-3 border-t border-[#E5E7EB]">

                {/* RIDES */}

                <div className="px-[10px] py-[11px] text-center">

                  <div className="mx-auto flex h-[27px] w-[27px] items-center justify-center rounded-full bg-[#E6F7EF]">

                    <CarTaxiFront
                      size={14}
                      className="text-[#189968]"
                    />

                  </div>

                  <p className="mt-[5px] text-[15px] font-bold text-[#17202A]">
                    {formatNumber(
                      periodData.rides
                    )}
                  </p>

                  <p className="text-[9px] text-[#697586]">
                    Rides
                  </p>

                </div>

                {/* TIME */}

                <div className="border-l border-[#E5E7EB] px-[10px] py-[11px] text-center">

                  <div className="mx-auto flex h-[27px] w-[27px] items-center justify-center rounded-full bg-[#FFF4DD]">

                    <Clock3
                      size={14}
                      className="text-[#F28C00]"
                    />

                  </div>

                  <p className="mt-[5px] text-[15px] font-bold text-[#17202A]">
                    {periodData.hours}h
                  </p>

                  <p className="text-[9px] text-[#697586]">
                    Online time
                  </p>

                </div>

                {/* AVG */}

                <div className="border-l border-[#E5E7EB] px-[10px] py-[11px] text-center">

                  <div className="mx-auto flex h-[27px] w-[27px] items-center justify-center rounded-full bg-[#FFF4DD]">

                    <IndianRupee
                      size={14}
                      className="text-[#F28C00]"
                    />

                  </div>

                  <p className="mt-[5px] text-[15px] font-bold text-[#17202A]">
                    {formatMoney(
                      averageFare
                    )}
                  </p>

                  <p className="text-[9px] text-[#697586]">
                    Avg. per ride
                  </p>

                </div>

              </div>
            </section>

            {/* =================================================
                EARNINGS BREAKDOWN
            ================================================= */}

            <section className="mt-[10px] rounded-[15px] border border-[#E5E7EB] bg-white px-[14px] py-[13px] shadow-[0_2px_8px_rgba(17,24,39,0.04)]">

              <div className="flex items-center justify-between">

                <h2 className="text-[12px] font-bold text-[#17202A]">
                  Earnings breakdown
                </h2>

                <span className="rounded-full bg-[#E6F7EF] px-[7px] py-[3px] text-[7px] font-semibold text-[#189968]">
                  {activePeriod === "day"
                    ? "Today"
                    : activePeriod === "week"
                    ? "This week"
                    : "This month"}
                </span>

              </div>

              <div className="mt-[10px]">

                {/* BASE FARE */}

                <div className="flex items-center justify-between border-b border-[#E5E7EB] py-[8px]">

                  <span className="text-[10px] text-[#697586]">
                    Base fare
                  </span>

                  <span className="text-[10px] font-semibold text-[#17202A]">
                    {formatMoney(
                      breakdown.baseFare
                    )}
                  </span>

                </div>

                {/* INCENTIVES */}

                <div className="flex items-center justify-between border-b border-[#E5E7EB] py-[8px]">

                  <span className="text-[10px] text-[#697586]">
                    Incentives
                  </span>

                  <span className="text-[10px] font-semibold text-[#17202A]">
                    {formatMoney(
                      breakdown.incentives
                    )}
                  </span>

                </div>

                {/* SURGE */}

                <div className="flex items-center justify-between border-b border-[#E5E7EB] py-[8px]">

                  <span className="text-[10px] text-[#697586]">
                    Surge
                  </span>

                  <span className="text-[10px] font-semibold text-[#17202A]">
                    {formatMoney(
                      breakdown.surge
                    )}
                  </span>

                </div>

                {/* OTHER */}

                <div className="flex items-center justify-between border-b border-[#E5E7EB] py-[8px]">

                  <span className="text-[10px] text-[#697586]">
                    Other earnings
                  </span>

                  <span className="text-[10px] font-semibold text-[#17202A]">
                    {formatMoney(
                      breakdown.other
                    )}
                  </span>

                </div>

                {/* TOTAL */}

                <div className="flex items-center justify-between pt-[10px]">

                  <span className="text-[10px] font-bold text-[#17202A]">
                    Total earnings
                  </span>

                  <span className="text-[13px] font-bold text-[#189968]">
                    {formatMoney(
                      breakdown.baseFare +
                        breakdown.incentives +
                        breakdown.surge +
                        breakdown.other
                    )}
                  </span>

                </div>

              </div>
            </section>

            {/* =================================================
                RECENT EARNINGS
            ================================================= */}

            <section className="mt-[10px] rounded-[15px] border border-[#E5E7EB] bg-white px-[14px] py-[13px] shadow-[0_2px_8px_rgba(17,24,39,0.04)]">

              <div className="flex items-center justify-between">

                <h2 className="text-[12px] font-bold text-[#17202A]">
                  Recent earnings
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/driver/history")
                  }
                  className="flex items-center gap-[2px] text-[9px] font-semibold text-[#697586]"
                >
                  View all
                  <ChevronRight size={12} />
                </button>

              </div>

              <div className="mt-[8px]">

                {recentEarnings.map(
                  (ride, index) => {

                    const amount = Number(
                      ride?.amount ??
                        ride?.fare ??
                        ride?.price ??
                        0
                    );

                    const status =
                      ride?.status ||
                      "Completed";

                    const cancelled =
                      String(status).toLowerCase() ===
                      "cancelled";

                    return (
                      <div
                        key={
                          ride?.id ||
                          ride?._id ||
                          index
                        }
                        className={`flex items-center gap-[9px] py-[9px] ${
                          index !==
                          recentEarnings.length - 1
                            ? "border-b border-[#E5E7EB]"
                            : ""
                        }`}
                      >

                        {/* STATUS ICON */}

                        <div
                          className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full ${
                            cancelled
                              ? "bg-[#FEF2F2]"
                              : "bg-[#E6F7EF]"
                          }`}
                        >

                          {cancelled ? (
                            <XCircle
                              size={15}
                              className="text-[#EF4444]"
                            />
                          ) : (
                            <CheckCircle2
                              size={15}
                              className="text-[#189968]"
                            />
                          )}

                        </div>

                        {/* DETAILS */}

                        <div className="min-w-0 flex-1">

                          <div className="flex items-center justify-between gap-[5px]">

                            <p className="truncate text-[10px] font-semibold text-[#17202A]">
                              {ride?.pickup ||
                                ride?.pickupLocation ||
                                "Pickup"}
                            </p>

                            <span
                              className={`shrink-0 text-[8px] font-semibold ${
                                cancelled
                                  ? "text-[#EF4444]"
                                  : "text-[#189968]"
                              }`}
                            >
                              {status}
                            </span>

                          </div>

                          <div className="mt-[2px] flex items-center justify-between gap-[5px]">

                            <p className="truncate text-[9px] text-[#697586]">
                              {ride?.drop ||
                                ride?.dropLocation ||
                                "Destination"}
                            </p>

                            <span className="shrink-0 text-[8px] text-[#697586]">
                              {ride?.time ||
                                ride?.createdAt ||
                                ""}
                            </span>

                          </div>

                        </div>

                        {/* AMOUNT */}

                        <div className="shrink-0 text-right">

                          <p
                            className={`text-[10px] font-bold ${
                              cancelled
                                ? "text-[#697586]"
                                : "text-[#17202A]"
                            }`}
                          >
                            {cancelled
                              ? "₹0"
                              : formatMoney(amount)}
                          </p>

                          <p className="mt-[2px] text-[7px] text-[#697586]">
                            {ride?.payment ||
                              "Cash"}
                          </p>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            </section>

          </div>
        </main>

        {/* =================================================
            BOTTOM NAV
        ================================================= */}

        <BottomNav />

      </div>
    </div>
  );
};

export default DriverEarnings;