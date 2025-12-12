import { use, useState } from "react";
import { AuthContext } from "../../providers/AuthContext";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/axios";

const AddTicket = () => {
  const { user } = use(AuthContext);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      from: "",
      to: "",
      transportType: "",
      price: "",
      quantity: "",
      departureDate: "",
      departureTime: "",
      perks: [],
      image: undefined,
    }
  });

  const onSubmit = async (data) => {
    const imageFile = data.image?.[0];
    if (!imageFile) {
      toast.error("Please select an image to upload.");
      return;
    }

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      toast.error("Missing Cloudinary config (VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET).");
      return;
    }

    setSubmitting(true);
    try {
      const imgFormData = new FormData();
      imgFormData.append("file", imageFile);
      imgFormData.append("upload_preset", uploadPreset);
      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: imgFormData,
      });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadJson?.error?.message || "Image upload failed");
      }
      const image = uploadJson.secure_url || uploadJson.url;

      const payload = {
        ticketTitle: data.title,
        from: data.from,
        to: data.to,
        transportType: data.transportType,
        price: Number(data.price),
        quantity: Number(data.quantity),
        departureDate: data.departureDate,
        departureTime: data.departureTime,
        perks: data.perks || [],
        image,
        vendorName: user?.displayName || "",
        vendorEmail: user?.email || "",
      };
      await addTicketMutation.mutateAsync(payload);
      reset();
    } catch (err) {
      toast.error(err.message || "Failed to add ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const addTicketMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/api/v1/tickets", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Ticket added successfully!");
    },
    onError: (error) => {
      const message = error?.response?.data?.message || error?.message || "Failed to add ticket";
      toast.error(message);
    }
  });

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Add Ticket</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Ticket title</label>
          <input {...register("title", { required: true })} type="text" className="w-full border rounded px-3 py-2" placeholder="e.g., Dhaka to Chittagong" />
          {errors.title && <span className="text-red-600 text-sm">Title is required</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">From (Location)</label>
          <input {...register("from", { required: true })} type="text" className="w-full border rounded px-3 py-2" placeholder="Starting point" />
          {errors.from && <span className="text-red-600 text-sm">From location is required</span>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">To (Location)</label>
          <input {...register("to", { required: true })} type="text" className="w-full border rounded px-3 py-2" placeholder="Destination" />
          {errors.to && <span className="text-red-600 text-sm">To location is required</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Transport type</label>
          <select {...register("transportType", { required: true })} className="w-full border rounded px-3 py-2">
            <option value="">Select type</option>
            <option value="bus">Bus</option>
            <option value="train">Train</option>
            <option value="air">Air</option>
            <option value="launch">Ship</option>
          </select>
          {errors.transportType && <span className="text-red-600 text-sm">Transport type is required</span>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price (per unit)</label>
          <input {...register("price", { required: true, min: 0 })} type="number" min="0" step="0.01" className="w-full border rounded px-3 py-2" placeholder="0.00" />
          {errors.price && <span className="text-red-600 text-sm">Valid price is required</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ticket quantity</label>
          <input {...register("quantity", { required: true, min: 1 })} type="number" min="1" className="w-full border rounded px-3 py-2" placeholder="e.g., 40" />
          {errors.quantity && <span className="text-red-600 text-sm">Quantity must be at least 1</span>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Departure date</label>
            <input {...register("departureDate", { required: true })} type="date" className="w-full border rounded px-3 py-2" />
            {errors.departureDate && <span className="text-red-600 text-sm">Departure date is required</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Departure time</label>
            <input {...register("departureTime", { required: true })} type="time" className="w-full border rounded px-3 py-2" />
            {errors.departureTime && <span className="text-red-600 text-sm">Departure time is required</span>}
          </div>
        </div>

        <div className="md:col-span-2">
          <span className="block text-sm font-medium mb-1">Perks</span>
          <div className="flex flex-wrap gap-3">
            {[
              "AC",
              "WiFi",
              "Breakfast",
              "Snacks",
              "Recliner Seat",
              "Luggage",
            ].map((perk) => (
              <label key={perk} className="inline-flex items-center gap-2">
                <input type="checkbox" value={perk} {...register("perks")} />
                <span>{perk}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Image upload (imgbb)</label>
          <input {...register("image", { required: true })} type="file" accept="image/*" className="w-full border rounded px-3 py-2" />
          {errors.image && <span className="text-red-600 text-sm">Image is required</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Vendor name</label>
          <input type="text" value={user?.displayName} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Vendor email</label>
          <input type="email" value={user?.email} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#01602a] text-white px-4 py-2 rounded hover:bg-[#06863e] transition disabled:opacity-60"
          >
            {submitting ? "Adding..." : "Add Ticket"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddTicket;
