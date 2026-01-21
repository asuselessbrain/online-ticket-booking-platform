import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import api from "../../lib/axios";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [phase, setPhase] = useState("processing");
  const startedRef = useRef(false);

  const sessionId = searchParams.get("session_id");
  const paymentStatus = searchParams.get("payment_status");

  const handlePaymentSuccess = useCallback(async () => {
    try {
      setPhase("processing");
      const res = await api.post("/api/v1/payments/payment-success", {
        sessionId,
      });

      if (res.data?.success) {
        setPhase("success");
        toast.success("Payment successful! Your booking is confirmed.");
        // Redirect to my bookings after 2 seconds
        setTimeout(() => {
          navigate("/user/my-bookings");
        }, 2000);
      }
    } catch (error) {
      setPhase("error");
      toast.error(error?.response?.data?.message || "Payment processing failed.");
    }
  }, [sessionId, navigate]);

  useEffect(() => {
    if (paymentStatus === "success" && sessionId && !startedRef.current) {
      startedRef.current = true;
      setTimeout(() => {
        handlePaymentSuccess();
      }, 0);
    }
  }, [sessionId, paymentStatus, handlePaymentSuccess]);

  if (paymentStatus === "cancelled") {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
          <div className="mb-6">
            <div className="inline-block p-3 rounded-full bg-rose-100">
              <svg
                className="w-8 h-8 text-rose-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Cancelled</h1>
          <p className="text-gray-600 mb-8">
            Your payment was cancelled. Your booking is still pending vendor approval.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/user/my-bookings"
              className="px-6 py-3 bg-[#01602a] text-white rounded-lg font-semibold hover:bg-[#014d21] transition"
            >
              Back to Bookings
            </Link>
            <Link
              to="/tickets"
              className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Browse More Tickets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === "success") {
    if (phase === "processing") {
      return (
        <div className="max-w-[1440px] mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01602a]"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-3">Processing Payment</h1>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </div>
        </div>
      );
    }

    if (phase === "error") {
      return (
        <div className="max-w-[1440px] mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <div className="mb-6">
              <div className="inline-block p-3 rounded-full bg-rose-100">
                <svg
                  className="w-8 h-8 text-rose-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Something went wrong</h1>
            <p className="text-gray-600 mb-8">We encountered an issue while processing your payment. Please try again.</p>
            <Link
              to="/user/my-bookings"
              className="inline-block px-6 py-3 bg-[#01602a] text-white rounded-lg font-semibold hover:bg-[#014d21] transition"
            >
              Back to Bookings
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-[1440px] mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
          <div className="mb-6">
            <div className="inline-block p-3 rounded-full bg-emerald-100">
              <svg
                className="w-8 h-8 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
          <p className="text-gray-600 mb-2">
            Thank you for your payment. Your booking has been confirmed and your ticket quantity
            has been updated.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Redirecting you to your bookings...
          </p>
          <Link
            to="/user/my-bookings"
            className="inline-block px-6 py-3 bg-[#01602a] text-white rounded-lg font-semibold hover:bg-[#014d21] transition"
          >
            Go to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Invalid Request</h1>
        <p className="text-gray-600 mb-8">
          Something went wrong. Please return to your bookings.
        </p>
        <Link
          to="/user/my-bookings"
          className="inline-block px-6 py-3 bg-[#01602a] text-white rounded-lg font-semibold hover:bg-[#014d21] transition"
        >
          Back to Bookings
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
