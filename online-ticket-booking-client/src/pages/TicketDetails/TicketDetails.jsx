import { use, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../../lib/axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../providers/AuthContext";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = use(AuthContext);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingQuantity, setBookingQuantity] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  // Fetch ticket details
  const { data: ticket, isLoading, isError } = useQuery({
    queryKey: ["ticketDetails", id],
    queryFn: async () => {
      const res = await api.get(`/api/v1/tickets/${id}`);
      return res.data?.data;
    },
  });

  // Calculate countdown
  useEffect(() => {
    if (!ticket?.departureDate || !ticket?.departureTime) return;

    const updateCountdown = () => {
      const departureDateTime = new Date(`${ticket.departureDate} ${ticket.departureTime}`);
      const now = new Date();
      const difference = departureDateTime.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds, expired: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [ticket]);

  // Booking mutation
  const bookingMutation = useMutation({
    mutationFn: async (bookingData) => {
      const res = await api.post("/api/v1/bookings", bookingData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Booking submitted successfully!");
      setShowBookingModal(false);
      setBookingQuantity(1);
      navigate("/my-bookings");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Booking failed");
    },
  });

  const handleBooking = (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to book tickets");
      navigate("/login");
      return;
    }

    if (bookingQuantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    if (bookingQuantity > ticket.quantity) {
      toast.error(`Only ${ticket.quantity} tickets available`);
      return;
    }

    bookingMutation.mutate({
      ticketId: ticket._id,
      quantity: bookingQuantity,
      userEmail: user.email,
      userName: user.displayName || user.email,
      totalPrice: ticket.price * bookingQuantity,
      status: "pending",
    });
  };

  const isBookingDisabled = !ticket || ticket.quantity === 0 || timeRemaining.expired;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2 text-gray-600">
          <span className="inline-block w-5 h-5 border-2 border-[#01602a] border-r-transparent rounded-full animate-spin" />
          Loading ticket details...
        </div>
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load ticket details</p>
          <button
            onClick={() => navigate("/tickets")}
            className="px-4 py-2 bg-[#01602a] text-white rounded hover:bg-[#014d21]"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8">
      {/* Countdown Timer */}
      <div className="bg-linear-to-r from-[#01602a] via-[#017a2f] to-[#028a3d] text-white rounded-2xl p-6 mb-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {timeRemaining.expired ? "Departure Time Passed" : "Time Until Departure"}
        </h2>
        {!timeRemaining.expired ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-4xl font-bold">{timeRemaining.days}</div>
              <div className="text-sm opacity-90">Days</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{timeRemaining.hours}</div>
              <div className="text-sm opacity-90">Hours</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{timeRemaining.minutes}</div>
              <div className="text-sm opacity-90">Minutes</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{timeRemaining.seconds}</div>
              <div className="text-sm opacity-90">Seconds</div>
            </div>
          </div>
        ) : (
          <div className="text-center text-2xl font-semibold">
            This ticket is no longer available for booking
          </div>
        )}
      </div>

      {/* Ticket Details */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Image */}
        <div className="relative h-72 md:h-[420px] w-full overflow-hidden">
          <img
            src={ticket.ticketImage || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=60&auto=format&fit=crop"}
            alt={ticket.ticketTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold capitalize">
              {ticket.transportType}
            </span>
          </div>
          {ticket.verificationStatus === "approved" && (
            <div className="absolute top-4 right-4">
              <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Verified
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{ticket.ticketTitle}</h1>

          {/* Route and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-2">Route</h3>
              <div className="text-xl font-semibold text-gray-900">
                {ticket.from} → {ticket.to}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-2">Price per Seat</h3>
              <div className="text-2xl font-bold text-[#01602a]">
                ${Number(ticket.price).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="border rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Available Seats</div>
              <div className="text-xl font-semibold text-gray-900">{ticket.quantity}</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Departure Date</div>
              <div className="text-xl font-semibold text-gray-900">{ticket.departureDate}</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Departure Time</div>
              <div className="text-xl font-semibold text-gray-900">{ticket.departureTime}</div>
            </div>
          </div>

          {/* Description */}
          {ticket.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{ticket.description}</p>
            </div>
          )}

          {/* Facilities */}
          {ticket.facilities && ticket.facilities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Facilities</h3>
              <div className="flex flex-wrap gap-2">
                {ticket.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Vendor Info */}
          <div className="border-t pt-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Vendor Information</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div>
                <div className="text-sm text-gray-500">Name</div>
                <div className="font-semibold text-gray-900">{ticket.vendorName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="font-semibold text-gray-900">{ticket.vendorEmail}</div>
              </div>
            </div>
          </div>

          {/* Book Now Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/tickets")}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Back to Tickets
            </button>
            <button
              onClick={() => setShowBookingModal(true)}
              disabled={isBookingDisabled}
              className="flex-1 px-6 py-3 bg-[#01602a] text-white rounded-lg hover:bg-[#014d21] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
            >
              {timeRemaining.expired
                ? "Booking Closed"
                : ticket.quantity === 0
                ? "Sold Out"
                : "Book Now"}
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Tickets</h2>

            <form onSubmit={handleBooking}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Details
                </label>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600">{ticket.ticketTitle}</div>
                  <div className="text-lg font-semibold text-gray-900">
                    ${Number(ticket.price).toFixed(2)} per seat
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (Available: {ticket.quantity})
                </label>
                <input
                  type="number"
                  min="1"
                  max={ticket.quantity}
                  value={bookingQuantity}
                  onChange={(e) => setBookingQuantity(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01602a]"
                  required
                />
              </div>

              <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Subtotal:</span>
                  <span>${(ticket.price * bookingQuantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total:</span>
                  <span>${(ticket.price * bookingQuantity).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowBookingModal(false);
                    setBookingQuantity(1);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingMutation.isPending}
                  className="flex-1 px-4 py-2 bg-[#01602a] text-white rounded-lg hover:bg-[#014d21] transition disabled:opacity-50"
                >
                  {bookingMutation.isPending ? "Processing..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetails;
