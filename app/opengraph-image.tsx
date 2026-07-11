import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/og-fonts";

export const alt = "Gründbar — pitch your idea, find your people";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GROTESK_TEXT =
  "Pitch your idea. Find your people. gründbar.";
const MONO_TEXT =
  "✳ THE STARTUP IDEA REGISTRY good ideas are foundable a project by vivekreddy.de";

export default async function Image() {
  const [grotesk, mono] = await Promise.all([
    loadGoogleFont("Schibsted+Grotesk:wght@700", GROTESK_TEXT),
    loadGoogleFont("JetBrains+Mono:wght@500", MONO_TEXT),
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
          padding: 72,
          background: "#fafdf9",
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
              fontFamily: "Grotesk",
              fontSize: 36,
              color: "#101613",
              display: "flex",
            }}
          >
            gründbar<span style={{ color: "#059669" }}>.</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: "JetBrains Mono",
              fontSize: 19,
              letterSpacing: 4,
              color: "#64748b",
            }}
          >
            <span style={{ color: "#059669", fontSize: 24 }}>✳</span>
            THE STARTUP IDEA REGISTRY
          </div>
        </div>

        <div
          style={{
            fontFamily: "Grotesk",
            fontSize: 88,
            letterSpacing: -3,
            color: "#101613",
            lineHeight: 1.08,
            display: "flex",
            flexDirection: "column",
            maxWidth: 950,
          }}
        >
          <div style={{ display: "flex" }}>
            Pitch your&nbsp;
            <span
              style={{
                backgroundImage:
                  "linear-gradient(transparent 52%, #d9f99d 52%, #d9f99d 92%, transparent 92%)",
                padding: "0 6px",
              }}
            >
              idea.
            </span>
          </div>
          <div>Find your people.</div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "JetBrains Mono",
            fontSize: 21,
            color: "#94a3b8",
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
        { name: "Grotesk", data: grotesk, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    }
  );
}
