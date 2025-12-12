import { use, useState } from "react";
import { AuthContext } from "../../providers/AuthContext";
import { toast } from "react-toastify";

const AddTicket = () => {
  const { user } = use(AuthContext);
  const [submitting, setSubmitting] = useState(false);
  console.log(user)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const perks = formData.getAll("perks");
    const imageFile = formData.get("image");

    if (!imageFile || imageFile.size === 0) {
      toast.error("Please select an image to upload.");
      return;
    }

    const imgbbKey = import.meta.env.VITE_IMGBB_KEY;
    if (!imgbbKey) {
      toast.error("Missing imgbb API key (VITE_IMGBB_KEY).");
      return;
    }

    setSubmitting(true);
    try {
      const imgFormData = new FormData();
      imgFormData.append("image", imageFile);
      const uploadRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: "POST",
        body: imgFormData,
      });
      const uploadJson = await uploadRes.json();
      if (!uploadJson.success) {
        throw new Error(uploadJson?.error?.message || "Image upload failed");
      }
      const imageUrl = uploadJson.data.url;

      const payload = {
        title: formData.get("title"),
        from: formData.get("from"),
        to: formData.get("to"),
        transportType: formData.get("transportType"),
        price: Number(formData.get("price")),
        quantity: Number(formData.get("quantity")),
        departureDate: formData.get("departureDate"),
        departureTime: formData.get("departureTime"),
        perks,
        imageUrl,
        vendorName: user?.displayName || "",
        vendorEmail: user?.email || "",
      };

      // TODO: Replace with actual API call to your backend
      console.log("Ticket payload", payload);
      toast.success("Ticket added successfully!");
      form.reset();
    } catch (err) {
      toast.error(err.message || "Failed to add ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Add Ticket</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Ticket title</label>
          <input name="title" type="text" required className="w-full border rounded px-3 py-2" placeholder="e.g., Dhaka to Chittagong" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">From (Location)</label>
          <input name="from" type="text" required className="w-full border rounded px-3 py-2" placeholder="Starting point" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">To (Location)</label>
          <input name="to" type="text" required className="w-full border rounded px-3 py-2" placeholder="Destination" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Transport type</label>
          <select name="transportType" required className="w-full border rounded px-3 py-2">
            <option value="">Select type</option>
            <option value="Bus">Bus</option>
            <option value="Train">Train</option>
            <option value="Air">Air</option>
            <option value="Ship">Ship</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price (per unit)</label>
          <input name="price" type="number" min="0" step="0.01" required className="w-full border rounded px-3 py-2" placeholder="0.00" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ticket quantity</label>
          <input name="quantity" type="number" min="1" required className="w-full border rounded px-3 py-2" placeholder="e.g., 40" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Departure date</label>
            <input name="departureDate" type="date" required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Departure time</label>
            <input name="departureTime" type="time" required className="w-full border rounded px-3 py-2" />
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
                <input type="checkbox" name="perks" value={perk} />
                <span>{perk}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Image upload (imgbb)</label>
          <input name="image" type="file" accept="image/*" required className="w-full border rounded px-3 py-2" />
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
