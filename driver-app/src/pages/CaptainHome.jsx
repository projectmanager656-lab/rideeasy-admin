import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { Geolocation } from "@capacitor/geolocation";
import { LocalNotifications } from "@capacitor/local-notifications";

import { useNavigate } from "react-router-dom";

import {
  Bell,
  Power,
  WalletCards,
  Home,
  CarTaxiFront,
  UserCircle,
  MapPin,
  ChevronRight,
  Navigation,
  X,
  IndianRupee,
  UserRound,
  Star,
  Banknote,
  CheckCircle2,
  LocateFixed,
  History,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import { CaptainDataContext } from "../context/CaptainContext";
import {
  apiClient,
  withCaptainAuth,
} from "../services/http";
import { stripApiEnvelope } from "../utils/apiBody";

// =====================================================
// RIDE EASY DESIGN TOKENS
// =====================================================

const COLORS = {
  night: "#111827",
  nightDeep: "#0B1220",
  card: "#172033",
  cardSoft: "#1F2937",
  amber: "#FFA726",
  green: "#1FAA59",
  red: "#E5484D",
  white: "#FAFAFA",
  grey: "#6B7280",
  greyLight: "#9CA3AF",
  border: "rgba(255,255,255,0.08)",
};

// =====================================================
// LEAFLET DEFAULT MARKER
// =====================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// =====================================================
// MAP CENTER
// =====================================================

const MapCenter = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position, map]);

  return null;
};

// =====================================================
// DEMO RIDE
// =====================================================

const createDemoRide = () => ({
  _id: `demo-ride-${Date.now()}`,

  user: {
    name: "Rahul Patil",
  },

  customerName: "Rahul Patil",

  pickupLocation: "Kolhapur Railway Station",

  dropLocation: "Rankala Lake",

  pickup: {
    coordinates: [74.2433, 16.705],
  },

  drop: {
    coordinates: [74.2169, 16.695],
  },

  distance: 4.8,

  duration: 780,

  price: 145,

  paymentMethod: "Cash",
});

// =====================================================
// DISTANCE HELPER
// =====================================================

const toRadians = (value) => {
  return (value * Math.PI) / 180;
};

const calculateDistanceKm = (
  driverLatitude,
  driverLongitude,
  pickupLatitude,
  pickupLongitude
) => {
  if (
    driverLatitude == null ||
    driverLongitude == null ||
    pickupLatitude == null ||
    pickupLongitude == null
  ) {
    return null;
  }

  const earthRadius = 6371;

  const latitudeDifference = toRadians(
    pickupLatitude - driverLatitude
  );

  const longitudeDifference = toRadians(
    pickupLongitude - driverLongitude
  );

  const driverLatRadians =
    toRadians(driverLatitude);

  const pickupLatRadians =
    toRadians(pickupLatitude);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(driverLatRadians) *
      Math.cos(pickupLatRadians) *
      Math.sin(longitudeDifference / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
};

// =====================================================
// DRIVER HOME
// =====================================================

const DriverHome = () => {
  const navigate = useNavigate();

  const {
    captain,
    isOnline: contextIsOnline,
  } = useContext(CaptainDataContext);

  // ===================================================
  // ONLINE STATE
  // ===================================================

  const [localOnline, setLocalOnline] =
    useState(Boolean(contextIsOnline));

  const isOnline = localOnline;

  // ===================================================
  // LOCATION
  // ===================================================

  const [locationStatus, setLocationStatus] =
    useState("checking");

  const [driverLocation, setDriverLocation] =
    useState(null);

  const locationWatchId = useRef(null);

  // ===================================================
  // PICKUP DISTANCE
  // ===================================================

  const [pickupDistance, setPickupDistance] =
    useState(null);

  // ===================================================
  // EARNINGS
  // ===================================================

  const [earnings, setEarnings] =
    useState(null);

  // ===================================================
  // RIDE
  // ===================================================

  const [pendingRide, setPendingRide] =
    useState(null);

  const [showRideRequest, setShowRideRequest] =
    useState(false);

  const [rideTimer, setRideTimer] =
    useState(20);

  const [showNavigation, setShowNavigation] =
    useState(false);

  const [navigationStarted, setNavigationStarted] =
    useState(false);

  // ===================================================
  // PAYMENT
  // ===================================================

  const [showPaymentScreen, setShowPaymentScreen] =
    useState(false);

  const [paymentCompleted, setPaymentCompleted] =
    useState(false);

  // ===================================================
  // SOUND
  // ===================================================

  const audioContextRef = useRef(null);

  const soundPlayedRideIdRef = useRef(null);

  // ===================================================
  // CREATE RIDE REQUEST SOUND
  // ===================================================

  const playRideRequestSound = async () => {
    try {
      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) {
        console.warn(
          "Web Audio API is not supported."
        );
        return;
      }

      if (!audioContextRef.current) {
        audioContextRef.current =
          new AudioContext();
      }

      const audioContext =
        audioContextRef.current;

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      const playTone = (
        frequency,
        startTime,
        duration
      ) => {
        const oscillator =
          audioContext.createOscillator();

        const gainNode =
          audioContext.createGain();

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
          frequency,
          startTime
        );

        gainNode.gain.setValueAtTime(
          0.0001,
          startTime
        );

        gainNode.gain.exponentialRampToValueAtTime(
          0.35,
          startTime + 0.03
        );

        gainNode.gain.exponentialRampToValueAtTime(
          0.0001,
          startTime + duration
        );

        oscillator.connect(gainNode);
        gainNode.connect(
          audioContext.destination
        );

        oscillator.start(startTime);
        oscillator.stop(
          startTime + duration + 0.05
        );
      };

      const now =
        audioContext.currentTime;

      // First tone
      playTone(880, now, 0.22);

      // Second tone
      playTone(
        1175,
        now + 0.25,
        0.22
      );

      // Third tone
      playTone(
        880,
        now + 0.50,
        0.28
      );
    } catch (error) {
      console.warn(
        "Ride request sound failed:",
        error
      );
    }
  };

  // ===================================================
  // LOCAL NOTIFICATION
  // ===================================================

  const showRideNotification = async (
    ride
  ) => {
    try {
      const permission =
        await LocalNotifications.checkPermissions();

      if (
        permission.display !== "granted"
      ) {
        const requested =
          await LocalNotifications.requestPermissions();

        if (
          requested.display !== "granted"
        ) {
          return;
        }
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            id: Math.floor(
              Math.random() * 100000
            ),

            title: "🚕 New Ride Request",

            body: `${
              ride?.user?.name ||
              ride?.customerName ||
              "Passenger"
            } is requesting a ride.`,

            schedule: {
              at: new Date(
                Date.now() + 500
              ),
            },

            sound: undefined,

            extra: {
              rideId: ride?._id,
            },

            smallIcon:
              "ic_stat_icon_config_sample",

            actionTypeId:
              "RIDE_REQUEST",
          },
        ],
      });
    } catch (error) {
      console.warn(
        "Local notification failed:",
        error
      );
    }
  };

  // ===================================================
  // LOCATION PERMISSION + GPS
  // ===================================================

  useEffect(() => {
    let mounted = true;

    const setupLocation = async () => {
      try {
        let permission =
          await Geolocation.checkPermissions();

        if (
          permission.location !== "granted" &&
          permission.coarseLocation !== "granted"
        ) {
          permission =
            await Geolocation.requestPermissions();
        }

        if (
          permission.location !== "granted" &&
          permission.coarseLocation !== "granted"
        ) {
          if (mounted) {
            setLocationStatus(
              "permission-denied"
            );
          }

          return;
        }

        try {
          const position =
            await Geolocation.getCurrentPosition({
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            });

          if (!mounted) return;

          setDriverLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);

          setLocationStatus("enabled");
        } catch (error) {
          console.warn(
            "Initial GPS error:",
            error
          );

          if (mounted) {
            setLocationStatus("gps-off");
          }
        }

        // -------------------------------------------
        // WATCH DRIVER LOCATION
        // -------------------------------------------

        try {
          const watchId =
            await Geolocation.watchPosition(
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 3000,
              },
              (position, error) => {
                if (!mounted) return;

                if (error) {
                  console.warn(
                    "GPS watch error:",
                    error
                  );

                  return;
                }

                if (!position) return;

                setDriverLocation([
                  position.coords.latitude,
                  position.coords.longitude,
                ]);

                setLocationStatus("enabled");
              }
            );

          locationWatchId.current =
            watchId;
        } catch (error) {
          console.warn(
            "GPS watch could not start:",
            error
          );
        }
      } catch (error) {
        console.error(
          "Location permission error:",
          error
        );

        if (mounted) {
          setLocationStatus("error");
        }
      }
    };

    setupLocation();

    return () => {
      mounted = false;

      if (
        locationWatchId.current !== null
      ) {
        Geolocation.clearWatch({
          id: locationWatchId.current,
        }).catch(() => {});
      }
    };
  }, []);

  // ===================================================
  // LOCAL NOTIFICATION PERMISSION + CHANNEL
  // ===================================================

  useEffect(() => {
    const setupNotifications =
      async () => {
        try {
          let permission =
            await LocalNotifications.checkPermissions();

          if (
            permission.display !== "granted"
          ) {
            permission =
              await LocalNotifications.requestPermissions();
          }

          // Android notification channel
          try {
            await LocalNotifications.createChannel(
              {
                id: "ride_requests",

                name: "Ride Requests",

                description:
                  "Notifications for new ride requests",

                importance: 5,

                visibility: 1,

                sound: undefined,

                vibration: true,

                lights: true,
              }
            );
          } catch (channelError) {
            console.warn(
              "Notification channel setup failed:",
              channelError
            );
          }
        } catch (error) {
          console.warn(
            "Notification setup failed:",
            error
          );
        }
      };

    setupNotifications();
  }, []);

  // ===================================================
  // LOAD EARNINGS
  // ===================================================

  useEffect(() => {
    let mounted = true;

    const loadDashboard =
      async () => {
        try {
          const response =
            await apiClient.get(
              "/captains/earnings",
              withCaptainAuth()
            );

          if (!mounted) return;

          setEarnings(
            stripApiEnvelope(
              response.data
            )
          );
        } catch (error) {
          console.warn(
            "Earnings API unavailable:",
            error
          );

          if (mounted) {
            setEarnings(null);
          }
        }
      };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  // ===================================================
  // CALCULATE DRIVER → PICKUP DISTANCE
  // ===================================================

  useEffect(() => {
    if (
      !driverLocation ||
      !pendingRide?.pickup?.coordinates
    ) {
      setPickupDistance(null);
      return;
    }

    const pickupLongitude =
      Number(
        pendingRide.pickup.coordinates[0]
      );

    const pickupLatitude =
      Number(
        pendingRide.pickup.coordinates[1]
      );

    const driverLatitude =
      Number(driverLocation[0]);

    const driverLongitude =
      Number(driverLocation[1]);

    const distance =
      calculateDistanceKm(
        driverLatitude,
        driverLongitude,
        pickupLatitude,
        pickupLongitude
      );

    if (distance !== null) {
      setPickupDistance(distance);
    }
  }, [
    driverLocation,
    pendingRide,
  ]);

  // ===================================================
  // NEW RIDE SOUND + NOTIFICATION
  // ===================================================

  useEffect(() => {
    if (
      !pendingRide ||
      !showRideRequest
    ) {
      return;
    }

    const rideId =
      pendingRide._id;

    if (
      soundPlayedRideIdRef.current ===
      rideId
    ) {
      return;
    }

    soundPlayedRideIdRef.current =
      rideId;

    // Play sound when app is open
    playRideRequestSound();

    // Show notification
    showRideNotification(
      pendingRide
    );
  }, [
    pendingRide,
    showRideRequest,
  ]);

  // ===================================================
  // RIDE REQUEST DATA
  // ===================================================

  const rideRequest =
    pendingRide && {
      passenger:
        pendingRide.user?.name ||
        pendingRide.customerName ||
        "Passenger",

      pickup:
        pendingRide.pickupLocation ||
        "Pickup Location",

      destination:
        pendingRide.dropLocation ||
        "Destination",

      pickupCoordinates:
        pendingRide.pickup?.coordinates
          ? [
              pendingRide.pickup.coordinates[1],
              pendingRide.pickup.coordinates[0],
            ]
          : null,

      destinationCoordinates:
        pendingRide.drop?.coordinates
          ? [
              pendingRide.drop.coordinates[1],
              pendingRide.drop.coordinates[0],
            ]
          : null,

      distance:
        pickupDistance !== null
          ? `${pickupDistance.toFixed(
              1
            )} km away`
          : "Calculating...",

      duration: pendingRide.duration
        ? `${Math.ceil(
            pendingRide.duration / 60
          )} min`
        : "Calculating",

      fare: `₹${pendingRide.price || 0}`,

      fareValue: Number(
        pendingRide.price || 0
      ),

      payment:
        pendingRide.paymentMethod ||
        "Cash",
    };

  // ===================================================
  // ONLINE / OFFLINE
  // ===================================================

  const toggleOnline = () => {
    const nextStatus =
      !localOnline;

    setLocalOnline(nextStatus);

    if (!nextStatus) {
      setPendingRide(null);

      setShowRideRequest(false);

      setRideTimer(20);

      setShowNavigation(false);

      setNavigationStarted(false);

      setShowPaymentScreen(false);

      setPaymentCompleted(false);

      setPickupDistance(null);

      return;
    }

    // -----------------------------------------------
    // DEMO RIDE
    // -----------------------------------------------

    setTimeout(() => {
      const demoRide =
        createDemoRide();

      setPendingRide(
        demoRide
      );

      setPickupDistance(null);

      setRideTimer(20);

      setShowRideRequest(true);
    }, 800);
  };

  // ===================================================
  // RIDE COUNTDOWN
  // ===================================================

  useEffect(() => {
    if (!showRideRequest) {
      return;
    }

    if (rideTimer <= 0) {
      setShowRideRequest(false);

      setPendingRide(null);

      setPickupDistance(null);

      return;
    }

    const timer =
      setInterval(() => {
        setRideTimer(
          (previous) =>
            previous - 1
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [
    showRideRequest,
    rideTimer,
  ]);

  // ===================================================
  // ACCEPT RIDE
  // ===================================================

  const handleAcceptRide =
    async () => {
      if (!pendingRide) {
        return;
      }

      if (
        String(
          pendingRide._id
        ).startsWith("demo-ride")
      ) {
        setShowRideRequest(
          false
        );

        setShowNavigation(true);

        setNavigationStarted(
          false
        );

        return;
      }

      try {
        await apiClient.patch(
          `/rides/${pendingRide._id}/accept`,
          {},
          withCaptainAuth()
        );
      } catch (error) {
        console.warn(
          "Accept ride API failed:",
          error
        );
      }

      setShowRideRequest(false);

      setShowNavigation(true);

      setNavigationStarted(
        false
      );
    };

  // ===================================================
  // REJECT RIDE
  // ===================================================

  const handleRejectRide =
    async () => {
      if (!pendingRide) {
        return;
      }

      if (
        !String(
          pendingRide._id
        ).startsWith("demo-ride")
      ) {
        try {
          await apiClient.patch(
            `/rides/${pendingRide._id}/reject`,
            {},
            withCaptainAuth()
          );
        } catch (error) {
          console.warn(
            "Reject ride API failed:",
            error
          );
        }
      }

      setPendingRide(null);

      setShowRideRequest(false);

      setRideTimer(20);

      setPickupDistance(null);
    };

  // ===================================================
  // START NAVIGATION
  // ===================================================

  const handleStartNavigation =
    () => {
      setNavigationStarted(
        true
      );
    };

  // ===================================================
  // COMPLETE RIDE
  // ===================================================

  const handleCompleteRide =
    () => {
      setShowNavigation(false);

      setNavigationStarted(
        false
      );

      setPaymentCompleted(
        false
      );

      setShowPaymentScreen(
        true
      );
    };

  // ===================================================
  // CASH PAYMENT
  // ===================================================

  const handleCashPayment =
    () => {
      setPaymentCompleted(
        true
      );
    };

  // ===================================================
  // PAYMENT DONE
  // ===================================================

  const handlePaymentDone =
    () => {
      setShowPaymentScreen(
        false
      );

      setPaymentCompleted(
        false
      );

      setPendingRide(null);

      setShowRideRequest(
        false
      );

      setRideTimer(20);

      setShowNavigation(
        false
      );

      setNavigationStarted(
        false
      );

      setPickupDistance(null);

      setLocalOnline(true);
    };

  // ===================================================
  // MONEY
  // ===================================================

  const formatMoney = (value) =>
    `₹${Number(
      value || 0
    ).toLocaleString(
      "en-IN"
    )}`;

  const todayEarnings =
    earnings?.todayEarnings ||
    0;

  const completedRides =
    earnings?.completedRides ||
    earnings?.count ||
    0;

  const driverRating =
    earnings?.rating ||
    captain?.rating ||
    "4.9";

  // ===================================================
  // HOME SCREEN
  // ===================================================

  const renderHome = () => {
    const activeRide =
      pendingRide &&
      !showRideRequest &&
      !showNavigation
        ? pendingRide
        : null;

    return (
      <div className="mx-auto flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-[#FAFAFA] text-[#111827] shadow-2xl">

        {/* HEADER */}
        <header className="flex shrink-0 items-center justify-between border-b border-[#E5E7EB] bg-[#080B13] px-4 pb-3 pt-4">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/captain-profile"
              )
            }
            className="flex min-w-0 items-center gap-3 text-left"
            aria-label="Open profile"
          >
            <div className="relative flex h-[44px] w-[44px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E5E7EB] bg-[#F3F4F6] text-[#111827]">

              {captain?.profilePhoto ? (
                <img
                  src={
                    captain.profilePhoto
                  }
                  alt="Profile"
                  className="h-full w-full object-cover"
                  onError={(
                    event
                  ) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <UserCircle
                  size={24}
                  strokeWidth={1.7}
                  className="text-[#6B7280]"
                />
              )}

              <span
                className={`absolute bottom-[1px] right-[1px] h-[10px] w-[10px] rounded-full border-2 border-white ${
                  isOnline
                    ? "bg-[#1FAA59]"
                    : "bg-[#6B7280]"
                }`}
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium text-white">
                Hello
              </p>

              <p className="truncate text-[16px] font-bold leading-5 text-white">
                {captain?.name ||
                  "Driver"}
              </p>

              <div className="mt-[1px] flex items-center gap-1">

                <span
                  className={`h-[6px] w-[6px] rounded-full ${
                    isOnline
                      ? "bg-[#1FAA59]"
                      : "bg-[#6B7280]"
                  }`}
                />

                <span className="text-[10px] text-white">
                  {isOnline
                    ? "Online"
                    : "Offline"}
                </span>

              </div>
            </div>
          </button>

          <button
            type="button"
            className="relative flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#111827] shadow-sm"
            aria-label="Notifications"
          >
            <Bell
              size={20}
              strokeWidth={1.8}
            />

            <span className="absolute right-[9px] top-[8px] h-[6px] w-[6px] rounded-full bg-[#FFA726]" />
          </button>
        </header>

        {/* CONTENT */}
        <main className="hide-scrollbar min-h-0 flex-1 overflow-y-auto bg-[#FAFAFA] px-4 pb-4 pt-3">

          {/* ONLINE STATUS */}
          <section className="rounded-[14px] border border-[#E5E7EB] bg-white p-3 shadow-[0_2px_8px_rgba(17,24,39,0.04)]">

            <div className="flex items-center gap-3">

              <div
                className={`flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full ${
                  isOnline
                    ? "bg-[#E8F7EF]"
                    : "bg-[#F3F4F6]"
                }`}
              >
                <Power
                  size={19}
                  strokeWidth={1.8}
                  className={
                    isOnline
                      ? "text-[#1FAA59]"
                      : "text-[#6B7280]"
                  }
                />
              </div>

              <div className="min-w-0 flex-1">

                <div className="flex items-center gap-2">

                  <h2 className="text-[13px] font-bold text-[#111827]">
                    You are{" "}
                    {isOnline
                      ? "online"
                      : "offline"}
                  </h2>

                  <span
                    className={`h-[6px] w-[6px] rounded-full ${
                      isOnline
                        ? "bg-[#1FAA59]"
                        : "bg-[#6B7280]"
                    }`}
                  />

                </div>

                <p className="mt-[2px] truncate text-[10px] text-[#6B7280]">
                  {isOnline
                    ? "Ready to receive ride requests"
                    : "Go online to receive ride requests"}
                </p>

              </div>

              <button
                type="button"
                onClick={
                  toggleOnline
                }
                className={`shrink-0 rounded-full px-3 py-[7px] text-[10px] font-bold transition active:scale-[0.98] ${
                  isOnline
                    ? "bg-[#E5484D] text-white"
                    : "bg-[#FFA726] text-[#111827]"
                }`}
              >
                {isOnline
                  ? "Go offline"
                  : "Go online"}
              </button>

            </div>
          </section>

          {/* PERFORMANCE */}
          <section className="mt-2">

            <div className="overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_2px_8px_rgba(17,24,39,0.04)]">

              <div className="grid grid-cols-2">

                <div className="px-3 py-3">

                  <div className="flex items-start justify-between gap-2">

                    <div>
                      <p className="text-[9px] font-medium text-[#6B7280]">
                        Today's earnings
                      </p>

                      <p className="mt-[3px] text-[19px] font-bold leading-none text-[#111827]">
                        {formatMoney(
                          todayEarnings
                        )}
                      </p>
                    </div>

                    <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#FFA726]/10 text-[#FFA726]">
                      <IndianRupee
                        size={15}
                        strokeWidth={2}
                      />
                    </div>

                  </div>

                  <div className="mt-3 h-[22px] w-full">

                    <svg
                      viewBox="0 0 180 35"
                      className="h-full w-full"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 29 L20 27 L40 25 L60 28 L80 17 L100 21 L120 13 L140 18 L160 9 L180 12 L180 35 L0 35 Z"
                        fill="#FFA726"
                        fillOpacity="0.10"
                      />

                      <path
                        d="M0 29 L20 27 L40 25 L60 28 L80 17 L100 21 L120 13 L140 18 L160 9 L180 12"
                        fill="none"
                        stroke="#FFA726"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                  </div>
                </div>

                <div className="border-l border-[#E5E7EB] px-3 py-3">

                  <div className="flex items-start justify-between gap-2">

                    <div>
                      <p className="text-[9px] font-medium text-[#6B7280]">
                        Total rides
                      </p>

                      <p className="mt-[3px] text-[19px] font-bold leading-none text-[#111827]">
                        {completedRides}
                      </p>
                    </div>

                    <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#1FAA59]/10 text-[#1FAA59]">
                      <CarTaxiFront
                        size={15}
                        strokeWidth={1.9}
                      />
                    </div>

                  </div>

                  <div className="mt-3 flex h-[22px] items-end gap-[4px]">

                    {[8, 13, 18, 11, 21, 16].map(
                      (
                        height,
                        index
                      ) => (
                        <span
                          key={index}
                          className="w-[7px] rounded-t-[2px] bg-[#1FAA59]"
                          style={{
                            height: `${height}px`,
                            opacity:
                              0.4 +
                              index *
                                0.08,
                          }}
                        />
                      )
                    )}

                  </div>

                </div>

              </div>
            </div>
          </section>

          {/* ACTIVE RIDE */}
          <section className="mt-2">

            <button
              type="button"
              onClick={() => {
                if (activeRide) {
                  setShowNavigation(
                    true
                  );

                  setNavigationStarted(
                    false
                  );
                }
              }}
              disabled={!activeRide}
              className="group w-full rounded-[14px] border border-[#E5E7EB] bg-white p-3 text-left shadow-[0_2px_8px_rgba(17,24,39,0.04)] transition active:scale-[0.995] disabled:cursor-default"
            >

              <div className="flex items-center justify-between">

                <h2 className="text-[13px] font-bold text-[#111827]">
                  Active ride
                </h2>

                <ChevronRight
                  size={17}
                  strokeWidth={1.8}
                  className="text-[#6B7280]"
                />

              </div>

              {!activeRide ? (
                <div className="mt-3 flex items-center gap-3">

                  <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-[#6B7280]">
                    <CarTaxiFront
                      size={18}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="min-w-0">

                    <p className="text-[12px] font-semibold text-[#111827]">
                      No active ride
                    </p>

                    <p className="mt-[2px] text-[9px] text-[#6B7280]">
                      {isOnline
                        ? "Waiting for a ride request"
                        : "Tap to go online"}
                    </p>

                  </div>
                </div>
              ) : (
                <div className="mt-3">

                  <div className="flex items-start gap-3">

                    <div className="flex w-[18px] flex-col items-center pt-[4px]">

                      <span className="h-[8px] w-[8px] rounded-full bg-[#1FAA59]" />

                      <span className="my-[3px] h-[13px] border-l border-dashed border-[#9CA3AF]" />

                      <span className="h-[8px] w-[8px] rounded-full bg-[#E5484D]" />

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-[10px] font-semibold text-[#111827]">
                        {activeRide.pickupLocation ||
                          "Pickup location"}
                      </p>

                      <p className="mt-[8px] truncate text-[10px] font-semibold text-[#111827]">
                        {activeRide.dropLocation ||
                          "Destination"}
                      </p>

                    </div>

                  </div>

                  <div className="mt-3 flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <span className="rounded-full bg-[#E8F7EF] px-2 py-[4px] text-[8px] font-bold text-[#1FAA59]">
                        Active
                      </span>

                      <span className="text-[9px] text-[#6B7280]">
                        {Number(
                          activeRide.distance ||
                            0
                        ).toFixed(
                          1
                        )}{" "}
                        km
                      </span>

                    </div>

                    <span className="text-[13px] font-bold text-[#111827]">
                      {formatMoney(
                        activeRide.price
                      )}
                    </span>

                  </div>
                </div>
              )}

            </button>
          </section>

          {/* READY */}
          {!isOnline && (
            <section className="relative mt-2 min-h-[101px] overflow-hidden rounded-[14px] bg-[#062C52] px-3 py-3">

              <div className="relative z-10 max-w-[205px]">

                <div className="flex items-center gap-2">

                  <div className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#1FAA59] text-white">
                    <CarTaxiFront
                      size={14}
                      strokeWidth={1.9}
                    />
                  </div>

                  <p className="text-[13px] font-bold text-white">
                    Ready to ride?
                  </p>

                </div>

                <p className="mt-[3px] text-[9px] leading-[14px] text-[#D6E2EE]">
                  Turn online to get nearby ride requests
                </p>

                <button
                  type="button"
                  onClick={
                    toggleOnline
                  }
                  className="mt-[7px] rounded-full bg-[#FFA726] px-3 py-[6px] text-[9px] font-bold text-[#111827]"
                >
                  Go online
                </button>

              </div>

              <img
                src="/auto.png"
                alt="RideEasy auto"
                className="pointer-events-none absolute bottom-[-7px] right-[-9px] h-[94px] w-[126px] object-contain"
              />

            </section>
          )}

          {/* ONLINE */}
          {isOnline && (
            <section className="mt-2 rounded-[14px] border border-[#1FAA59]/20 bg-[#E8F7EF] px-3 py-[10px]">

              <div className="flex items-center gap-2">

                <div className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#1FAA59] text-white">
                  <CheckCircle2
                    size={15}
                  />
                </div>

                <div>

                  <p className="text-[10px] font-bold text-[#111827]">
                    You're ready to receive rides
                  </p>

                  <p className="mt-[1px] text-[8px] text-[#6B7280]">
                    Stay online and keep your location enabled.
                  </p>

                </div>

              </div>

            </section>
          )}

        </main>

        <BottomNav
          active="home"
          navigate={navigate}
        />

      </div>
    );
  };

  // ===================================================
  // NEW RIDE REQUEST
  // ===================================================

  const renderRideRequest =
    () => (
      <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/40">

        <div className="relative h-full w-full max-w-[430px] overflow-hidden bg-[#111827]">

          {/* MAP */}
          <div className="absolute inset-0 z-0">

            <MapContainer
              center={
                rideRequest?.pickupCoordinates ||
                [16.705, 74.2433]
              }
              zoom={13}
              className="h-full w-full"
              zoomControl={false}
              attributionControl={false}
            >

              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {rideRequest?.pickupCoordinates && (
                <Marker
                  position={
                    rideRequest.pickupCoordinates
                  }
                >
                  <Popup>
                    Pickup
                  </Popup>
                </Marker>
              )}

              {rideRequest?.destinationCoordinates && (
                <Marker
                  position={
                    rideRequest.destinationCoordinates
                  }
                >
                  <Popup>
                    Destination
                  </Popup>
                </Marker>
              )}

              {rideRequest?.pickupCoordinates &&
                rideRequest?.destinationCoordinates && (
                  <Polyline
                    positions={[
                      rideRequest.pickupCoordinates,
                      rideRequest.destinationCoordinates,
                    ]}
                    pathOptions={{
                      color:
                        "#FFA726",
                      weight: 5,
                      opacity: 0.9,
                    }}
                  />
                )}

              {driverLocation && (
                <Marker
                  position={
                    driverLocation
                  }
                >
                  <Popup>
                    Your location
                  </Popup>
                </Marker>
              )}

            </MapContainer>

          </div>

          {/* OVERLAY */}
          <div className="pointer-events-none absolute inset-0 z-[10] bg-gradient-to-b from-black/35 via-transparent to-black/45" />

          {/* TOP HEADER */}
          <div className="pointer-events-none absolute left-0 right-0 top-0 z-[1000] px-4 pt-4">

            <div className="flex items-center justify-between">

              <button
                type="button"
                onClick={
                  handleRejectRide
                }
                className="pointer-events-auto flex h-[44px] w-[44px] items-center justify-center rounded-full border border-white/10 bg-[#111827]/95 text-white shadow-xl backdrop-blur-md active:scale-95"
              >
                <X size={20} />
              </button>

              <div className="rounded-full border border-white/10 bg-[#111827]/95 px-5 py-2.5 text-[11px] font-bold text-white shadow-xl backdrop-blur-md">
                New ride request
              </div>

              <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-[#FFA726]/30 bg-[#111827]/95 text-[13px] font-black text-[#FFA726] shadow-xl backdrop-blur-md">
                {rideTimer}
              </div>

            </div>

          </div>

          {/* BOTTOM SHEET */}
          <div className="absolute bottom-0 left-0 right-0 z-[1000]">

            <div className="rounded-t-[28px] border-t border-white/10 bg-[#111827]/98 px-4 pb-5 pt-3 shadow-[0_-15px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl">

              <div className="mx-auto mb-4 h-[4px] w-[42px] rounded-full bg-white/20" />

              {/* PASSENGER */}
              <div className="mb-4 flex items-center gap-3">

                <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#123B28]">

                  <UserRound
                    size={21}
                    className="text-[#1FAA59]"
                  />

                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-[13px] font-bold text-white">
                    {rideRequest?.passenger ||
                      "Passenger"}
                  </p>

                  <p className="mt-1 text-[9px] text-[#9CA3AF]">
                    New ride request
                  </p>

                </div>

                <div className="rounded-full bg-[#352A06] px-2.5 py-1.5">

                  <div className="flex items-center gap-1">

                    <Star
                      size={11}
                      fill="#FFA726"
                      className="text-[#FFA726]"
                    />

                    <span className="text-[9px] font-bold text-[#FFA726]">
                      {driverRating}
                    </span>

                  </div>

                </div>

              </div>

              {/* PICKUP / DESTINATION */}
              <div className="rounded-[17px] border border-white/[0.07] bg-[#172033] p-3">

                {/* PICKUP */}
                <div className="flex items-start gap-3">

                  <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#123B28]">

                    <MapPin
                      size={17}
                      className="text-[#1FAA59]"
                    />

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-[8px] font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
                      Pickup
                    </p>

                    {/* DRIVER DISTANCE */}
                    <p className="mt-1 text-[13px] font-black text-white">
                      {pickupDistance !==
                      null
                        ? `${pickupDistance.toFixed(
                            1
                          )} km away`
                        : "Calculating distance..."}
                    </p>

                    <p className="mt-1 truncate text-[9px] text-[#9CA3AF]">
                      From your current location
                    </p>

                  </div>

                </div>

                {/* CONNECTOR */}
                <div className="ml-[17px] h-[15px] border-l border-dashed border-[#6B7280]" />

                {/* DESTINATION */}
                <div className="flex items-start gap-3">

                  <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#3B1B1D]">

                    <MapPin
                      size={17}
                      className="text-[#E5484D]"
                    />

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-[8px] font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
                      Destination
                    </p>

                    <p className="mt-1 truncate text-[11px] font-bold text-white">
                      {rideRequest?.destination ||
                        "Destination"}
                    </p>

                  </div>

                </div>

              </div>

              {/* FARE / DISTANCE / TIME */}
              <div className="mt-3 grid grid-cols-3 gap-2">

                <div className="rounded-[13px] bg-[#172033] px-3 py-2.5">

                  <p className="text-[8px] text-[#6B7280]">
                    Fare
                  </p>

                  <p className="mt-1 text-[16px] font-black text-white">
                    {rideRequest?.fare ||
                      "₹0"}
                  </p>

                </div>

                <div className="rounded-[13px] bg-[#172033] px-3 py-2.5">

                  <p className="text-[8px] text-[#6B7280]">
                    Pickup
                  </p>

                  <p className="mt-1 text-[11px] font-bold text-white">
                    {pickupDistance !==
                    null
                      ? `${pickupDistance.toFixed(
                          1
                        )} km`
                      : "..."}
                  </p>

                </div>

                <div className="rounded-[13px] bg-[#172033] px-3 py-2.5">

                  <p className="text-[8px] text-[#6B7280]">
                    Estimated Time
                  </p>

                  <p className="mt-1 text-[11px] font-bold text-white">
                    {rideRequest?.duration ||
                      "0 min"}
                  </p>

                </div>

              </div>

              {/* ACCEPT / DECLINE */}
              <div className="mt-4 grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={
                    handleRejectRide
                  }
                  className="flex h-[52px] items-center justify-center rounded-[15px] border border-[#E5484D]/70 bg-[#3B1B1D] text-[13px] font-bold text-[#E5484D] transition active:scale-[0.97]"
                >
                  Decline
                </button>

                <button
                  type="button"
                  onClick={
                    handleAcceptRide
                  }
                  className="flex h-[52px] items-center justify-center gap-2 rounded-[15px] bg-[#1FAA59] text-[13px] font-bold text-white shadow-[0_8px_25px_rgba(31,170,89,0.30)] transition active:scale-[0.97]"
                >
                  <CheckCircle2
                    size={18}
                  />

                  Accept Ride
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    );

  // ===================================================
  // NAVIGATION
  // ===================================================

  const renderNavigation =
    () => (
      <div className="absolute inset-0 z-[60] flex flex-col overflow-hidden bg-[#E5E7EB]">

        {/* MAP */}
        <div className="relative h-[52%] min-h-0 shrink-0 overflow-hidden">

          <MapContainer
            center={
              rideRequest?.pickupCoordinates ||
              [16.705, 74.2433]
            }
            zoom={13}
            className="h-full w-full"
            zoomControl={false}
          >

            <TileLayer
              attribution=""
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {driverLocation && (
              <Marker
                position={
                  driverLocation
                }
              >
                <Popup>
                  Your location
                </Popup>
              </Marker>
            )}

            {rideRequest?.pickupCoordinates && (
              <Marker
                position={
                  rideRequest.pickupCoordinates
                }
              >
                <Popup>
                  Pickup
                </Popup>
              </Marker>
            )}

            {rideRequest?.destinationCoordinates && (
              <Marker
                position={
                  rideRequest.destinationCoordinates
                }
              >
                <Popup>
                  Destination
                </Popup>
              </Marker>
            )}

            {rideRequest?.pickupCoordinates &&
              rideRequest?.destinationCoordinates && (
                <Polyline
                  positions={[
                    rideRequest.pickupCoordinates,
                    rideRequest.destinationCoordinates,
                  ]}
                  pathOptions={{
                    color:
                      "#FFA726",
                    weight: 5,
                  }}
                />
              )}

            <MapCenter
              position={
                rideRequest?.pickupCoordinates
              }
            />

          </MapContainer>

          {/* TOP BAR */}
          <div className="absolute left-3 right-3 top-3 z-[1000] flex items-center justify-between">

            <button
              type="button"
              onClick={() => {
                setShowNavigation(
                  false
                );

                setNavigationStarted(
                  false
                );
              }}
              className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#111827]/95 text-white shadow-xl"
            >
              <X size={19} />
            </button>

            <div className="rounded-full bg-[#111827]/95 px-4 py-2 text-[10px] font-bold text-white shadow-xl">
              {navigationStarted
                ? "Ride in progress"
                : "Ride accepted"}
            </div>

            <button
              type="button"
              className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#111827]/95 text-[#FFA726] shadow-xl"
            >
              <LocateFixed
                size={18}
              />
            </button>

          </div>

        </div>

        {/* SHEET */}
        <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto rounded-t-[24px] bg-[#111827] px-3 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3">

          <div className="mx-auto mb-3 h-[4px] w-[38px] rounded-full bg-white/20" />

          {/* STATUS */}
          <div className="flex items-center justify-between">

            <div>

              <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#6B7280]">
                {navigationStarted
                  ? "Current ride"
                  : "Ride accepted"}
              </p>

              <h2 className="mt-1 text-[17px] font-black text-white">
                {navigationStarted
                  ? "Ride in progress"
                  : "Ready to start"}
              </h2>

            </div>

            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#123B28]">

              <CheckCircle2
                size={21}
                className="text-[#1FAA59]"
              />

            </div>

          </div>

          {/* PASSENGER */}
          <div className="mt-3 flex items-center gap-3 rounded-[14px] bg-[#172033] p-3">

            <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#123B28]">

              <UserRound
                size={20}
                className="text-[#1FAA59]"
              />

            </div>

            <div className="min-w-0 flex-1">

              <p className="text-[12px] font-bold text-white">
                {rideRequest?.passenger ||
                  "Passenger"}
              </p>

              <p className="mt-1 truncate text-[9px] text-[#9CA3AF]">
                {rideRequest?.pickup ||
                  "Pickup location"}
              </p>

            </div>

            <div className="text-right">

              <p className="text-[8px] text-[#6B7280]">
                Fare
              </p>

              <p className="text-[17px] font-black text-white">
                {rideRequest?.fare ||
                  "₹0"}
              </p>

            </div>

          </div>

          {/* DESTINATION */}
          <div className="mt-3 rounded-[14px] bg-[#172033] p-3">

            <div className="flex items-center gap-3">

              <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#352A06]">

                <Navigation
                  size={17}
                  className="text-[#FFA726]"
                />

              </div>

              <div className="min-w-0 flex-1">

                <p className="text-[9px] text-[#6B7280]">
                  Destination
                </p>

                <p className="mt-1 truncate text-[11px] font-bold text-white">
                  {rideRequest?.destination ||
                    "Destination"}
                </p>

              </div>

              <div className="text-right">

                <p className="text-[10px] font-bold text-white">
                  {rideRequest?.distance ||
                    "0 km"}
                </p>

                <p className="mt-1 text-[8px] text-[#6B7280]">
                  {rideRequest?.duration ||
                    "0 min"}
                </p>

              </div>

            </div>

          </div>

          {/* RIDE INFO */}
          <div className="mt-3 grid grid-cols-2 gap-2">

            <div className="rounded-[12px] bg-[#172033] p-2 text-center">

              <p className="text-[8px] text-[#6B7280]">
                Pickup
              </p>

              <p className="mt-1 text-[10px] font-bold text-[#1FAA59]">
                {pickupDistance !==
                null
                  ? `${pickupDistance.toFixed(
                      1
                    )} km away`
                  : "Calculating"}
              </p>

            </div>

            <div className="rounded-[13px] bg-[#172033] px-3 py-2.5">

              <p className="text-[8px] text-[#6B7280]">
                Estimated Time
              </p>

              <p className="mt-1 text-[11px] font-bold text-white">
                {rideRequest?.duration ||
                  "0 min"}
              </p>

            </div>

          </div>

          {/* ACTION */}
          {!navigationStarted ? (
            <button
              type="button"
              onClick={
                handleStartNavigation
              }
              className="mt-3 flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#1FAA59] text-[12px] font-bold text-white shadow-[0_8px_25px_rgba(31,170,89,0.25)] active:scale-[0.98]"
            >
              <Navigation
                size={18}
              />

              Start Ride
            </button>
          ) : (
            <button
              type="button"
              onClick={
                handleCompleteRide
              }
              className="mt-3 flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#FFA726] text-[12px] font-bold text-[#111827] shadow-[0_8px_25px_rgba(255,167,38,0.25)] active:scale-[0.98]"
            >
              <CheckCircle2
                size={18}
              />

              Complete Ride
            </button>
          )}

        </div>
      </div>
    );

  // ===================================================
  // PAYMENT
  // ===================================================

  const renderPaymentScreen =
    () => (
      <div className="absolute inset-0 z-[80] flex flex-col overflow-hidden bg-[#111827]">

        <header className="shrink-0 px-4 pb-3 pt-4">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6B7280]">
                Ride completed
              </p>

              <h1 className="mt-1 text-[21px] font-black text-white">
                Collect Payment
              </h1>

            </div>

            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#123B28]">

              <CheckCircle2
                size={21}
                className="text-[#1FAA59]"
              />

            </div>

          </div>

        </header>

        <main className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-[calc(15px+env(safe-area-inset-bottom))]">

          {/* FARE */}
          <section className="rounded-[18px] bg-[#172033] p-4">

            <div className="text-center">

              <p className="text-[9px] uppercase tracking-[0.12em] text-[#6B7280]">
                Total Fare
              </p>

              <p className="mt-1 text-[38px] font-black text-white">
                {rideRequest?.fare ||
                  "₹0"}
              </p>

              <p className="text-[9px] text-[#9CA3AF]">
                {rideRequest?.distance ||
                  "0 km"}{" "}
                •{" "}
                {rideRequest?.duration ||
                  "0 min"}
              </p>

            </div>

            {/* PASSENGER */}
            <div className="mt-3 flex items-center justify-between rounded-[13px] bg-[#111827] p-3">

              <div className="flex items-center gap-2">

                <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-[#352A06]">

                  <UserRound
                    size={16}
                    className="text-[#FFA726]"
                  />

                </div>

                <div>

                  <p className="text-[9px] font-bold text-white">
                    Passenger
                  </p>

                  <p className="mt-1 text-[8px] text-[#6B7280]">
                    {rideRequest?.passenger ||
                      "Passenger"}
                  </p>

                </div>

              </div>

              <div className="rounded-[13px] bg-[#172033] px-3 py-2.5">

                <p className="text-[8px] text-[#6B7280]">
                  Estimated Time
                </p>

                <p className="mt-1 text-[11px] font-bold text-white">
                  {rideRequest?.duration ||
                    "0 min"}
                </p>

              </div>

            </div>

          </section>

          {!paymentCompleted ? (
            <>
              {/* QR */}
              <section className="mt-3 rounded-[18px] bg-[#172033] p-3">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[12px] font-bold text-white">
                      UPI Payment
                    </p>

                    <p className="mt-1 text-[8px] text-[#6B7280]">
                      Ask passenger to scan your QR
                    </p>

                  </div>

                  <WalletCards
                    size={20}
                    className="text-[#FFA726]"
                  />

                </div>

                {/* DEMO QR */}
                <div className="mx-auto mt-3 flex h-[155px] w-[155px] items-center justify-center rounded-[12px] bg-white p-2">

                  <div className="flex h-full w-full items-center justify-center border-[6px] border-[#111827] bg-white">

                    <div className="grid grid-cols-5 gap-[3px] p-2">

                      {Array.from({
                        length: 25,
                      }).map(
                        (_, index) => (
                          <span
                            key={
                              index
                            }
                            className={`h-[16px] w-[16px] ${
                              [
                                0,
                                1,
                                2,
                                5,
                                7,
                                10,
                                12,
                                13,
                                14,
                                16,
                                18,
                                20,
                                21,
                                22,
                                24,
                              ].includes(
                                index
                              )
                                ? "bg-[#111827]"
                                : "bg-white"
                            }`}
                          />
                        )
                      )}

                    </div>

                  </div>

                </div>

                <p className="mt-2 text-center text-[8px] text-[#6B7280]">
                  Scan QR to pay{" "}
                  {rideRequest?.fare ||
                    "₹0"}
                </p>

              </section>

              {/* CASH */}
              <button
                type="button"
                onClick={
                  handleCashPayment
                }
                className="mt-3 flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border border-[#FFA726] bg-[#352A06] text-[12px] font-bold text-[#FFA726] active:scale-[0.98]"
              >
                <Banknote
                  size={18}
                />

                Cash Payment Received
              </button>
            </>
          ) : (
            <>
              {/* SUCCESS */}
              <section className="mt-3 rounded-[18px] bg-[#123B28] p-5 text-center">

                <div className="mx-auto flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#1FAA59]">

                  <CheckCircle2
                    size={34}
                    className="text-white"
                  />

                </div>

                <h2 className="mt-3 text-[18px] font-black text-white">
                  Payment Received
                </h2>

                <p className="mt-1 text-[9px] text-[#9CA3AF]">
                  Ride payment has been successfully collected.
                </p>

                <p className="mt-3 text-[29px] font-black text-white">
                  {rideRequest?.fare ||
                    "₹0"}
                </p>

              </section>

              {/* HOME */}
              <button
                type="button"
                onClick={
                  handlePaymentDone
                }
                className="mt-3 flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#1FAA59] text-[12px] font-bold text-white active:scale-[0.98]"
              >
                <Home size={18} />

                Back to Home
              </button>
            </>
          )}

        </main>
      </div>
    );

  // ===================================================
  // BOTTOM NAV
  // ===================================================

  const BottomNav = ({
    active,
    navigate,
  }) => (
    <nav className="shrink-0 border-t border-white/[0.07] bg-[#111827] px-[10px] pb-[10px] pt-[8px]">

      <div className="grid grid-cols-4">

        {/* HOME */}
        <button
          type="button"
          onClick={() =>
            navigate(
              "/captain-home"
            )
          }
          className={`flex flex-col items-center gap-[4px] ${
            active === "home"
              ? "text-[#FFA726]"
              : "text-[#6B7280]"
          }`}
        >
          <Home size={20} />

          <span className="text-[8px] font-semibold">
            Home
          </span>
        </button>

        {/* EARNINGS */}
        <button
          type="button"
          onClick={() =>
            navigate(
              "/captain-earning"
            )
          }
          className={`flex flex-col items-center gap-[4px] ${
            active === "earnings"
              ? "text-[#FFA726]"
              : "text-[#6B7280]"
          }`}
        >
          <WalletCards
            size={20}
          />

          <span className="text-[8px] font-semibold">
            Earnings
          </span>
        </button>

        {/* HISTORY */}
        <button
          type="button"
          onClick={() =>
            navigate(
              "/captain-history"
            )
          }
          className={`flex flex-col items-center gap-[4px] ${
            active === "history"
              ? "text-[#FFA726]"
              : "text-[#6B7280]"
          }`}
        >
          <History size={20} />

          <span className="text-[8px] font-semibold">
            History
          </span>
        </button>

        {/* PROFILE */}
        <button
          type="button"
          onClick={() =>
            navigate(
              "/captain-profile"
            )
          }
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

  // ===================================================
  // MAIN RENDER
  // ===================================================

  return (
    <div className="fixed inset-0 flex w-full flex-col overflow-hidden bg-[#E5E7EB] text-[#111827]">

      {showPaymentScreen
        ? renderPaymentScreen()
        : showNavigation
        ? renderNavigation()
        : showRideRequest
        ? renderRideRequest()
        : renderHome()}

    </div>
  );
};

export default DriverHome;