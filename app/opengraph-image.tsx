import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/og-fonts";

export const alt = "Gründbar — pitch your idea, find your people";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TITLE = "Pitch your idea. Find your people.";
const TAGLINE = "because good ideas are gründbar — foundable.";
const MONO = "gründbar. THE STARTUP IDEA DIRECTORY a project by vivekreddy.de";

export default async function Image() {
  const [grotesk, serif, mono] = await Promise.all([
    loadGoogleFont("Schibsted+Grotesk:wght@700", TITLE + "gründbar."),
    loadGoogleFont("Newsreader:ital,wght@1,500", TAGLINE),
    loadGoogleFont("JetBrains+Mono:wght@500", MONO),
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
              fontSize: 34,
              color: "#10160f",
              display: "flex",
            }}
          >
            gründbar<span style={{ color: "#059669" }}>.</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontFamily: "JetBrains Mono",
              fontSize: 19,
              letterSpacing: 4,
              color: "#64748b",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 9999,
                background: "#10b981",
              }}
            />
            THE STARTUP IDEA DIRECTORY
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Grotesk",
              fontSize: 84,
              letterSpacing: -3,
              color: "#10160f",
              lineHeight: 1.05,
              maxWidth: 950,
            }}
          >
            {TITLE}
          </div>
          <div
            style={{
              fontFamily: "Newsreader",
              fontStyle: "italic",
              fontSize: 38,
              color: "#64748b",
              marginTop: 18,
            }}
          >
            {TAGLINE}
          </div>
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
          <div>a project by vivekreddy.de</div>
          <div style={{ color: "#059669" }}>gründbar.</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Grotesk", data: grotesk, weight: 700, style: "normal" },
        { name: "Newsreader", data: serif, weight: 500, style: "italic" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    }
  );
}
