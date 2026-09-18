import type { Metadata } from "next";
import { NotFoundView } from "@/components/NotFoundView";

export const metadata: Metadata = {
  title: "404",
};

export default function NotFound() {
  return <NotFoundView />;
}
