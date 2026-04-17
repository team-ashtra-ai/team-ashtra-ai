import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 24% 18%, rgba(242,106,59,0.18), transparent 28%), radial-gradient(circle at 84% 84%, rgba(49,160,163,0.16), transparent 30%), linear-gradient(145deg, #0d1622 0%, #17324a 58%, #10283d 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            height: 136,
            width: 136,
            borderRadius: 38,
            border: "1.5px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.05)",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              height: 72,
              width: 7,
              borderRadius: 999,
              background: "#f26a3d",
              right: 42,
              top: 34,
            }}
          />
          <div
            style={{
              position: "absolute",
              height: 7,
              width: 32,
              borderRadius: 999,
              background: "#f26a3d",
              right: 29,
              top: 34,
            }}
          />
          <div
            style={{
              position: "absolute",
              height: 8,
              width: 8,
              borderRadius: 999,
              background: "#31a0a3",
              right: 42,
              bottom: 35,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 7,
              height: 66,
              borderRadius: 999,
              background: "#f8f3ee",
              transform: "rotate(24deg)",
              left: 46,
              top: 43,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 7,
              height: 66,
              borderRadius: 999,
              background: "#f8f3ee",
              transform: "rotate(-24deg)",
              left: 75,
              top: 43,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 38,
              height: 7,
              borderRadius: 999,
              background: "#f8f3ee",
              left: 53,
              top: 83,
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
