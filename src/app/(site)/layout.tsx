import SmoothScroll from "@/components/SmoothScroll";
import SparkleClickEffect from "@/components/SparkleClickEffect";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SparkleClickEffect />
      <SmoothScroll />
      <div className="flex-1">{children}</div>
    </>
  );
}
