import InputContainer from "@/components/InputContainer";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex h-full w-full flex-col">
      <div className="flex h-[300px] flex-grow-0 flex-col items-center justify-center gap-[16px]">
        <Image src={"/logo.png"} alt="logo" height={450} width={450} />
        {/* <h1 className={clsx(pacifico.className, "text-[10rem]")}>Ripple</h1>
        <p className="text-[1.5rem] font-semibold">
          Your message, a ripple in time
        </p> */}
      </div>
      <div className="flex-grow ">
        <InputContainer />
      </div>
    </main>
  );
}
