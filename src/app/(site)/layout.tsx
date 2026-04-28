import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollToTop from "@/components/ScrollToTop";
import WavyClickEffect from "@/components/WavyClickEffect";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollProgress />
      <ScrollToTop />
      <WavyClickEffect />
      <SmoothScroll />
      <div className="flex-1">{children}</div>
    </>
  );
}
