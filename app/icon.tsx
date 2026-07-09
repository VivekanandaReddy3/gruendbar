import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/og-fonts";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const anton = await loadGoogleFont("Anton", "G");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c2e25",
          color: "#c8f04b",
          fontFamily: "Anton",
          fontSize: 24,
        }}
      >
        G
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Anton", data: anton, weight: 400, style: "normal" }],
    }
  );
}
