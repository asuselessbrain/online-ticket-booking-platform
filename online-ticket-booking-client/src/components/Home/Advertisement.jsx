import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import TicketCard from "../shared/TicketCard";
import Loading from "../shared/Loading";

const Advertisement = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["advertisedTickets"],
    queryFn: async () => {
      const res = await api.get("/api/v1/tickets/approved/list", {
        params: {
          limit: 6,
        },
      });
      // Filter to only show advertised tickets
      const allTickets = res.data?.data?.data || [];
      return allTickets.filter((t) => t.isAdvertised === true);
    },
  });

  const tickets = data || [];

  if (isLoading) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-[1440px] mx-auto">
          <Loading message="Loading featured tickets..." fullPage={false} />
        </div>
      </section>
    );
  }

  if (!tickets.length) {
    return null;
  }

  return (
    <section aria-labelledby="advertisement-heading" className="py-12 px-4">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 id="advertisement-heading" className="text-2xl font-extrabold text-slate-900">
            Featured Tickets
          </h2>
          <p className="text-sm text-slate-500">Approved tickets by vendors</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.slice(0, 6).map((t) => (
            <TicketCard key={t._id} ticket={t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advertisement;
