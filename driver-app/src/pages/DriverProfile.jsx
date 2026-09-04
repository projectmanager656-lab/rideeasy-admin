
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  CarFront,
  FileCheck2,
  Landmark,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Pencil,
  Mail,
  ShieldCheck,
  Star,
  X,
  Loader2,
  WalletCards,
  Bell,
  Phone,
  Save,
  FileText,
  CreditCard,
  Lock,
  MessageCircle,
} from "lucide-react";

import { CaptainDataContext } from "../context/CaptainContext";
import { apiClient, withCaptainAuth } from "../services/http";
import { stripApiEnvelope } from "../utils/apiBody";

// =====================================================
// COLORS
// =====================================================

const COLORS = {
  night: "#111827",
  nightDeep: "#0B1220",
  amber: "#FFA726",
  green: "#1FAA59",
  red: "#E5484D",
  white: "#FAFAFA",
  grey: "#6B7280",
  greyLight: "#9CA3AF",
  border: "#E5E7EB",
  card: "#FFFFFF",
  page: "#F9FAFB",
};

// =====================================================
// BOTTOM NAVIGATION
// =====================================================

const BottomNav = ({ navigate }) => {
  const currentPath = window.location.pathname;

  return (
    <nav
      className="shrink-0 border-t border-[#1F2937] bg-[#111827]"
      style={{
        paddingBottom: "max(10px, env(safe-area-inset-bottom))",
      }}
    >
      <div className="grid grid-cols-4 px-[8px] pt-[8px]">

        {/* HOME */}
        <button
          type="button"
          onClick={() => navigate("/captain-home")}
          className={`flex flex-col items-center justify-center gap-[4px] ${
            currentPath === "/captain-home"
              ? "text-[#FFA726]"
              : "text-[#9CA3AF]"
          }`}
        >
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5.5 9.5V21h13V9.5" />
            <path d="M9.5 21v-6h5v6" />
          </svg>

          <span className="text-[9px] font-medium">
            Home
          </span>
        </button>

        {/* EARNINGS */}
        <button
          type="button"
          onClick={() => navigate("/captain-earning")}
          className={`flex flex-col items-center justify-center gap-[4px] ${
            currentPath === "/captain-earning"
              ? "text-[#FFA726]"
              : "text-[#9CA3AF]"
          }`}
        >
          <WalletCards size={20} strokeWidth={1.8} />

          <span className="text-[9px] font-medium">
            Earnings
          </span>
        </button>

        {/* HISTORY */}
        <button
          type="button"
          onClick={() => navigate("/captain-history")}
          className={`flex flex-col items-center justify-center gap-[4px] ${
            currentPath === "/captain-history"
              ? "text-[#FFA726]"
              : "text-[#9CA3AF]"
          }`}
        >
          <svg
            width="21"
            height="21"
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
          onClick={() => navigate("/captain-profile")}
          className="flex flex-col items-center justify-center gap-[4px] text-[#FFA726]"
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
// PROFILE ROW
// =====================================================

const ProfileRow = ({
  icon: Icon,
  title,
  subtitle,
  rightText,
  rightColor = "#6B7280",
  danger = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-[12px] px-[14px] py-[14px] text-left transition-colors ${
        danger ? "text-[#E5484D]" : "text-[#111827]"
      } hover:bg-[#FFF3E0] active:bg-[#FFF3E0]`}
    >
      <div
        className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] ${
          danger ? "bg-[#FDECEC]" : "bg-[#F3F4F6]"
        }`}
      >
        <Icon
          size={18}
          strokeWidth={1.8}
          className={
            danger
              ? "text-[#E5484D]"
              : "text-[#6B7280]"
          }
        />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-[12px] font-semibold ${
            danger
              ? "text-[#E5484D]"
              : "text-[#111827]"
          }`}
        >
          {title}
        </p>

        {subtitle && (
          <p className="mt-[2px] truncate text-[9px] text-[#6B7280]">
            {subtitle}
          </p>
        )}
      </div>

      {rightText && (
        <span
          className="mr-[2px] text-[9px] font-semibold"
          style={{ color: rightColor }}
        >
          {rightText}
        </span>
      )}

      {!danger && (
        <ChevronRight
          size={17}
          className="shrink-0 text-[#6B7280]"
          strokeWidth={1.8}
        />
      )}
    </button>
  );
};

// =====================================================
// POPUP WRAPPER
// =====================================================

const Popup = ({
  title,
  subtitle,
  icon: Icon,
  children,
  onClose,
  footer,
}) => {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-[#111827]/55 px-[10px] pb-[10px] backdrop-blur-[3px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[410px] overflow-hidden rounded-[23px] bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-[17px] py-[14px]">

          <div className="flex min-w-0 items-center gap-[10px]">

            <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] bg-[#FFF3E0]">
              <Icon
                size={19}
                className="text-[#FFA726]"
              />
            </div>

            <div className="min-w-0">

              <h2 className="truncate text-[14px] font-bold text-[#111827]">
                {title}
              </h2>

              {subtitle && (
                <p className="mt-[2px] text-[8px] text-[#6B7280]">
                  {subtitle}
                </p>
              )}

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-[#6B7280]"
          >
            <X size={16} />
          </button>

        </div>

        {/* BODY */}
        <div className="hide-scrollbar max-h-[65vh] overflow-y-auto px-[17px] py-[15px]">
          {children}
        </div>

        {/* FOOTER */}
        {footer && (
          <div className="border-t border-[#E5E7EB] bg-[#FAFAFA] px-[17px] py-[12px]">
            {footer}
          </div>
        )}

      </div>
    </div>
  );
};

// =====================================================
// INPUT
// =====================================================

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}) => {
  return (
    <div className="mb-[11px]">

      <label className="mb-[5px] block text-[9px] font-semibold text-[#6B7280]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="h-[43px] w-full rounded-[12px] border border-[#E5E7EB] bg-white px-[12px] text-[11px] text-[#111827] outline-none transition focus:border-[#FFA726] focus:ring-2 focus:ring-[#FFA726]/10 disabled:bg-[#F3F4F6]"
      />

    </div>
  );
};

// =====================================================
// READ ONLY FIELD
// =====================================================

const ReadOnlyField = ({
  label,
  value,
  icon: Icon,
}) => {
  return (
    <div className="mb-[11px]">

      <label className="mb-[5px] block text-[9px] font-semibold text-[#6B7280]">
        {label}
      </label>

      <div className="flex min-h-[43px] w-full items-center gap-[9px] rounded-[12px] border border-[#E5E7EB] bg-[#F8FAFC] px-[12px]">

        {Icon && (
          <Icon
            size={15}
            className="shrink-0 text-[#6B7280]"
          />
        )}

        <span className="text-[11px] font-medium text-[#111827]">
          {value || "Not available"}
        </span>

      </div>

    </div>
  );
};

// =====================================================
// MAIN PROFILE
// =====================================================

const DriverProfile = () => {
  const navigate = useNavigate();

  const { captain } = useContext(CaptainDataContext);

  const [profile, setProfile] = useState(captain || null);

  const [loading, setLoading] = useState(true);

  // ===================================================
  // POPUP STATE
  // ===================================================

  const [activePopup, setActivePopup] = useState(null);

  // ===================================================
  // LOGOUT
  // ===================================================

  const [showLogout, setShowLogout] = useState(false);

  const [loggingOut, setLoggingOut] = useState(false);

  // ===================================================
  // EDIT PROFILE
  // ===================================================

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);

  // ===================================================
  // GPAY QR
  // ===================================================

  const [gpayQrImage, setGpayQrImage] = useState(null);
  const [gpayQrPreview, setGpayQrPreview] = useState("");

  // ===================================================
  // SETTINGS
  // ===================================================

  const [rideNotifications, setRideNotifications] =
    useState(true);

  const [soundNotifications, setSoundNotifications] =
    useState(true);

  const [earningNotifications, setEarningNotifications] =
    useState(true);

  // ===================================================
  // LOAD PROFILE
  // ===================================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await apiClient.get(
          "/captains/profile",
          withCaptainAuth()
        );

        const data = stripApiEnvelope(
          response.data
        );

        if (data) {
          setProfile(data);

          // Load existing QR if backend already provides one
          const existingQr =
            data?.gpayQrImage ||
            data?.gpayQr ||
            data?.paymentQr ||
            data?.bankDetails?.gpayQrImage ||
            data?.bankDetails?.gpayQr ||
            "";

          if (existingQr) {
            setGpayQrPreview(existingQr);
          }
        }
      } catch (error) {
        console.error(
          "Profile loading failed:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ===================================================
  // VALUES
  // ===================================================

  const driverName =
    profile?.name ||
    captain?.name ||
    "Driver Name";

  const phone =
    profile?.phone ||
    captain?.phone ||
    "+91 98765 43210";

  const email =
    profile?.email ||
    captain?.email ||
    "driver@example.com";

  // ===================================================
  // VEHICLE DETAILS
  // ===================================================

  const vehicleNumber =
    profile?.vehicleNumber ||
    profile?.vehicle?.vehicleNumber ||
    profile?.vehicle?.registrationNumber ||
    captain?.vehicleNumber ||
    captain?.vehicle?.vehicleNumber ||
    "Not available";

  const vehicleType =
    profile?.vehicleType ||
    profile?.vehicle?.vehicleType ||
    profile?.vehicle?.type ||
    captain?.vehicleType ||
    captain?.vehicle?.vehicleType ||
    "Not available";

  const rating =
    profile?.rating ||
    captain?.rating ||
    "4.9";

  // ===================================================
  // DOCUMENT DETAILS
  // ===================================================

  const documents =
    profile?.documents ||
    profile?.driverDocuments ||
    captain?.documents ||
    captain?.driverDocuments ||
    {};

  const drivingLicense =
    documents?.drivingLicense ||
    documents?.license ||
    documents?.driving_license ||
    profile?.drivingLicense ||
    profile?.license ||
    null;

  const vehicleRC =
    documents?.vehicleRC ||
    documents?.rc ||
    documents?.registrationCertificate ||
    documents?.registration_certificate ||
    profile?.vehicleRC ||
    profile?.rc ||
    null;

  const vehicleInsurance =
    documents?.vehicleInsurance ||
    documents?.insurance ||
    documents?.vehicle_insurance ||
    profile?.vehicleInsurance ||
    profile?.insurance ||
    null;

  // ===================================================
  // DOCUMENT STATUS
  // ===================================================

  const getDocumentStatus = (document) => {
    if (!document) {
      return "Pending";
    }

    if (
      document === true ||
      document === "verified" ||
      document === "Verified"
    ) {
      return "Verified";
    }

    if (
      typeof document === "object" &&
      (
        document.verified === true ||
        document.isVerified === true ||
        document.status === "verified" ||
        document.status === "Verified" ||
        document.status === "approved" ||
        document.status === "Approved"
      )
    ) {
      return "Verified";
    }

    if (
      typeof document === "string" &&
      document.trim() !== ""
    ) {
      return "Uploaded";
    }

    if (
      typeof document === "object" &&
      document.url
    ) {
      return "Uploaded";
    }

    return "Pending";
  };

  const licenseStatus =
    getDocumentStatus(drivingLicense);

  const rcStatus =
    getDocumentStatus(vehicleRC);

  const insuranceStatus =
    getDocumentStatus(vehicleInsurance);

  const allDocumentsVerified =
    licenseStatus === "Verified" &&
    rcStatus === "Verified" &&
    insuranceStatus === "Verified";

  const documentStatus =
    profile?.documentsVerified ||
    profile?.isDocumentsVerified
      ? "4/4 Verified"
      : allDocumentsVerified
      ? "3/3 Verified"
      : "Pending";

  // ===================================================
  // OPEN EDIT PROFILE
  // ===================================================

  const openEditProfile = () => {
    setEditName(driverName);
    setEditEmail(email);
    setEditPhone(phone);

    setActivePopup("edit");
  };

  // ===================================================
  // SAVE PROFILE
  // ===================================================

  const handleSaveProfile = async () => {
    if (savingProfile) return;

    if (!editName.trim()) {
      alert("Please enter your name.");
      return;
    }

    setSavingProfile(true);

    try {
      const response = await apiClient.patch(
        "/captains/profile",
        {
          name: editName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim(),
        },
        withCaptainAuth()
      );

      const data = stripApiEnvelope(
        response.data
      );

      if (data) {
        setProfile(data);
      } else {
        setProfile((prev) => ({
          ...prev,
          name: editName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim(),
        }));
      }

      setActivePopup(null);
    } catch (error) {
      console.error(
        "Profile update failed:",
        error
      );

      setProfile((prev) => ({
        ...prev,
        name: editName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
      }));

      setActivePopup(null);
    } finally {
      setSavingProfile(false);
    }
  };

  // ===================================================
  // GPAY QR UPLOAD
  // ===================================================

  const handleGpayQrUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Only images
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid QR image.");
      return;
    }

    // 5 MB maximum
    if (file.size > 5 * 1024 * 1024) {
      alert("QR image must be less than 5 MB.");
      return;
    }

    setGpayQrImage(file);

    const previewUrl = URL.createObjectURL(file);

    setGpayQrPreview(previewUrl);
  };

  // ===================================================
  // REMOVE GPAY QR
  // ===================================================

  const handleRemoveGpayQr = () => {
    setGpayQrImage(null);
    setGpayQrPreview("");
  };

  // ===================================================
  // SAVE GPAY QR
  // ===================================================

  const handleSaveGpayQr = async () => {
    if (!gpayQrImage && !gpayQrPreview) {
      alert("Please select a GPay QR image.");
      return;
    }

    // Frontend preview/local state for now.
    setProfile((prev) => ({
      ...prev,
      gpayQrImage: gpayQrPreview,
    }));

    setActivePopup(null);
  };

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await apiClient.post(
        "/captains/logout",
        {},
        withCaptainAuth()
      );
    } catch (error) {
      console.log(
        "Logout API unavailable, continuing locally."
      );
    }

    try {
      localStorage.removeItem("captainToken");
      localStorage.removeItem("token");
      localStorage.removeItem("captain");
    } catch {
      // Ignore storage errors.
    }

    navigate("/captain-login", {
      replace: true,
    });
  };

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="fixed inset-0 flex w-full justify-center overflow-hidden bg-[#E5E7EB]">

      <div className="flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-[#F7FAFA] text-[#17202A] shadow-xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="flex shrink-0 items-center justify-between bg-[#111827] px-[16px] pb-[13px] pt-[13px] text-white">

          <button
            type="button"
            onClick={() => navigate("/captain-home")}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/10 bg-white/[0.06]"
          >
            <ArrowLeft
              size={19}
              strokeWidth={1.8}
            />
          </button>

          <div className="text-center">

            <h1 className="text-[15px] font-bold">
              Profile
            </h1>

          </div>

          <button
            type="button"
            onClick={() => setActivePopup("settings")}
            className="relative flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/10 bg-white/[0.06]"
          >

            <Bell
              size={18}
              strokeWidth={1.8}
            />

            <span className="absolute right-[8px] top-[7px] h-[6px] w-[6px] rounded-full bg-[#FFA726]" />

          </button>

        </header>

        {/* =================================================
            SCROLLABLE CONTENT
        ================================================= */}

        <main className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-[14px] pb-[18px]">

          {/* =================================================
              PROFILE HERO
          ================================================= */}

          <section className="mt-[14px] overflow-hidden rounded-[18px] border border-[#E5E7EB] bg-white shadow-[0_2px_8px_rgba(17,24,39,0.04)]">

            <div className="relative px-[15px] pb-[16px] pt-[18px]">

              <div className="pointer-events-none absolute right-[-35px] top-[-35px] h-[110px] w-[110px] rounded-full bg-[#FFA726]/10 blur-2xl" />

              <div className="relative flex items-center gap-[13px]">

                {/* AVATAR */}

                <div className="relative">

                  <div className="flex h-[64px] w-[64px] items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-[#F3F4F6] shadow-sm">

                    {profile?.profilePhoto ? (
                      <img
                        src={profile.profilePhoto}
                        alt="Driver profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound
                        size={31}
                        strokeWidth={1.6}
                        className="text-[#6B7280]"
                      />
                    )}

                  </div>

                  <span className="absolute bottom-[1px] right-[1px] h-[14px] w-[14px] rounded-full border-[3px] border-white bg-[#1FAA59]" />

                </div>

                {/* DRIVER DETAILS */}

                <div className="min-w-0 flex-1">

                  <div className="flex items-center gap-[7px]">

                    <h2 className="truncate text-[16px] font-bold text-[#111827]">
                      {driverName}
                    </h2>

                    <ShieldCheck
                      size={15}
                      className="shrink-0 text-[#1FAA59]"
                      fill="#E8F7EF"
                    />

                  </div>

                  <p className="mt-[3px] text-[10px] text-[#6B7280]">
                    {phone}
                  </p>

                  <div className="mt-[6px] flex items-center gap-[7px]">

                    <span className="inline-flex items-center gap-[3px] rounded-full bg-[#FFF3E0] px-[7px] py-[3px] text-[8px] font-semibold text-[#C77700]">

                      <Star
                        size={10}
                        fill="currentColor"
                      />

                      {rating}

                    </span>

                    <span className="rounded-full bg-[#E8F7EF] px-[7px] py-[3px] text-[8px] font-semibold text-[#1FAA59]">
                      Verified Driver
                    </span>

                  </div>

                </div>

                {/* EDIT */}

                <button
                  type="button"
                  onClick={openEditProfile}
                  className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#FFA726] hover:text-[#FFA726]"
                >
                  <Pencil
                    size={15}
                    strokeWidth={1.8}
                  />
                </button>

              </div>

            </div>

            {/* EMAIL */}

            <div className="border-t border-[#E5E7EB] px-[15px] py-[11px]">

              <div className="flex items-center gap-[7px] text-[#6B7280]">

                <Mail size={12} />

                <span className="truncate text-[9px]">
                  {email}
                </span>

              </div>

            </div>

          </section>

          {/* =================================================
              VEHICLE
          ================================================= */}

          <section className="mt-[14px]">

            <p className="mb-[7px] px-[3px] text-[10px] font-bold uppercase tracking-[0.08em] text-[#6B7280]">
              Vehicle
            </p>

            <div className="overflow-hidden rounded-[17px] border border-[#E5E7EB] bg-white">

              <ProfileRow
                icon={CarFront}
                title="Vehicle details"
                subtitle={`${vehicleNumber} • ${vehicleType}`}
                onClick={() =>
                  setActivePopup("vehicle")
                }
              />

              <div className="mx-[14px] border-t border-[#E5E7EB]" />

              <ProfileRow
                icon={FileCheck2}
                title="Documents"
                subtitle="License and vehicle documents"
                rightText={documentStatus}
                rightColor={
                  documentStatus.includes("Verified")
                    ? "#1FAA59"
                    : "#FFA726"
                }
                onClick={() =>
                  setActivePopup("documents")
                }
              />

            </div>

          </section>

          {/* =================================================
              PAYMENT QR
          ================================================= */}

          <section className="mt-[14px]">

            <p className="mb-[7px] px-[3px] text-[10px] font-bold uppercase tracking-[0.08em] text-[#6B7280]">
              Payment
            </p>

            <div className="overflow-hidden rounded-[17px] border border-[#E5E7EB] bg-white">

              <ProfileRow
                icon={CreditCard}
                title="Payment QR Code"
                subtitle={
                  gpayQrPreview
                    ? "Payment QR code added"
                    : "Add your payment QR code"
                }
                rightText={
                  gpayQrPreview
                    ? "Added"
                    : "Add"
                }
                rightColor={
                  gpayQrPreview
                    ? "#1FAA59"
                    : "#FFA726"
                }
                onClick={() =>
                  setActivePopup("bank")
                }
              />

            </div>

          </section>

          {/* =================================================
              APP
          ================================================= */}

          <section className="mt-[14px]">

            <p className="mb-[7px] px-[3px] text-[10px] font-bold uppercase tracking-[0.08em] text-[#6B7280]">
              App
            </p>

            <div className="overflow-hidden rounded-[17px] border border-[#E5E7EB] bg-white">

              <ProfileRow
                icon={Settings}
                title="App settings"
                subtitle="Notifications and preferences"
                onClick={() =>
                  setActivePopup("settings")
                }
              />

              <div className="mx-[14px] border-t border-[#E5E7EB]" />

              <ProfileRow
                icon={HelpCircle}
                title="Help & support"
                subtitle="Get help with your account"
                onClick={() =>
                  setActivePopup("support")
                }
              />

            </div>

          </section>

          {/* =================================================
              LOGOUT
          ================================================= */}

          <section className="mt-[14px]">

            <button
              type="button"
              onClick={() => setShowLogout(true)}
              className="flex w-full items-center gap-[12px] rounded-[17px] border border-[#F3D0D0] bg-white px-[14px] py-[14px] text-left transition-colors hover:bg-[#FDECEC] active:bg-[#FDECEC]"
            >

              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-[#FDECEC]">

                <LogOut
                  size={18}
                  className="text-[#E5484D]"
                  strokeWidth={1.8}
                />

              </div>

              <div className="flex-1">

                <p className="text-[12px] font-semibold text-[#E5484D]">
                  Logout
                </p>

                <p className="mt-[2px] text-[9px] text-[#6B7280]">
                  Sign out from this device
                </p>

              </div>

            </button>

          </section>

          {/* VERSION */}

          <p className="py-[18px] text-center text-[8px] text-[#9CA3AF]">
            RideEasy Driver • Version 1.0.0
          </p>

        </main>

        {/* =================================================
            BOTTOM NAV
        ================================================= */}

        <BottomNav navigate={navigate} />

        {/* =================================================
            EDIT PROFILE POPUP
        ================================================= */}

        {activePopup === "edit" && (
          <Popup
            title="Edit profile"
            subtitle="Update your personal information"
            icon={UserRound}
            onClose={() => setActivePopup(null)}
            footer={
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="flex h-[45px] w-full items-center justify-center gap-[7px] rounded-[12px] bg-[#FFA726] text-[11px] font-bold text-[#111827] disabled:opacity-60"
              >

                {savingProfile ? (
                  <>
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    Save changes
                  </>
                )}

              </button>
            }
          >

            <Input
              label="Full name"
              value={editName}
              onChange={(e) =>
                setEditName(e.target.value)
              }
              placeholder="Enter your name"
            />

            <Input
              label="Phone number"
              value={editPhone}
              onChange={(e) =>
                setEditPhone(e.target.value)
              }
              placeholder="Enter phone number"
              type="tel"
            />

            <Input
              label="Email address"
              value={editEmail}
              onChange={(e) =>
                setEditEmail(e.target.value)
              }
              placeholder="Enter email address"
              type="email"
            />

            <div className="mt-[5px] rounded-[12px] bg-[#F8FAFC] p-[11px]">

              <div className="flex items-center gap-[7px]">

                <ShieldCheck
                  size={15}
                  className="text-[#1FAA59]"
                />

                <p className="text-[9px] font-semibold text-[#111827]">
                  Verified driver account
                </p>

              </div>

              <p className="mt-[4px] text-[8px] leading-[13px] text-[#6B7280]">
                Your verified account information is protected.
              </p>

            </div>

          </Popup>
        )}

        {/* =================================================
            VEHICLE POPUP
        ================================================= */}

        {activePopup === "vehicle" && (
          <Popup
            title="Vehicle details"
            subtitle="Vehicle information fetched from your account"
            icon={CarFront}
            onClose={() => setActivePopup(null)}
          >

            <div className="mb-[12px] flex items-center gap-[9px] rounded-[12px] bg-[#E8F7EF] p-[10px]">

              <ShieldCheck
                size={16}
                className="shrink-0 text-[#1FAA59]"
              />

              <p className="text-[8px] leading-[13px] text-[#168447]">
                Vehicle details are managed from your registered driver account and cannot be edited here.
              </p>

            </div>

            <ReadOnlyField
              label="Vehicle number"
              value={vehicleNumber}
              icon={CarFront}
            />

            <ReadOnlyField
              label="Vehicle type"
              value={vehicleType}
              icon={CarFront}
            />

            <div className="rounded-[13px] border border-[#E5E7EB] bg-[#F8FAFC] p-[12px]">

              <div className="flex items-center gap-[9px]">

                <div className="flex h-[35px] w-[35px] items-center justify-center rounded-[10px] bg-white">

                  <CarFront
                    size={17}
                    className="text-[#6B7280]"
                  />

                </div>

                <div className="min-w-0">

                  <p className="text-[10px] font-bold text-[#111827]">
                    Registered vehicle
                  </p>

                  <p className="mt-[2px] truncate text-[8px] text-[#6B7280]">
                    {vehicleNumber} • {vehicleType}
                  </p>

                </div>

              </div>

            </div>

          </Popup>
        )}

        {/* =================================================
            DOCUMENTS POPUP
        ================================================= */}

        {activePopup === "documents" && (
          <Popup
            title="Documents"
            subtitle="Documents fetched from your driver account"
            icon={FileCheck2}
            onClose={() => setActivePopup(null)}
          >

            <div className="mb-[12px] flex items-center gap-[7px] rounded-[11px] bg-[#FFF8EC] p-[10px]">

              <ShieldCheck
                size={15}
                className="shrink-0 text-[#FFA726]"
              />

              <p className="text-[8px] leading-[13px] text-[#8A5A00]">
                Documents are managed and verified by RideEasy. They cannot be edited from this screen.
              </p>

            </div>

            {/* LICENSE */}

            <div className="mb-[10px] rounded-[14px] border border-[#E5E7EB] bg-white p-[12px]">

              <div className="flex items-center gap-[10px]">

                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-[#F3F4F6]">

                  <FileText
                    size={18}
                    className="text-[#6B7280]"
                  />

                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-[11px] font-semibold text-[#111827]">
                    Driving License
                  </p>

                  <p className="mt-[2px] text-[8px] text-[#6B7280]">
                    Required document
                  </p>

                </div>

                <span
                  className={`rounded-full px-[8px] py-[4px] text-[8px] font-semibold ${
                    licenseStatus === "Verified"
                      ? "bg-[#E8F7EF] text-[#1FAA59]"
                      : "bg-[#FFF3E0] text-[#C77700]"
                  }`}
                >
                  {licenseStatus}
                </span>

              </div>

              {drivingLicense &&
              typeof drivingLicense === "object" &&
              (drivingLicense.number ||
                drivingLicense.documentNumber) ? (
                <div className="mt-[10px] rounded-[10px] bg-[#F8FAFC] p-[9px]">

                  <p className="text-[8px] text-[#6B7280]">
                    License number
                  </p>

                  <p className="mt-[2px] text-[10px] font-semibold text-[#111827]">
                    {drivingLicense.number ||
                      drivingLicense.documentNumber}
                  </p>

                </div>
              ) : null}

            </div>

            {/* RC */}

            <div className="mb-[10px] rounded-[14px] border border-[#E5E7EB] bg-white p-[12px]">

              <div className="flex items-center gap-[10px]">

                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-[#F3F4F6]">

                  <CreditCard
                    size={18}
                    className="text-[#6B7280]"
                  />

                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-[11px] font-semibold text-[#111827]">
                    Vehicle RC
                  </p>

                  <p className="mt-[2px] text-[8px] text-[#6B7280]">
                    Registration certificate
                  </p>

                </div>

                <span
                  className={`rounded-full px-[8px] py-[4px] text-[8px] font-semibold ${
                    rcStatus === "Verified"
                      ? "bg-[#E8F7EF] text-[#1FAA59]"
                      : "bg-[#FFF3E0] text-[#C77700]"
                  }`}
                >
                  {rcStatus}
                </span>

              </div>

              {vehicleRC &&
              typeof vehicleRC === "object" &&
              (vehicleRC.number ||
                vehicleRC.documentNumber) ? (
                <div className="mt-[10px] rounded-[10px] bg-[#F8FAFC] p-[9px]">

                  <p className="text-[8px] text-[#6B7280]">
                    Registration number
                  </p>

                  <p className="mt-[2px] text-[10px] font-semibold text-[#111827]">
                    {vehicleRC.number ||
                      vehicleRC.documentNumber}
                  </p>

                </div>
              ) : null}

            </div>

            {/* INSURANCE */}

            <div className="rounded-[14px] border border-[#E5E7EB] bg-white p-[12px]">

              <div className="flex items-center gap-[10px]">

                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-[#F3F4F6]">

                  <ShieldCheck
                    size={18}
                    className="text-[#6B7280]"
                  />

                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-[11px] font-semibold text-[#111827]">
                    Vehicle Insurance
                  </p>

                  <p className="mt-[2px] text-[8px] text-[#6B7280]">
                    Valid insurance document
                  </p>

                </div>

                <span
                  className={`rounded-full px-[8px] py-[4px] text-[8px] font-semibold ${
                    insuranceStatus === "Verified"
                      ? "bg-[#E8F7EF] text-[#1FAA59]"
                      : "bg-[#FFF3E0] text-[#C77700]"
                  }`}
                >
                  {insuranceStatus}
                </span>

              </div>

              {vehicleInsurance &&
              typeof vehicleInsurance === "object" &&
              (vehicleInsurance.number ||
                vehicleInsurance.documentNumber ||
                vehicleInsurance.policyNumber) ? (
                <div className="mt-[10px] rounded-[10px] bg-[#F8FAFC] p-[9px]">

                  <p className="text-[8px] text-[#6B7280]">
                    Policy number
                  </p>

                  <p className="mt-[2px] text-[10px] font-semibold text-[#111827]">
                    {vehicleInsurance.number ||
                      vehicleInsurance.documentNumber ||
                      vehicleInsurance.policyNumber}
                  </p>

                </div>
              ) : null}

            </div>

            <div className="mt-[12px] flex items-center gap-[7px] rounded-[11px] bg-[#E8F7EF] p-[10px]">

              <ShieldCheck
                size={15}
                className="shrink-0 text-[#1FAA59]"
              />

              <p className="text-[8px] leading-[13px] text-[#168447]">
                Your documents are securely stored and reviewed by RideEasy.
              </p>

            </div>

          </Popup>
        )}

        {/* =================================================
            GPAY QR POPUP
        ================================================= */}

        {activePopup === "bank" && (
          <Popup
            title="Payment QR Code"
            subtitle="Add your payment QR code"
            icon={CreditCard}
            onClose={() => setActivePopup(null)}
            footer={
              <button
                type="button"
                onClick={handleSaveGpayQr}
                className="flex h-[45px] w-full items-center justify-center gap-[7px] rounded-[12px] bg-[#FFA726] text-[11px] font-bold text-[#111827]"
              >
                <Save size={15} />
                Save QR Code
              </button>
            }
          >

            {/* INFO */}

            <div className="mb-[14px] flex items-center gap-[8px] rounded-[12px] bg-[#E8F7EF] p-[10px]">

              <ShieldCheck
                size={16}
                className="shrink-0 text-[#1FAA59]"
              />

              <p className="text-[8px] leading-[13px] text-[#168447]">
                Upload your Payment QR code so payments can be made directly to you.
              </p>

            </div>

            {/* QR PREVIEW */}

            {gpayQrPreview ? (
              <div className="flex flex-col items-center">

                <div className="relative flex h-[220px] w-[220px] items-center justify-center overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white p-[10px] shadow-sm">

                  <img
                    src={gpayQrPreview}
                    alt="GPay QR Code"
                    className="h-full w-full object-contain"
                  />

                  {/* REMOVE BUTTON */}

                  <button
                    type="button"
                    onClick={handleRemoveGpayQr}
                    className="absolute right-[8px] top-[8px] flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#FDECEC] text-[#E5484D] shadow-sm"
                  >
                    <X size={15} />
                  </button>

                </div>

                <p className="mt-[10px] text-center text-[10px] font-semibold text-[#111827]">
                  Payment QR Code
                </p>

                <p className="mt-[3px] text-center text-[8px] text-[#6B7280]">
                  Your QR code is ready to save.
                </p>

                {/* CHANGE BUTTON */}

                <label
                  htmlFor="gpay-qr-upload"
                  className="mt-[11px] flex h-[40px] cursor-pointer items-center justify-center gap-[6px] rounded-[11px] border border-[#E5E7EB] bg-white px-[16px] text-[10px] font-semibold text-[#111827]"
                >
                  <Pencil size={14} />
                  Change QR Code
                </label>

              </div>
            ) : (
              /* UPLOAD AREA */

              <label
                htmlFor="gpay-qr-upload"
                className="flex cursor-pointer flex-col items-center justify-center rounded-[16px] border border-dashed border-[#D1D5DB] bg-[#F8FAFC] px-[15px] py-[35px] transition hover:border-[#FFA726] hover:bg-[#FFF8EC]"
              >

                <div className="flex h-[55px] w-[55px] items-center justify-center rounded-[15px] bg-[#FFF3E0]">

                  <CreditCard
                    size={27}
                    strokeWidth={1.7}
                    className="text-[#FFA726]"
                  />

                </div>

                <p className="mt-[12px] text-[12px] font-bold text-[#111827]">
                  Upload Payment QR Code
                </p>

                <p className="mt-[5px] text-center text-[9px] text-[#6B7280]">
                  Select the QR image from your device
                </p>

                <span className="mt-[11px] rounded-[9px] bg-[#111827] px-[14px] py-[8px] text-[9px] font-semibold text-white">
                  Select QR Image
                </span>

              </label>
            )}

            {/* HIDDEN FILE INPUT */}

            <input
              id="gpay-qr-upload"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleGpayQrUpload}
              className="hidden"
            />

            {/* SECURITY */}

            <div className="mt-[14px] flex items-center gap-[8px] rounded-[12px] bg-[#F8FAFC] p-[10px]">

              <Lock
                size={15}
                className="shrink-0 text-[#1FAA59]"
              />

              <p className="text-[8px] leading-[13px] text-[#6B7280]">
                Only PNG, JPG or JPEG images up to 5 MB are accepted.
              </p>

            </div>

          </Popup>
        )}

        {/* =================================================
            SETTINGS POPUP
        ================================================= */}

        {activePopup === "settings" && (
          <Popup
            title="App settings"
            subtitle="Notifications and preferences"
            icon={Settings}
            onClose={() => setActivePopup(null)}
          >

            {/* RIDE NOTIFICATIONS */}

            <div className="flex items-center gap-[10px] border-b border-[#E5E7EB] py-[12px]">

              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-[#F3F4F6]">

                <Bell
                  size={18}
                  className="text-[#6B7280]"
                />

              </div>

              <div className="flex-1">

                <p className="text-[11px] font-semibold text-[#111827]">
                  Ride notifications
                </p>

                <p className="mt-[2px] text-[8px] text-[#6B7280]">
                  New ride request alerts
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setRideNotifications(
                    !rideNotifications
                  )
                }
                className={`relative h-[23px] w-[42px] rounded-full transition ${
                  rideNotifications
                    ? "bg-[#1FAA59]"
                    : "bg-[#D1D5DB]"
                }`}
              >

                <span
                  className={`absolute top-[3px] h-[17px] w-[17px] rounded-full bg-white shadow-sm transition ${
                    rideNotifications
                      ? "right-[3px]"
                      : "left-[3px]"
                  }`}
                />

              </button>

            </div>

            {/* SOUND */}

            <div className="flex items-center gap-[10px] border-b border-[#E5E7EB] py-[12px]">

              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-[#F3F4F6]">

                <MessageCircle
                  size={18}
                  className="text-[#6B7280]"
                />

              </div>

              <div className="flex-1">

                <p className="text-[11px] font-semibold text-[#111827]">
                  Notification sound
                </p>

                <p className="mt-[2px] text-[8px] text-[#6B7280]">
                  Play sound for alerts
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSoundNotifications(
                    !soundNotifications
                  )
                }
                className={`relative h-[23px] w-[42px] rounded-full transition ${
                  soundNotifications
                    ? "bg-[#1FAA59]"
                    : "bg-[#D1D5DB]"
                }`}
              >

                <span
                  className={`absolute top-[3px] h-[17px] w-[17px] rounded-full bg-white shadow-sm transition ${
                    soundNotifications
                      ? "right-[3px]"
                      : "left-[3px]"
                  }`}
                />

              </button>

            </div>

            {/* EARNINGS */}

            <div className="flex items-center gap-[10px] py-[12px]">

              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-[#F3F4F6]">

                <WalletCards
                  size={18}
                  className="text-[#6B7280]"
                />

              </div>

              <div className="flex-1">

                <p className="text-[11px] font-semibold text-[#111827]">
                  Earning updates
                </p>

                <p className="mt-[2px] text-[8px] text-[#6B7280]">
                  Daily earning summaries
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setEarningNotifications(
                    !earningNotifications
                  )
                }
                className={`relative h-[23px] w-[42px] rounded-full transition ${
                  earningNotifications
                    ? "bg-[#1FAA59]"
                    : "bg-[#D1D5DB]"
                }`}
              >

                <span
                  className={`absolute top-[3px] h-[17px] w-[17px] rounded-full bg-white shadow-sm transition ${
                    earningNotifications
                      ? "right-[3px]"
                      : "left-[3px]"
                  }`}
                />

              </button>

            </div>

            <button
              type="button"
              onClick={() => setActivePopup(null)}
              className="mt-[8px] h-[42px] w-full rounded-[11px] bg-[#111827] text-[10px] font-semibold text-white"
            >
              Done
            </button>

          </Popup>
        )}

        {/* =================================================
            HELP & SUPPORT POPUP
        ================================================= */}

        {activePopup === "support" && (
          <Popup
            title="Help & support"
            subtitle="Get help with your RideEasy account"
            icon={HelpCircle}
            onClose={() => setActivePopup(null)}
          >

            <div className="space-y-[9px]">

              {/* FAQ */}

              <button
                type="button"
                className="flex w-full items-center gap-[10px] rounded-[13px] border border-[#E5E7EB] p-[12px] text-left hover:bg-[#FFF8EC]"
              >

                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[#F3F4F6]">

                  <HelpCircle
                    size={18}
                    className="text-[#6B7280]"
                  />

                </div>

                <div className="flex-1">

                  <p className="text-[11px] font-semibold text-[#111827]">
                    Frequently asked questions
                  </p>

                  <p className="mt-[2px] text-[8px] text-[#6B7280]">
                    Find answers to common questions
                  </p>

                </div>

                <ChevronRight
                  size={16}
                  className="text-[#9CA3AF]"
                />

              </button>

              {/* CHAT */}

              <button
                type="button"
                onClick={() =>
                  alert(
                    "RideEasy support chat will be available soon."
                  )
                }
                className="flex w-full items-center gap-[10px] rounded-[13px] border border-[#E5E7EB] p-[12px] text-left hover:bg-[#FFF8EC]"
              >

                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[#E8F7EF]">

                  <MessageCircle
                    size={18}
                    className="text-[#1FAA59]"
                  />

                </div>

                <div className="flex-1">

                  <p className="text-[11px] font-semibold text-[#111827]">
                    Chat with support
                  </p>

                  <p className="mt-[2px] text-[8px] text-[#6B7280]">
                    Talk to RideEasy support
                  </p>

                </div>

                <ChevronRight
                  size={16}
                  className="text-[#9CA3AF]"
                />

              </button>

              {/* CALL */}

              <button
                type="button"
                onClick={() =>
                  (window.location.href =
                    "tel:+911800000000")
                }
                className="flex w-full items-center gap-[10px] rounded-[13px] border border-[#E5E7EB] p-[12px] text-left hover:bg-[#FFF8EC]"
              >

                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[#FFF3E0]">

                  <Phone
                    size={18}
                    className="text-[#FFA726]"
                  />

                </div>

                <div className="flex-1">

                  <p className="text-[11px] font-semibold text-[#111827]">
                    Call support
                  </p>

                  <p className="mt-[2px] text-[8px] text-[#6B7280]">
                    Contact driver support
                  </p>

                </div>

                <ChevronRight
                  size={16}
                  className="text-[#9CA3AF]"
                />

              </button>

              <div className="rounded-[13px] bg-[#F8FAFC] p-[11px]">

                <p className="text-[9px] font-semibold text-[#111827]">
                  RideEasy Driver Support
                </p>

                <p className="mt-[3px] text-[8px] leading-[13px] text-[#6B7280]">
                  We're here to help with rides, payments,
                  documents and your driver account.
                </p>

              </div>

            </div>

          </Popup>
        )}

        {/* =================================================
            LOGOUT MODAL
        ================================================= */}

        {showLogout && (
          <div
            className="fixed inset-0 z-[300] flex items-end justify-center bg-[#111827]/50 px-[12px] pb-[12px] backdrop-blur-[2px]"
            onClick={() => setShowLogout(false)}
          >

            <div
              className="w-full max-w-[406px] overflow-hidden rounded-[22px] bg-white shadow-2xl"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="px-[18px] pb-[18px] pt-[20px]">

                <div className="flex items-start justify-between">

                  <div>

                    <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#FDECEC]">

                      <LogOut
                        size={20}
                        className="text-[#E5484D]"
                      />

                    </div>

                    <h2 className="mt-[13px] text-[17px] font-bold text-[#111827]">
                      Logout?
                    </h2>

                    <p className="mt-[4px] max-w-[280px] text-[10px] leading-[16px] text-[#6B7280]">
                      Are you sure you want to sign out of
                      your RideEasy driver account?
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowLogout(false)
                    }
                    className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#F3F4F6] text-[#6B7280]"
                  >
                    <X size={16} />
                  </button>

                </div>

                <div className="mt-[18px] grid grid-cols-2 gap-[9px]">

                  <button
                    type="button"
                    onClick={() =>
                      setShowLogout(false)
                    }
                    className="h-[47px] rounded-[13px] border border-[#E5E7EB] bg-white text-[12px] font-semibold text-[#111827]"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex h-[47px] items-center justify-center gap-[7px] rounded-[13px] bg-[#E5484D] text-[12px] font-bold text-white disabled:opacity-60"
                  >

                    {loggingOut ? (
                      <>
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                        Logging out
                      </>
                    ) : (
                      <>
                        <LogOut size={16} />
                        Logout
                      </>
                    )}

                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default DriverProfile;

