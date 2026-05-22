import Image from "next/image";
import { Squircle } from "@squircle-js/react";
import { AppShell } from "../components/AppShell";

const FRIENDS = [
  {
    name: "Carl",
    img: "/images/carl.png",
    bg: "linear-gradient(0deg, #858686 5%, #d5d4cd 100%)",
    accent:
      "radial-gradient(ellipse at 55% 50%, rgba(75,122,122,1) 0%, rgba(67,196,255,0.59) 45%, transparent 100%)",
  },
  {
    name: "Mary",
    img: "/images/mary.png",
    bg: "linear-gradient(0deg, #e9822e 5%, #d5d4cd 100%)",
    accent:
      "radial-gradient(ellipse at 55% 50%, rgba(255,67,95,1) 0%, rgba(255,67,95,0.59) 45%, transparent 100%)",
  },
  {
    name: "Jason",
    img: "/images/jason.png",
    bg: "linear-gradient(0deg, #10a65e 5%, #d5d4cd 100%)",
    accent:
      "radial-gradient(ellipse at 55% 50%, rgba(188,255,43,1) 0%, rgba(188,255,43,0.59) 45%, transparent 100%)",
  },
  {
    name: "Emma",
    img: "/images/emma.png",
    bg: "linear-gradient(0deg, #10a65e 5%, #d5d4cd 100%)",
    accent:
      "radial-gradient(ellipse at 55% 50%, rgba(69,75,184,1) 0%, rgba(69,75,184,0.59) 45%, transparent 100%)",
  },
];

export default function SocialPage() {
  return (
    <AppShell active="social">
      <section>
        <h2 className="text-[28px] font-normal leading-[1.08] text-black px-[9px] max-[380px]:text-[26px] max-[340px]:text-[24px]">
          Share your vibe with…
        </h2>

        <div className="mt-[14px] -mx-[14px] px-[14px] pb-2 grid grid-flow-col auto-cols-[144px] gap-[6px] overflow-x-auto scrollbar-none">
          {FRIENDS.map((f) => (
            <Squircle
              key={f.name}
              cornerRadius={40}
              cornerSmoothing={0.7}
              defaultWidth={144}
              defaultHeight={189}
              asChild
            >
              <div
                className="relative w-full h-[189px] overflow-hidden flex flex-col items-center justify-center gap-[14px] p-[16px]"
                style={{ background: f.bg }}
              >
                <div
                  className="absolute inset-0 mix-blend-screen opacity-90"
                  style={{ background: f.accent }}
                />
                <div className="relative w-[min(62%,104px)] aspect-[89/105]">
                  <Image
                    src={f.img}
                    alt={f.name}
                    fill
                    className="object-contain"
                    sizes="(min-width: 640px) 104px, 28vw"
                  />
                </div>
                <span className="relative text-white font-medium text-[24px] leading-none max-[340px]:text-[22px]">
                  {f.name}
                </span>
              </div>
            </Squircle>
          ))}
        </div>
      </section>

      <section className="mt-[24px]">
        <h2 className="text-[28px] font-normal leading-[1.08] text-black px-[9px] max-[380px]:text-[26px] max-[340px]:text-[24px]">
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
            <div className="relative w-[164px] h-[204px] shrink-0 max-[360px]:w-[138px] max-[360px]:h-[172px]">
              <Image
                src="/images/relay-union.png"
                alt="Relay group"
                fill
                className="object-contain"
                sizes="(min-width: 640px) 240px, 38vw"
              />
              <div className="absolute top-[6%] left-[10%] w-[49%] aspect-square rounded-full overflow-hidden">
                <Image
                  src="/images/relay-avatar1.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </div>
              <div className="absolute top-[40%] left-[55%] w-[49%] aspect-square rounded-full overflow-hidden">
                <Image
                  src="/images/relay-icon.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </div>
              <div className="absolute bottom-[6%] left-[18%] w-[34%] aspect-square rounded-full overflow-hidden">
                <Image
                  src="/images/relay-avatar2.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="82px"
                />
              </div>
            </div>

            <div className="relative min-w-0 flex-1 flex flex-col items-center gap-[14px] text-white">
              <span className="text-[16px] font-medium text-white/70 uppercase max-[340px]:text-[14px]">
                Relay
              </span>
              <p className="text-[28px] leading-none text-center font-medium max-[380px]:text-[24px] max-[340px]:text-[20px]">
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
                  className="px-[21px] py-[7px] bg-[#4b4b4b]/35 text-white text-[20px] font-medium backdrop-blur-sm max-[340px]:text-[18px]"
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
