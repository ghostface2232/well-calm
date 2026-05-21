import Link from "next/link";

export default function StateFullscreenPage() {
  return (
    <div
      className="relative min-h-screen w-full max-w-[402px] mx-auto overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #ff3fbf 23%, #ffd042 49%, #ffd042 63%, #ff3fbf 142%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 30% 70% at 50% 50%, rgba(255,63,191,1) 0%, rgba(204,60,156,0.75) 25%, rgba(153,57,121,0.5) 50%, rgba(51,51,51,0) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-66"
        style={{
          background:
            "radial-gradient(ellipse 40% 25% at 53% 50%, rgba(255,208,66,1) 0%, rgba(213,152,67,0.08) 70%)",
        }}
      />

      <div className="relative pt-[53px] px-[17px]">
        <Link
          href="/"
          aria-label="Back"
          className="inline-flex items-center justify-center w-[54px] h-[54px] rounded-full bg-white/20 backdrop-blur-md text-white text-[28px]"
        >
          ←
        </Link>

        <h1 className="mt-[25px] text-white text-[48px] leading-none tracking-[-0.96px]">
          Calm
        </h1>
        <p className="mt-[14px] text-white/75 text-[20px] tracking-[-0.12px] font-medium">
          Overall Mental State
        </p>

        <div className="relative mt-[30px] h-[30px] w-full">
          <img
            src="/images/wave-fullscreen.png"
            alt=""
            aria-hidden
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mt-[40px] space-y-[16px]">
          <div className="h-[108px] rounded-[40px] bg-white/25 backdrop-blur-md" />
          <div className="h-[202px] rounded-[40px] bg-white/25 backdrop-blur-md" />
          <div className="grid grid-cols-2 gap-[14px]">
            <div className="h-[184px] rounded-[40px] bg-white/25 backdrop-blur-md" />
            <div className="h-[184px] rounded-[40px] bg-white/25 backdrop-blur-md" />
          </div>
          <div className="h-[195px] rounded-[40px] bg-white/25 backdrop-blur-md" />
        </div>
      </div>
    </div>
  );
}
