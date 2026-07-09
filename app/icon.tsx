import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/og-fonts";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const grotesk = await loadGoogleFont("Schibsted+Grotesk:wght@700", "g");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#065f46",
          borderRadius: 7,
          color: "#fafdf9",
          fontFamily: "Grotesk",
          fontSize: 22,
          paddingBottom: 3,
        }}
      >
        g
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Grotesk", data: grotesk, weight: 700, style: "normal" }],
    }
  );
}
