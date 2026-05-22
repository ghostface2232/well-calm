import { CSSProperties } from "react";
import Image from "next/image";
import { Squircle } from "@squircle-js/react";
import { AppShell } from "../components/AppShell";

// The memoji PNGs are framed inconsistently — Carl is a 256×256 head-only
// crop, the others are 421×421 full memojis — so each lands at a different
// size and height. `transform` normalizes them: `scale` brings every figure
// to ~84% of the frame height, `translateY` centers its alpha bounding box
// (CSS order applies scale first, then translate). The content percentages
// in each comment are the measured non-transparent box of that PNG.
const FRIENDS = [
  {
    name: "Carl",
    img: "/images/carl.png",
    bg: "linear-gradient(0deg, #858686 5%, #d5d4cd 100%)",
    accent:
      "radial-gradient(ellipse at 55% 50%, rgba(75,122,122,1) 0%, rgba(67,196,255,0.59) 45%, transparent 100%)",
    // content 51%w × 68%h, centered 51%,47% — head-only crop, scaled up most
    transform: "translateY(3.3%) scale(1.25)",
    // inner-glow rim — a pale, brighter tint of the card's own hue (see State
    // cards), fed to `.wc-mesh-rim` via --wc-rim in app/globals.css
    rim: "#d8eefa",
  },
  {
    name: "Mary",
    img: "/images/mary.png",
    bg: "linear-gradient(0deg, #e9822e 5%, #d5d4cd 100%)",
    accent:
      "radial-gradient(ellipse at 55% 50%, rgba(255,67,95,1) 0%, rgba(255,67,95,0.59) 45%, transparent 100%)",
    // content 72%w × 83%h, centered 50%,54% — long hair sits low, nudge up
    transform: "translateY(-3.7%) scale(1)",
    rim: "#ffdcd2",
  },
  {
    name: "Jason",
    img: "/images/jason.png",
    bg: "linear-gradient(0deg, #10a65e 5%, #d5d4cd 100%)",
    accent:
      "radial-gradient(ellipse at 55% 50%, rgba(188,255,43,1) 0%, rgba(188,255,43,0.59) 45%, transparent 100%)",
    // content 71%w × 86%h, centered 44%,44% — fist sits high, nudge down
    transform: "translateY(4.9%) scale(1)",
    rim: "#eafac9",
  },
  {
    name: "Emma",
    img: "/images/emma.png",
    bg: "linear-gradient(0deg, #10a65e 5%, #d5d4cd 100%)",
    accent:
      "radial-gradient(ellipse at 55% 50%, rgba(69,75,184,1) 0%, rgba(69,75,184,0.59) 45%, transparent 100%)",
    // content 71%w × 85%h, centered 41%,53%
    transform: "translateY(-2.5%) scale(1)",
    rim: "#dee0f3",
  },
];

// Profile lobes for the Relay metaball. `top`/`left`/`width` are percentages of
// the 164×204 container, centered on the matching lobe in the union SVG
// (top + middle lobes r=44.6748, bottom lobe r=32.814 in the 163.674×204 viewBox).
// `transform` sizes and recenters each memoji: the source PNGs have lots of
// transparent padding and off-center artwork, so each is scaled so its content
// is ~80% of the circle height, then nudged so it sits centered without clipping.
const RELAY = [
  {
    name: "Tim",
    img: "/images/relay-avatar1.png",
    gradient: "linear-gradient(180deg, #8E61BB 0%, #D89DC4 100%)",
    top: "3.4%",
    left: "4.3%",
    width: "46%",
    // content fills 72% height, sits 11.6% above canvas center
    transform: "translateY(12.8%) scale(1.105)",
  },
  {
    name: "Clara",
    img: "/images/relay-icon.png",
    gradient: "linear-gradient(180deg, #D0A87E 0%, #5C3F2D 100%)",
    top: "35.6%",
    left: "49.7%",
    width: "46%",
    // content fills 98% height, already centered
    transform: "scale(0.813)",
  },
  {
    name: "Jane",
    img: "/images/relay-avatar2.png",
    gradient: "linear-gradient(180deg, #F0AEB4 0%, #F5D2B6 100%)",
    top: "70.2%",
    left: "14.6%",
    width: "34%",
    // content fills 83% height, sits 5.5% below canvas center
    transform: "translateY(-5.3%) scale(0.966)",
  },
];

export default function SocialPage() {
  return (
    <AppShell active="social">
      <section>
        <h2 className="text-[28px] font-normal leading-[1.08] text-white px-[9px] max-[380px]:text-[26px] max-[340px]:text-[24px]">
          Share your vibe with…
        </h2>

        <div
          className="relative left-1/2 mt-[14px] w-screen -translate-x-1/2 pb-2 grid grid-flow-col auto-cols-[158px] gap-[6px] overflow-x-auto scrollbar-none"
          style={{
            paddingLeft: "max(14px, calc((100vw - 402px) / 2 + 14px))",
            paddingRight: "max(14px, calc((100vw - 402px) / 2 + 14px))",
          }}
        >
          {FRIENDS.map((f) => (
            <Squircle
              key={f.name}
              cornerRadius={40}
              cornerSmoothing={0.7}
              defaultWidth={158}
              defaultHeight={208}
              asChild
            >
              <div
                className="relative w-full h-[208px] overflow-hidden flex flex-col items-center justify-center gap-[14px] p-[16px]"
                style={{ background: f.bg }}
              >
                <div
                  className="absolute inset-0 mix-blend-screen opacity-90"
                  style={{ background: f.accent }}
                />
                {/* inner-glow rim — same treatment as the State metric cards */}
                <div
                  className="wc-mesh-rim absolute inset-0"
                  style={{ "--wc-rim": f.rim } as CSSProperties}
                />
                <div className="relative w-[min(72%,124px)] aspect-[89/105]">
                  <Image
                    src={f.img}
                    alt={f.name}
                    fill
                    className="object-contain"
                    style={{ transform: f.transform }}
                    sizes="(min-width: 640px) 124px, 32vw"
                  />
                </div>
                <span className="relative text-white font-medium text-[25px] leading-none max-[340px]:text-[22px]">
                  {f.name}
                </span>
              </div>
            </Squircle>
          ))}
        </div>
      </section>

      <section className="mt-[24px]">
        <h2 className="text-[28px] font-normal leading-[1.08] text-white px-[9px] max-[380px]:text-[26px] max-[340px]:text-[24px]">
          The baton&rsquo;s open.
        </h2>

        <Squircle
          cornerRadius={40}
          cornerSmoothing={0.7}
          asChild
        >
          <div
            className="mt-[14px] relative min-h-[255px] overflow-hidden flex items-center gap-[6px] p-[16px]"
            style={{
              background:
                "linear-gradient(124deg, #e6be9d 2%, #df6807 84%), radial-gradient(ellipse at 55% 50%, rgba(255,242,202,0.59) 0%, rgba(230,190,157,1) 100%)",
            }}
          >
            {/* inner-glow rim — same treatment as the State metric cards */}
            <div
              className="wc-mesh-rim absolute inset-0"
              style={{ "--wc-rim": "#ffe8d0" } as CSSProperties}
            />
            <div className="relative w-[164px] h-[204px] shrink-0 max-[360px]:w-[138px] max-[360px]:h-[172px]">
              <svg
                viewBox="0 0 163.674 204"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <path
                  d="M44.6748 0C69.3476 0.000247393 89.3486 20.002 89.3486 44.6748C89.3486 48.1922 88.9405 51.6143 88.1719 54.8975C86.2515 64.6749 93.9727 71.5073 103.433 68.417C108.28 66.6146 113.525 65.6279 119 65.6279C143.673 65.628 163.674 85.629 163.674 110.302C163.674 134.975 143.673 154.976 119 154.977C112.63 154.977 106.572 153.64 101.089 151.237C89.9244 146.747 81.9095 154.854 83.7188 163.588C84.2969 166.027 84.6045 168.57 84.6045 171.186C84.6045 189.308 69.9135 204 51.791 204C33.6684 204 18.9766 189.308 18.9766 171.186C18.9767 153.063 33.6685 138.372 51.791 138.372C55.5592 138.372 59.1786 139.009 62.5488 140.178C71.0421 142.792 79.8516 135.629 76.5039 124.11C75.0918 119.762 74.3252 115.121 74.3252 110.302C74.3252 106.793 74.7312 103.379 75.4961 100.104C77.4341 90.3142 69.7113 83.4678 60.2451 86.5576C55.3966 88.3608 50.1512 89.3486 44.6748 89.3486C20.002 89.3486 0.000247425 69.3476 0 44.6748C0 20.0018 20.0018 0 44.6748 0Z"
                  fill="#FFFFFF"
                />
              </svg>
              {RELAY.map((r) => (
                <div
                  key={r.name}
                  className="absolute aspect-square rounded-full overflow-hidden"
                  style={{
                    top: r.top,
                    left: r.left,
                    width: r.width,
                    background: r.gradient,
                  }}
                >
                  <Image
                    src={r.img}
                    alt=""
                    fill
                    className="object-cover"
                    style={{ transform: r.transform }}
                    sizes="120px"
                  />
                </div>
              ))}
            </div>

            <div className="relative min-w-0 flex-1 flex flex-col items-center gap-[14px] text-center text-white">
              <span className="text-[16px] font-medium text-white/70 uppercase max-[340px]:text-[14px]">
                Relay
              </span>
              <p className="w-full text-[28px] leading-none font-medium max-[380px]:text-[24px] max-[340px]:text-[20px]">
                Tim, Clara
                <br />
                and Jane&rsquo;s
                <br />
                Baton Touch
              </p>
              <Squircle
                cornerRadius={18.5}
                cornerSmoothing={0.7}
                defaultWidth={106}
                defaultHeight={34}
                asChild
              >
                <button
                  type="button"
                  className="mt-[10px] inline-flex items-center justify-center bg-[#4b4b4b]/35 text-white text-[20px] font-medium backdrop-blur-sm max-[340px]:text-[18px]"
                >
                  JOIN
                </button>
              </Squircle>
            </div>
          </div>
        </Squircle>
      </section>
    </AppShell>
  );
}
