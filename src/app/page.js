"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [title, setTitle] = useState(null);
  const [showDamien, setShowDamien] = useState(false);

  useEffect(() => {
    const options = [
      { text: "🩰 Ballerrrinaaa ☕ Cappuccciiiinnnaa" },
      { text: "Aaarhghaaggga..... 💀" },
      { text: "😲 (**visage choqué**)" },
      {
        isLink: true,
        text: "Click here to know what time it is 🕒",
        href: "http://quelleheureestilenjoy.com/",
      },
      { text: "hmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm" },
    ];
    const random = options[Math.floor(Math.random() * options.length)];
    setTitle(random);
  }, []);

  return (
    <main className="py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-500 mb-4">
        {title?.isLink ? (
          <a
            href={title.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {title.text}
          </a>
        ) : (
          title?.text
        )}
      </h1>

      <p className="text-lg mb-8 text-gray-300">
        A playground of side projects, dumb jokes, and weird experiments.
      </p>

      {/* Damien toggle section */}
      <div className="mb-10">
        <button
          onClick={() => setShowDamien(!showDamien)}
          className="text-pink-400 font-semibold mb-4 hover:underline transition flex items-center gap-2"
        >
          {showDamien ? "Hide Damien 🐶⬆️" : "Show Damien 🐶⬇️"}
        </button>
        {showDamien && (
          <div>
            <p className="mb-2">Your grosse daronne Damien :D</p>
            <Image
              src="/damien.jpg"
              width={250}
              height={250}
              alt="Damien"
              className="rounded-lg border border-white w-full max-w-[250px]"
            />
          </div>
        )}
      </div>

      {/* Project cards */}
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Latest Projects</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/talaref"
          className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow hover:shadow-lg transition flex flex-col justify-between"
        >
          <h3 className="text-xl font-semibold mb-2">talaref 📚</h3>
          <p className="text-gray-400 text-sm">
            The pretty niche ref db to flex on your friends
          </p>
        </Link>

        <Link
          href="/b2b"
          className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow hover:shadow-lg transition flex flex-col justify-between"
        >
          <h3 className="text-xl font-semibold mb-2">B2B 🔥</h3>
          <p className="text-gray-400 text-sm">bendo2bendo.</p>
        </Link>

        <Link
          href="/flops"
          className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow hover:shadow-lg transition flex items-center justify-center text-3xl"
          title="Shhh... it's a secret"
        >
          💀
        </Link>

        <Link
          href="/sanity-checker"
          className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow hover:shadow-lg transition flex flex-col justify-between"
        >
          <h3 className="text-xl font-semibold mb-2">rot.</h3>
          <p className="text-gray-400 text-sm">🕒</p>
        </Link>

        <Link
          href="/radar"
          className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold mb-2">🍽️ Restaurant Radar</h3>
          <p className="text-gray-400 text-sm">
            Find spots around you, instantly.
          </p>
        </Link>
      </div>
    </main>
  );
}
