import Hero from "../../components/Home/Hero";
import Advertisement from "../../components/Home/Advertisement";
import LatestTickets from "../../components/Home/LatestTickets";
import PopularRoutes from "../../components/Home/PopularRoutes";
import WhyChooseUs from "../../components/Home/WhyChooseUs";

const Home = () => {
    return (
          <section>
              <Hero />
              <Advertisement />
              <LatestTickets />
              <PopularRoutes />
              <WhyChooseUs />
          </section>
    );
};

export default Home;