import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Neelakar Creative House — Luxury Creative Studio"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#060F0B",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(200,169,110,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(200,169,110,0.05) 0%, transparent 50%)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://neelakar-v2.vercel.app/NCH_logo_white.png"
            alt=""
            width={140}
            height={140}
            style={{ opacity: 0.9 }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <div
              style={{
                fontSize: "72px",
                color: "rgba(255,255,255,0.92)",
                fontWeight: 300,
                fontStyle: "italic",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                fontFamily: "serif",
              }}
            >
              Neelakar
            </div>
            <div
              style={{
                fontSize: "38px",
                color: "rgba(255,255,255,0.7)",
                fontWeight: 300,
                fontStyle: "italic",
                letterSpacing: "0.02em",
                lineHeight: 1,
                fontFamily: "serif",
              }}
            >
              Creative House
            </div>
          </div>

          <div
            style={{
              width: "60px",
              height: "1px",
              backgroundColor: "rgba(200,169,110,0.4)",
              marginTop: "8px",
            }}
          />

          <div
            style={{
              fontSize: "14px",
              color: "rgba(200,169,110,0.6)",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              fontWeight: 500,
              marginTop: "4px",
            }}
          >
            Branding &bull; Campaigns &bull; Film &bull; Identity
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
