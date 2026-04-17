import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "radial-gradient(circle at 14% 18%, rgba(242,106,59,0.18), transparent 22%), radial-gradient(circle at 86% 80%, rgba(49,160,163,0.14), transparent 24%), linear-gradient(180deg, #f5efe8 0%, #efe8de 100%)",
          color: "#f8f3ee",
          padding: "54px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            borderRadius: 34,
            border: "1px solid rgba(9,20,31,0.08)",
            background:
              "linear-gradient(145deg, rgba(13,22,34,0.98), rgba(20,41,59,0.94) 62%, rgba(26,58,83,0.92) 100%)",
            padding: "46px",
            boxShadow: "0 28px 80px rgba(9,20,31,0.16)",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  height: 82,
                  width: 82,
                  borderRadius: 26,
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: 6,
                    height: 42,
                    borderRadius: 999,
                    background: "#f26a3d",
                    right: 24,
                    top: 20,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    width: 19,
                    height: 6,
                    borderRadius: 999,
                    background: "#f26a3d",
                    right: 18,
                    top: 20,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    background: "#31a0a3",
                    right: 23.5,
                    bottom: 19,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    width: 6,
                    height: 40,
                    borderRadius: 999,
                    background: "#f8f3ee",
                    transform: "rotate(24deg)",
                    left: 23,
                    top: 24,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    width: 6,
                    height: 40,
                    borderRadius: 999,
                    background: "#f8f3ee",
                    transform: "rotate(-24deg)",
                    left: 40,
                    top: 24,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    width: 24,
                    height: 6,
                    borderRadius: 999,
                    background: "#f8f3ee",
                    left: 27,
                    top: 44,
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: "-0.05em" }}>
                  ash-tra.com
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 17,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    opacity: 0.72,
                  }}
                >
                  Design-led website transformation
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  borderRadius: 999,
                  padding: "12px 18px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                Premium positioning
              </div>
              <div
                style={{
                  display: "flex",
                  borderRadius: 999,
                  padding: "12px 18px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(49,160,163,0.12)",
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                SEO + client journey
              </div>
            </div>
          </div>

          <div style={{ display: "flex", maxWidth: 880, flexDirection: "column", gap: 18 }}>
            <div
              style={{
                fontSize: 72,
                lineHeight: 0.96,
                fontWeight: 700,
                letterSpacing: "-0.06em",
              }}
            >
              Premium websites and client portals for serious service businesses.
            </div>
            <div style={{ fontSize: 28, lineHeight: 1.35, opacity: 0.78, maxWidth: 860 }}>
              Clearer messaging, stronger SEO foundations, better accessibility,
              multilingual readiness, and a smoother client journey.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 18,
            }}
          >
            {["Clearer messaging", "SEO + accessibility", "Client portal experience"].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  borderRadius: 26,
                  padding: "16px 22px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  fontSize: 20,
                  fontWeight: 600,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
