"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "/lib/supabaseClient";
import Image from "next/image";
import { TwitterTweetEmbed } from "react-twitter-embed";

export default function TalarefEntryPage() {
  const { slug } = useParams();
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const fetchEntry = async () => {
      const { data, error } = await supabase
        .from("talaref_entries")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) console.error(error);
      else setEntry(data);
    };

    fetchEntry();
  }, [slug]);

  const extractTweetId = (url) => {
    try {
      const match = url.match(/status\/(\d+)/);
      return match?.[1] || null;
    } catch {
      return null;
    }
  };

  if (!entry) return <p className="text-white p-10">Loading...</p>;

  return (
    <main className="py-12">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-500 mb-2">{entry.title}</h1>
        <p className="mb-6 text-gray-300 text-lg">{entry.context}</p>

        <div className="border border-gray-700 rounded-lg bg-gray-900 p-4 md:p-6 lg:p-8 flex justify-center items-center">
          {entry.media_type === "image" && (
            <Image
              src={entry.link}
              alt={entry.title}
              width={1000}
              height={600}
              className="rounded-md object-contain w-full"
            />
          )}

          {entry.media_type === "video" && (
            <div className="w-full aspect-video">
              <iframe
                src={entry.link}
                title={entry.title}
                className="w-full h-full rounded-md"
                allowFullScreen
              />
            </div>
          )}

          {entry.media_type === "embed" &&
          entry.link.includes("twitter.com") ? (
            <div className="w-full flex justify-center">
              <div className="max-w-xl w-full bg-black/10 p-4 rounded-md">
                <TwitterTweetEmbed tweetId={extractTweetId(entry.link)} />
              </div>
            </div>
          ) : entry.media_type === "embed" ? (
            <iframe
              src={entry.link}
              className="w-full h-[480px] rounded-md"
              title={entry.title}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : null}

          {entry.media_type === "text" && (
            <p className="text-lg text-center">{entry.link}</p>
          )}
        </div>
      </div>
    </main>
  );
}
