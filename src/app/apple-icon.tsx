import { ImageResponse } from "next/og";

export const contentType = "image/png";
export const size = {
  width: 180,
  height: 180,
};

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#dfe8e1",
          color: "#2f453d",
          fontSize: 46,
          fontWeight: 700,
          letterSpacing: 3,
          borderRadius: 36,
        }}
      >
        青岚
      </div>
    ),
    size,
  );
}
