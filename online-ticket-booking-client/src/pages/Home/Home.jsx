import Hero from "../../components/Home/Hero";
import Advertisement from "../../components/Home/Advertisement";
import LatestTickets from "../../components/Home/LatestTickets";
import PopularRoutes from "../../components/Home/PopularRoutes";
import WhyChooseUs from "../../components/Home/WhyChooseUs";
import HowItWorks from "../../components/Home/HowItWorks";
import PromoSection from "../../components/Home/PromoSection";

const Home = () => {
    return (
          <section>
              <Hero />
              <HowItWorks />
              <Advertisement />
              <WhyChooseUs />
              <LatestTickets />
              <PromoSection />
              <PopularRoutes />
          </section>
    );
};

export default Home;