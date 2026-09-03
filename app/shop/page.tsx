import type { Metadata } from "next";
import ShopClient from "../../components/ShopClient";

export const metadata: Metadata = {
  title: "Mağaza",
  description: "MIRA kadın, erkek ve aksesuar koleksiyonlarını keşfedin.",
};

export default function ShopPage() {
  return <ShopClient />;
}

