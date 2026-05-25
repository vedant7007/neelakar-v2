import SmoothScroll from "@/components/SmoothScroll";
import SparkleClickEffect from "@/components/SparkleClickEffect";
import Navbar from "@/components/Navbar";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SparkleClickEffect />
      <SmoothScroll />
      <Navbar />
      <div className="flex-1">{children}</div>
    </>
  );
}
