"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

export default function TalarefList() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from("talaref_entries")
        .select("*")
        .order("id", { ascending: true });

      if (error) console.error("Error fetching talaref entries:", error);
      else setEntries(data);
    };

    fetchEntries();
  }, []);

  return (
    <main className="py-12 px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-500">
          📚 Talaref?
        </h1>
        <Link
          href="/talaref/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold"
        >
          ➕ Add a Ref
        </Link>
      </div>

      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {entries.map((entry) => (
          <Link
            key={entry.id}
            href={`/talaref/${entry.slug}`}
            className="bg-gray-900 border border-gray-700 rounded-lg hover:shadow-md hover:bg-gray-800 transition h-64 min-w-[8rem] p-3 flex flex-col justify-between items-center text-center"
          >
            <div className="flex-grow flex items-center justify-center">
              {entry.thumbnail?.startsWith("http") ? (
                <Image
                  src={entry.thumbnail}
                  alt={entry.title}
                  width={64}
                  height={64}
                  className="object-cover rounded max-w-[64px] max-h-[64px]"
                />
              ) : (
                <span className="text-5xl">{entry.thumbnail}</span>
              )}
            </div>
            <h3 className="text-sm font-bold mt-4 break-words">
              {entry.title}
            </h3>
          </Link>
        ))}
      </div>
    </main>
  );
}