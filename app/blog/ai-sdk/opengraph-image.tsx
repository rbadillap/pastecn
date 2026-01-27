import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "pnpx shadcn@latest add @pastecn/ai-sdk"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "monospace",
        }}
      >
        {/* Terminal window */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#171717",
            borderRadius: "16px",
            border: "1px solid #262626",
            padding: "32px 48px",
            maxWidth: "900px",
          }}
        >
          {/* Terminal header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
              paddingBottom: "16px",
              borderBottom: "1px solid #262626",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#ef4444",
              }}
            />
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#eab308",
              }}
            />
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#22c55e",
              }}
            />
            <span
              style={{
                fontSize: "16px",
                color: "#737373",
                marginLeft: "8px",
              }}
            >
              terminal
            </span>
          </div>

          {/* Command */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "32px",
            }}
          >
            <span style={{ color: "#525252" }}>$</span>
            <span style={{ color: "#737373" }}>pnpx</span>
            <span style={{ color: "#e5e5e5" }}>shadcn@latest add</span>
            <span style={{ color: "#4ade80" }}>@pastecn/ai-sdk</span>
          </div>
        </div>

        {/* Prompt simulation */}
        <div
          style={{
            display: "flex",
            marginTop: "48px",
            fontSize: "20px",
            color: "#525252",
            fontStyle: "italic",
          }}
        >
          &quot;Create a button component and share it via pastecn&quot;
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
