import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stories | Slow Namibia",
  description: "Essays exploring the landscapes, wildlife, and ancient cultures of Namibia — from the Himba to the Namib Desert, Etosha to the Skeleton Coast.",
  openGraph: {
    title: "Stories | Slow Namibia",
    description: "Essays exploring the landscapes, wildlife, and ancient cultures of Namibia.",
    type: "website",
  },
};

export default function StoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
