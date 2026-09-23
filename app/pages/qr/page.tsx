"use client";
import { useState } from "react";
import QRCode from "qrcode";

export default function QrScreen() {
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
    <main className="min-h-screen bg-rose-50 px-4 py-10 text-rose-950">
      <div className="mx-auto max-w-md">
        <div className="mb-3 h-2 rounded-t-2xl bg-rose-600" />
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

        {qr && (
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-rose-200 bg-white p-6 shadow-sm">
            <img src={qr} alt="Your QR code" className="w-64 rounded-lg" />
            <a
              href={qr}
              download="rose-qr.png"
              className="mt-5 rounded-lg bg-rose-600 px-5 py-2 font-semibold text-white hover:bg-rose-700"
            >
              Download PNG
            </a>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-rose-900/60">
          Made with love for Rose
        </p>
      </div>
    </main>
  );
}