import { TrackClient } from "./TrackClient";
import { getMessages } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const messages: any = await getMessages();
  const t = messages.Metadata.track;
  return {
    title: t.title,
    description: t.description,
  };
}

export default function TrackPage() {
  return <TrackClient />;
}
