import InputContainer from "@/components/InputContainer";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex h-full w-full flex-col">
      <div className="flex h-[300px] flex-grow-0 flex-col items-center justify-center gap-[16px]">
        <div className="flex h-[300px] w-[300px] items-center lg:h-[400px] lg:w-[400px]">
          <Image
            src={"/logo.png"}
            alt="logo"
            height={180}
            width={180}
            layout="responsive"
          />
        </div>
      </div>
      <div className="flex flex-grow items-center justify-center ">
        <InputContainer />
      </div>
    </main>
  );
}
