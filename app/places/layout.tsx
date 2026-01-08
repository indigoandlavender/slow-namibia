import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Places | Slow Namibia",
  description: "The deserts, dunes, and wilderness areas that make Namibia worth slowing down for.",
  openGraph: {
    title: "Places | Slow Namibia",
    description: "The deserts, dunes, and wilderness areas that make Namibia worth slowing down for.",
    type: "website",
  },
};

export default function PlacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
