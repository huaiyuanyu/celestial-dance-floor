import ThreeScene from "@/components/three/ThreeScene";

export default function Home() {
  return (
    <>
      <div className="pointer-events-none">
        <ThreeScene />
      </div>
      <div className="absolute top-4 left-4 z-10 flex gap-4 pointer-events-auto">
          <a
            href="https://github.com/huaiyuanyu/celestial-dance-floor"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              className="bg-black text-white border-2 border-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Repo
            </button>
          </a>
          <a
            href="https://gary-yu.vercel.app/#works"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              className="bg-black text-white border-2 border-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Portfolio
            </button>
          </a>
      </div>
    </>
  );
}
