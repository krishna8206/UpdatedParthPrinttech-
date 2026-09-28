import Navbar from "@/components/Navbar/Navbar";
import VideoSlider from "@/components/Home/VideoSlider/VideoSlider";
import WhoWeAre from "@/components/Home/WhoWeAre/WhoWeAre";
import MarketsWeServe from "@/components/Home/MarketsWeServe/MarketsWeServe";
import Products from "@/components/Home/Products/Products";
import Clients from "@/components/Home/Clients/Clients";
import Testimonials from "@/components/Home/Testimonials/Testimonials";
import OurValues from "@/components/Home/OurValues/OurValues";
import Footer from "@/components/Footer/Footer";
import { fetchHomeData } from "@/lib/api";

export default async function Home() {
  const homeData = await fetchHomeData();

  return (
    <div>
      <Navbar />
      <VideoSlider data={homeData?.heroSlides} heroVideo={homeData?.heroVideo} />
      <WhoWeAre data={homeData?.whoWeAre} />
      <MarketsWeServe data={homeData?.markets} />
      <Products data={homeData?.featuredProducts} />
      <Clients data={homeData?.clients} />
      <Testimonials data={homeData?.testimonials} />
      <OurValues data={homeData?.values} />
      <Footer />
    </div>
  );
}
export const metadata = {
  title: "Parth Printing Technology | Premium Label & Shrink Film Solutions",
  description: "High-precision label printing and premium shrink sleeve packaging films. Specialized in PVC, PETG, BOPP, HTL, and Plain PVC shrink films.",
};
