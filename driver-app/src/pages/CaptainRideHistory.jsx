import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  History as HistoryIcon,
  Home,
  WalletCards,
  UserRound,
  MapPin,
  Navigation,
  Clock3,
  ChevronRight,
  CheckCircle2,
  XCircle,
  IndianRupee,
} from "lucide-react";

const CaptainRideHistory = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");

  // =========================================================
  // RIDE DATA
  // =========================================================
  const rides = [
    {
      id: 1,
      date: "24 May",
      time: "10:30 AM",
      status: "completed",
      pickup: "MG Road, Pune",
      drop: "Swargate, Pune",
      distance: "2.4 km",
      duration: "18 min",
      fare: "₹120",
      payment: "Cash",
    },
    {
      id: 2,
      date: "24 May",
      time: "09:15 AM",
      status: "completed",
      pickup: "Hadapsar, Pune",
      drop: "Katraj, Pune",
      distance: "1.8 km",
      duration: "12 min",
      fare: "₹85",
      payment: "UPI",
    },
    {
      id: 3,
      date: "23 May",
      time: "04:40 PM",
      status: "cancelled",
      pickup: "Bibwewadi, Pune",
      drop: "Hinjewadi, Pune",
      distance: "3.1 km",
      duration: "—",
      fare: "₹0",
      payment: "—",
    },
    {
      id: 4,
      date: "23 May",
      time: "01:10 PM",
      status: "completed",
      pickup: "MG Road, Pune",
      drop: "Swargate, Pune",
      distance: "3.2 km",
      duration: "22 min",
      fare: "₹110",
      payment: "Cash",
    },
    {
      id: 5,
      date: "22 May",
      time: "06:25 PM",
      status: "completed",
      pickup: "Kothrud, Pune",
      drop: "Kalyani Nagar, Pune",
      distance: "4.5 km",
      duration: "25 min",
      fare: "₹145",
      payment: "Cash",
    },
  ];

  // =========================================================
  // FILTER
  // =========================================================
  const filteredRides = useMemo(() => {
    if (activeTab === "completed") {
      return rides.filter((ride) => ride.status === "completed");
    }

    if (activeTab === "cancelled") {
      return rides.filter((ride) => ride.status === "cancelled");
    }

    return rides;
  }, [activeTab]);

  // =========================================================
  // SUMMARY
  // =========================================================
  const totalRides = rides.length;

  const completedRides = rides.filter(
    (ride) => ride.status === "completed"
  ).length;

  const totalEarned = rides
    .filter((ride) => ride.status === "completed")
    .reduce((total, ride) => {
      return total + Number(ride.fare.replace("₹", ""));
    }, 0);

  // =========================================================
  // STATUS
  // =========================================================
  const StatusBadge = ({ status }) => {
    if (status === "completed") {
      return (
        <div className="inline-flex items-center gap-[5px] rounded-full bg-[#E8F8F0] px-[10px] py-[5px]">
          <CheckCircle2
            size={12}
            strokeWidth={2.4}
            className="text-[#1FAA59]"
          />

          <span className="text-[10px] font-semibold text-[#168447]">
            Completed
          </span>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-[5px] rounded-full bg-[#FFF0F0] px-[10px] py-[5px]">
        <XCircle
          size={12}
          strokeWidth={2.4}
          className="text-[#E5484D]"
        />

        <span className="text-[10px] font-semibold text-[#E5484D]">
          Cancelled
        </span>
      </div>
    );
  };

  // =========================================================
  // RIDE CARD
  // =========================================================
  const RideCard = ({ ride }) => (
    <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-[14px] shadow-[0_2px_10px_rgba(17,24,39,0.04)]">

      {/* TOP */}
      <div className="flex items-start justify-between">

        <div>
          <p className="text-[10px] font-medium text-[#697586]">
            {ride.date} • {ride.time}
          </p>

          <div className="mt-[8px]">
            <StatusBadge status={ride.status} />
          </div>
        </div>

        {/* FARE */}
        <div className="text-right">
          <p
            className={`text-[18px] font-extrabold ${
              ride.status === "cancelled"
                ? "text-[#697586]"
                : "text-[#17202A]"
            }`}
          >
            {ride.fare}
          </p>

          <p className="mt-[2px] text-[9px] text-[#697586]">
            {ride.payment}
          </p>
        </div>
      </div>

      {/* ROUTE BOX */}
      <div className="mt-[14px] rounded-[14px] bg-[#F7FAFA] px-[12px] py-[12px]">

        {/* PICKUP */}
        <div className="flex items-start gap-[10px]">

          <div className="mt-[1px] flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#E7F7EF]">
            <MapPin
              size={12}
              strokeWidth={2.5}
              className="text-[#1FAA59]"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-[#17202A]">
              Pickup
            </p>

            <p className="mt-[2px] truncate text-[10px] text-[#697586]">
              {ride.pickup}
            </p>
          </div>
        </div>

        {/* CONNECTOR */}
        <div className="ml-[10px] h-[14px] border-l border-dashed border-[#D6DCE2]" />

        {/* DROP */}
        <div className="flex items-start gap-[10px]">

          <div className="mt-[1px] flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#FFF0F0]">
            <Navigation
              size={11}
              strokeWidth={2.5}
              className="rotate-180 text-[#E5484D]"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-[#17202A]">
              Drop
            </p>

            <p className="mt-[2px] truncate text-[10px] text-[#697586]">
              {ride.drop}
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="mt-[12px] flex items-center justify-between border-t border-[#E5E7EB] pt-[10px]">

        <div className="flex items-center gap-[14px]">

          {/* DISTANCE */}
          <div className="flex items-center gap-[5px]">
            <Navigation
              size={12}
              className="text-[#697586]"
            />

            <span className="text-[9px] text-[#697586]">
              {ride.distance}
            </span>
          </div>

          {/* TIME */}
          <div className="flex items-center gap-[5px]">
            <Clock3
              size={12}
              className="text-[#697586]"
            />

            <span className="text-[9px] text-[#697586]">
              {ride.duration}
            </span>
          </div>
        </div>

        {/* DETAILS */}
        <button
          type="button"
          onClick={() =>
            navigate(`/driver/history/${ride.id}`)
          }
          className="flex items-center gap-[3px] text-[9px] font-medium text-[#697586] active:scale-[0.97]"
        >
          View details

          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );

  // =========================================================
  // BOTTOM NAV
  // =========================================================
  const BottomNav = () => (
    <nav className="shrink-0 border-t border-white/[0.08] bg-[#111827] px-[10px] pb-[10px] pt-[8px]">

      <div className="grid grid-cols-4">

        {/* HOME */}
        <button
          type="button"
          onClick={() => navigate("/captain-home")}
          className="flex flex-col items-center gap-[4px] text-[#697586]"
        >
          <Home size={20} strokeWidth={1.8} />

          <span className="text-[8px] font-semibold">
            Home
          </span>
        </button>

        {/* EARNINGS */}
        <button
          type="button"
          onClick={() => navigate("/captain-earning")}
          className="flex flex-col items-center gap-[4px] text-[#697586]"
        >
          <WalletCards
            size={20}
            strokeWidth={1.8}
          />

          <span className="text-[8px] font-semibold">
            Earnings
          </span>
        </button>

        {/* HISTORY */}
        <button
          type="button"
          onClick={() => navigate("/captain-history")}
          className="flex flex-col items-center gap-[4px] text-[#FFA726]"
        >
          <HistoryIcon
            size={20}
            strokeWidth={2}
          />

          <span className="text-[8px] font-semibold">
            History
          </span>
        </button>

        {/* PROFILE */}
        <button
          type="button"
          onClick={() => navigate("/captain-profile")}
          className="flex flex-col items-center gap-[4px] text-[#697586]"
        >
          <UserRound
            size={20}
            strokeWidth={1.8}
          />

          <span className="text-[8px] font-semibold">
            Profile
          </span>
        </button>

      </div>
    </nav>
  );

  // =========================================================
  // MAIN UI
  // =========================================================
return (
  <div className="fixed inset-0 flex w-full justify-center overflow-hidden bg-[#E5E7EB]">
    <div className="flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-[#F7FAFA] text-[#17202A] shadow-xl">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <header className="shrink-0 bg-[#111827] px-[16px] pb-[14px] pt-[14px]">

          <div className="flex items-center justify-between">

            {/* BACK */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-white transition active:scale-95"
            >
              <ArrowLeft size={21} 
              strokeWidth={2}
              />
            </button>

            {/* TITLE */}
            <div className="flex-1 text-center">
              <h1 className="text-[14px] font-bold text-white">
                 History
              </h1>
            </div>


               {/* RIGHT SPACE */}

            <div className="h-[34px] w-[34px]" />

            </div>

        
        </header>

        {/* =====================================================
            SCROLL CONTENT
        ===================================================== */}
        <main className="hide-scrollbar min-h-0 flex-1 overflow-y-auto bg-[#F9FAFA] px-[14px] pb-[20px]">

          {/* ===================================================
              SUMMARY
          =================================================== */}
          <section className="mt-[14px] overflow-hidden rounded-[17px] border border-[#E5E7EB] bg-white">

            <div className="grid grid-cols-3">

              {/* TOTAL */}
              <div className="px-[12px] py-[14px]">

                <p className="text-[20px] font-extrabold text-[#17202A]">
                  {totalRides}
                </p>

                <p className="mt-[2px] text-[8px] text-[#697586]">
                  Total rides
                </p>

              </div>

              {/* COMPLETED */}
              <div className="border-l border-[#E5E7EB] px-[12px] py-[14px]">

                <p className="text-[20px] font-extrabold text-[#1FAA59]">
                  {completedRides}
                </p>

                <p className="mt-[2px] text-[8px] text-[#697586]">
                  Completed
                </p>

              </div>

              {/* EARNED */}
              <div className="border-l border-[#E5E7EB] px-[12px] py-[14px]">

                <p className="text-[20px] font-extrabold text-[#FFA726]">
                  ₹{totalEarned}
                </p>

                <p className="mt-[2px] text-[8px] text-[#697586]">
                  Total earned
                </p>

              </div>

            </div>

          </section>

          {/* ===================================================
              FILTER TABS
          =================================================== */}
          <section className="mt-[12px] rounded-[16px] border border-[#E5E7EB] bg-white p-[4px]">

            <div className="grid grid-cols-3 gap-[3px]">

              {[
                {
                  id: "all",
                  label: "All",
                },
                {
                  id: "completed",
                  label: "Completed",
                },
                {
                  id: "cancelled",
                  label: "Cancelled",
                },
              ].map((tab) => (

                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`h-[38px] rounded-[11px] text-[9px] font-semibold transition ${
                    activeTab === tab.id
                      ? "bg-[#FFA726] text-[#111827]"
                      : "bg-transparent text-[#697586]"
                  }`}
                >
                  {tab.label}
                </button>

              ))}

            </div>

          </section>

          {/* ===================================================
              RECENT RIDES HEADER
          =================================================== */}
          <div className="mb-[9px] mt-[18px] flex items-center justify-between px-[3px]">

            <h2 className="text-[14px] font-bold text-[#17202A]">
              Recent rides
            </h2>

            <span className="text-[9px] text-[#697586]">
              {filteredRides.length} rides
            </span>

          </div>

          {/* ===================================================
              RIDE LIST
          =================================================== */}
          <div className="space-y-[10px]">

            {filteredRides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
              />
            ))}

          </div>

          {/* EMPTY STATE */}
          {filteredRides.length === 0 && (
            <div className="mt-[20px] rounded-[18px] border border-[#E5E7EB] bg-white px-[20px] py-[35px] text-center">

              <div className="mx-auto flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#F1F3F5]">

                <HistoryIcon
                  size={22}
                  className="text-[#697586]"
                />

              </div>

              <p className="mt-[12px] text-[13px] font-bold text-[#17202A]">
                No rides found
              </p>

              <p className="mt-[4px] text-[10px] text-[#697586]">
                There are no rides in this category.
              </p>

            </div>
          )}

        </main>

        {/* =====================================================
            BOTTOM NAV
        ===================================================== */}
        <BottomNav />

      </div>
    </div>
  );
};

export default CaptainRideHistory;