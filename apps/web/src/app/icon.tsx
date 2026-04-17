import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
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
            height: 392,
            width: 392,
            borderRadius: 108,
            border: "2px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.05)",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              height: 208,
              width: 18,
              borderRadius: 999,
              background: "#f26a3d",
              right: 124,
              top: 98,
            }}
          />
          <div
            style={{
              position: "absolute",
              height: 18,
              width: 90,
              borderRadius: 999,
              background: "#f26a3d",
              right: 88,
              top: 98,
            }}
          />
          <div
            style={{
              position: "absolute",
              height: 20,
              width: 20,
              borderRadius: 999,
              background: "#31a0a3",
              right: 123,
              bottom: 99,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 20,
              height: 184,
              borderRadius: 999,
              background: "#f8f3ee",
              transform: "rotate(24deg)",
              left: 138,
              top: 119,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 20,
              height: 184,
              borderRadius: 999,
              background: "#f8f3ee",
              transform: "rotate(-24deg)",
              left: 220,
              top: 119,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 106,
              height: 18,
              borderRadius: 999,
              background: "#f8f3ee",
              left: 151,
              top: 227,
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
