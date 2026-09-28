import Navbar from "@/components/Navbar/Navbar";
import WhoWeAre from "@/components/Home/WhoWeAre/WhoWeAre";
import styles from "../page.module.css";

export default function Home() {
  return (
    <div>
      <Navbar />
      <WhoWeAre />
    </div>
  );
}
