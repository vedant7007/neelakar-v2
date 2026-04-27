import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollToTop from "@/components/ScrollToTop";
import WavyClickEffect from "@/components/WavyClickEffect";
import AsciiSection from "@/components/sections/AsciiSection";
import CrowdCanvasSection from "@/components/sections/CrowdCanvasSection";

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
      <section id="signature" className="w-full overflow-hidden">
        <AsciiSection />
        <CrowdCanvasSection />
      </section>
    </>
  );
}
