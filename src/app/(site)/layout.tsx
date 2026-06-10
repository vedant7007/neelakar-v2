import SmoothScroll from "@/components/SmoothScroll";
import SparkleClickEffect from "@/components/SparkleClickEffect";
import Navbar from "@/components/Navbar";
import AdminGateway from "@/components/AdminGateway";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminGateway />
      <SparkleClickEffect />
      <SmoothScroll />
      <Navbar />
      <div className="flex-1">{children}</div>
    </>
  );
}
