import { ImageResponse } from "next/og";

export const contentType = "image/png";
export const size = {
  width: 512,
  height: 512,
};

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #e7efe8 0%, #d6e1d9 100%)",
          color: "#2f453d",
          fontSize: 116,
          fontWeight: 700,
          letterSpacing: 6,
        }}
      >
        青岚
      </div>
    ),
    size,
  );
}
