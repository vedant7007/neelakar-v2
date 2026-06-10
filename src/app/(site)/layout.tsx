import SmoothScroll from "@/components/shared/SmoothScroll";
import SparkleClickEffect from "@/components/shared/SparkleClickEffect";
import Navbar from "@/components/shared/Navbar";
import AdminGateway from "@/components/shared/AdminGateway";

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
