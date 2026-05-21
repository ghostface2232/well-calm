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
        <h2 className="text-[28px] leading-[1.08] tracking-[-0.28px] text-black px-[9px]">
          Share your vibe with…
        </h2>

        <div className="mt-[14px] -mx-[14px] px-[14px] pb-2 flex gap-[8px] overflow-x-auto scrollbar-none">
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
                className="relative shrink-0 w-[144px] h-[189px] overflow-hidden flex flex-col items-center justify-center gap-[14px] p-[16px]"
                style={{ background: f.bg }}
              >
                <div
                  className="absolute inset-0 mix-blend-screen opacity-90"
                  style={{ background: f.accent }}
                />
                <div className="relative w-[89px] h-[105px]">
                  <Image
                    src={f.img}
                    alt={f.name}
                    fill
                    className="object-contain"
                    sizes="89px"
                  />
                </div>
                <span className="relative text-white font-medium text-[24px] leading-none">
                  {f.name}
                </span>
              </div>
            </Squircle>
          ))}
        </div>
      </section>

      <section className="mt-[24px]">
        <h2 className="text-[28px] leading-[1.08] tracking-[-0.28px] text-black px-[9px]">
          The baton&rsquo;s open.
        </h2>

        <Squircle
          cornerRadius={40}
          cornerSmoothing={0.7}
          defaultWidth={374}
          defaultHeight={255}
          asChild
        >
          <div
            className="mt-[14px] relative h-[255px] overflow-hidden flex items-center gap-[6px] p-[16px]"
            style={{
              background:
                "linear-gradient(124deg, #e6be9d 2%, #df6807 84%), radial-gradient(ellipse at 55% 50%, rgba(255,242,202,0.59) 0%, rgba(230,190,157,1) 100%)",
            }}
          >
            <div className="relative w-[164px] h-[204px] shrink-0">
              <Image
                src="/images/relay-union.png"
                alt="Relay group"
                fill
                className="object-contain"
                sizes="164px"
              />
              <div className="absolute top-[6%] left-[10%] w-[80px] h-[80px] rounded-full overflow-hidden">
                <Image
                  src="/images/relay-avatar1.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="absolute top-[40%] left-[55%] w-[80px] h-[80px] rounded-full overflow-hidden">
                <Image
                  src="/images/relay-icon.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="absolute bottom-[6%] left-[18%] w-[55px] h-[55px] rounded-full overflow-hidden">
                <Image
                  src="/images/relay-avatar2.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="55px"
                />
              </div>
            </div>

            <div className="relative flex-1 flex flex-col items-center gap-[14px] text-white">
              <span className="text-[16px] font-medium tracking-[-0.32px] text-white/70 uppercase">
                Relay
              </span>
              <p className="text-[28px] leading-none tracking-[-0.3px] text-center font-medium">
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
                  className="px-[21px] py-[7px] bg-[#4b4b4b]/35 text-white text-[20px] font-medium tracking-[-0.4px] backdrop-blur-sm"
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
