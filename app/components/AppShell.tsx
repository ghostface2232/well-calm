import { ReactNode } from "react";
import { TabNav, type TabKey } from "./TabNav";

export function AppShell({ active, children }: { active: TabKey; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[402px] min-h-screen px-[14px] pt-[32px] pb-10">
      <h1 className="text-[40px] font-normal leading-[1.08] text-white px-[9px] max-[380px]:text-[37px] max-[340px]:text-[34px]">
        Hi, Mingwan.
        <br />
        How are you doing today?
      </h1>

      <TabNav active={active} />

      <main className="mt-[24px]">{children}</main>
    </div>
  );
}
