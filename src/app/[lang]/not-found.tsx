import type { Metadata } from "next";
import { NotFoundView } from "@/components/NotFoundView";
import { buildNotFoundStrings } from "@/components/not-found-strings";

export const metadata: Metadata = {
  title: "404",
};

export default function LocaleNotFound() {
  return <NotFoundView nested stringsByLocale={buildNotFoundStrings()} />;
}
