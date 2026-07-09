import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/og-fonts";

export const alt = "Gründbar — pitch your idea, find your people";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TITLE = "PITCH YOUR IDEA. FIND YOUR PEOPLE.";
const MONO =
  "GRÜNDBAR. THE STARTUP IDEA REGISTRY a project by vivekreddy.de good ideas are foundable";

export default async function Image() {
  const [anton, mono] = await Promise.all([
    loadGoogleFont("Anton", TITLE + "GRÜNDBAR."),
    loadGoogleFont("IBM+Plex+Mono:wght@500", MONO),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#f4f0e4",
          border: "16px solid #0c2e25",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Anton",
              fontSize: 40,
              color: "#0c2e25",
            }}
          >
            GRÜNDBAR.
          </div>
          <div
            style={{
              fontFamily: "IBM Plex Mono",
              fontSize: 19,
              letterSpacing: 4,
              color: "#0c2e25",
              background: "#c8f04b",
              border: "3px solid #0c2e25",
              padding: "8px 16px",
            }}
          >
            THE STARTUP IDEA REGISTRY
          </div>
        </div>

        <div
          style={{
            fontFamily: "Anton",
            fontSize: 110,
            lineHeight: 0.98,
            color: "#0c2e25",
            maxWidth: 1000,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>PITCH YOUR</span>
          <span
            style={{
              background: "#c8f04b",
              alignSelf: "flex-start",
              padding: "0 16px",
            }}
          >
            IDEA.
          </span>
          <span>FIND YOUR PEOPLE.</span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "IBM Plex Mono",
            fontSize: 21,
            color: "#0c2e25",
          }}
        >
          <div>good ideas are foundable</div>
          <div>a project by vivekreddy.de</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Anton", data: anton, weight: 400, style: "normal" },
        { name: "IBM Plex Mono", data: mono, weight: 500, style: "normal" },
      ],
    }
  );
}
