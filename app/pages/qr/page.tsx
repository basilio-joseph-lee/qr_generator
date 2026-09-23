"use client";
import { useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";

// Each sticker: which image, its size, and where it sits on the card.
// Put the images in public/images/ and edit the file names here.
type StickerData = { src: string; size: number; className: string };

const formStickers: StickerData[] = [
  { src: "/images/sticker1.jpg", size: 120, className: "-right-10 -top-25 rotate-12" },
  { src: "/images/sticker2.jpg", size: 200, className: "-left-43 -bottom-20 -rotate-12" },
  { src: "/images/sticker3.jpg", size: 130, className: "-right-20 -bottom-8 rotate-6" },
];

const resultSticker: StickerData = {
  src: "/images/sticker4.jpg",
  size: 110,
  className: "-left-10 -top-15 -rotate-6",
};

function Sticker({ src, size, className }: StickerData) {
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={`pointer-events-none absolute drop-shadow-md ${className}`}
    />
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [qr, setQr] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let link = url.trim();
    if (!link) {
      setQr("");
      return setError("Please paste a link first.");
    }
    // Add https:// if Rose forgot it
    if (!/^https?:\/\//i.test(link)) link = "https://" + link;

    try {
      new URL(link); // throws if the link is not valid
      const img = await QRCode.toDataURL(link, {
        width: 1024,
        margin: 2,
        color: { dark: "#9f1239", light: "#ffffff" },
      });
      setQr(img);
      setError("");
    } catch {
      setQr("");
      setError("That doesn't look like a valid link. Try again.");
    }
  }

  function handleClear() {
    setUrl("");
    setQr("");
    setError("");
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-rose-50 px-4 py-30 text-rose-950">
      <div className="mx-auto max-w-md">
        {/* Form card + its stickers */}
        <div className="relative">
          <div className="h-2 rounded-t-2xl bg-rose-600" />
          <form
            onSubmit={handleSubmit}
            className="rounded-b-2xl border border-rose-200 bg-white p-6 shadow-sm"
          >
            <h1 className="font-serif text-3xl font-semibold text-rose-600">
              Rose QR Generator
            </h1>
            <p className="mt-2 text-sm text-rose-900/70">
              Paste a link and get a QR code you can download. Free and unlimited.
            </p>

            <label htmlFor="link" className="mt-6 block text-sm font-semibold">
              Your link <span className="text-rose-600">*</span>
            </label>
            <input
              id="link"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="mt-2 w-full border-b-2 border-rose-200 bg-transparent py-2 outline-none focus:border-rose-600"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="rounded-lg bg-rose-600 px-5 py-2 font-semibold text-white hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                Generate QR
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="rounded-lg px-5 py-2 font-semibold text-rose-600 hover:bg-rose-100"
              >
                Clear
              </button>
            </div>
          </form>

          {formStickers.map((s) => (
            <Sticker key={s.src} {...s} />
          ))}
        </div>

        {/* QR result card + sticker */}
        {qr && (
          <div className="relative mt-40 flex flex-col items-center rounded-2xl border border-rose-200 bg-white p-6 shadow-sm">
            <img src={qr} alt="Your QR code" className="w-64 rounded-lg" />
            <a
              href={qr}
              download="rose-qr.jpg"
              className="mt-5 rounded-lg bg-rose-600 px-5 py-2 font-semibold text-white hover:bg-rose-700"
            >
              Download jpg
            </a>
            <Sticker {...resultSticker} />
          </div>
        )}

        <p className="mt-12 text-center text-sm text-rose-900/60">
          Made with love for Rose
        </p>
      </div>
    </main>
  );
}