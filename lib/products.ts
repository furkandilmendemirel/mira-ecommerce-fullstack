export type Category = "women" | "men" | "accessories";

export type Product = {
  id: number;
  name: string;
  category: Category;
  categoryLabel: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  colors: string[];
  colorImages?: Record<string, string>;
  sizes?: string[];
  description: string;
  featured?: boolean;
};

export const getProductSizes = (product: Pick<Product, "name" | "category" | "sizes">) => {
  if (product.sizes) return product.sizes;
  if (product.name.toLocaleLowerCase("tr-TR").includes("sneaker")) {
    return ["36", "37", "38", "39", "40", "41", "42"];
  }
  if (product.category === "accessories") return [];
  return ["S", "M", "L", "XL"];
};

const colorLabels: Record<string, string> = {
  "#c9ad8b": "Bej",
  "#202124": "Siyah",
  "#ded6cb": "Krem",
  "#f3f3f1": "Beyaz",
  "#d54935": "Kırmızı",
  "#263a2e": "Koyu yeşil",
  "#a34a52": "Bordo",
  "#1f2023": "Siyah",
  "#f0ece3": "Krem",
  "#91a8b1": "Mavi",
  "#52604f": "Haki",
  "#ded5c8": "Bej",
  "#a8b6aa": "Adaçayı",
  "#7b6876": "Mürdüm",
  "#22252a": "Lacivert",
  "#816d5d": "Vizon",
  "#6e402b": "Kahverengi",
  "#151515": "Siyah",
  "#d0b58a": "Taba",
  "#7891aa": "Denim mavisi",
  "#34383f": "Antrasit",
  "#222d3a": "Lacivert",
  "#e7e0d5": "Krem",
  "#7d282c": "Bordo",
  "#d1b36d": "Altın",
  "#bbc0c4": "Gümüş",
  "#f2eee6": "Krem",
  "#42566f": "Mavi",
  "#8f8b7f": "Vizon",
  "#29313a": "Antrasit",
};

export const getColorLabel = (color: string) =>
  colorLabels[color.toLowerCase()] ?? color;

export const categories = [
  {
    id: "women",
    label: "Kadın",
    count: 5,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "men",
    label: "Erkek",
    count: 4,
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "accessories",
    label: "Aksesuar",
    count: 3,
    image:
      "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&w=1200&q=85",
  },
] as const;

export const products: Product[] = [
  {
    id: 1,
    name: "Kum Beji Trençkot",
    category: "women",
    categoryLabel: "Kadın",
    price: 2499,
    oldPrice: 2999,
    rating: 4.8,
    reviews: 124,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85",
    colors: ["#c9ad8b", "#202124", "#ded6cb"],
    colorImages: {
      "#c9ad8b": "/products/kum-beji-trenckot/bej.png",
      "#202124": "/products/kum-beji-trenckot/siyah.png",
      "#ded6cb": "/products/kum-beji-trenckot/krem.png",
    },
    description:
      "Mevsim geçişleri için tasarlanan akışkan kesimli trençkot. Hafif dokusu ve zamansız kalıbıyla günlük kombinlere kolayca uyum sağlar.",
    featured: true,
  },
  {
    id: 2,
    name: "Minimal Beyaz Sneaker",
    category: "accessories",
    categoryLabel: "Aksesuar",
    price: 1899,
    rating: 4.9,
    reviews: 208,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
    colors: ["#f3f3f1", "#d54935"],
    colorImages: {
      "#f3f3f1": "/products/minimal-beyaz-sneaker/beyaz.png",
      "#d54935": "/products/minimal-beyaz-sneaker/kirmizi.png",
    },
    description:
      "Gün boyu konfor sağlayan destekli taban ve nefes alan yüzey. Şehir temposuna uygun yalın bir sneaker.",
    featured: true,
  },
  {
    id: 3,
    name: "Saten Midi Elbise",
    category: "women",
    categoryLabel: "Kadın",
    price: 2199,
    rating: 4.7,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85",
    colors: ["#263a2e", "#a34a52", "#1f2023"],
    colorImages: {
      "#263a2e": "/products/saten-midi-elbise/yesil.png",
      "#a34a52": "/products/saten-midi-elbise/bordo.png",
      "#1f2023": "/products/saten-midi-elbise/siyah.png",
    },
    description:
      "Işığı yumuşakça yansıtan saten yüzey, dengeli midi boy ve modern yaka detayıyla gece ve davet stilinin ana parçası.",
    featured: true,
  },
  {
    id: 4,
    name: "Dokulu Günlük Gömlek",
    category: "men",
    categoryLabel: "Erkek",
    price: 1299,
    oldPrice: 1499,
    rating: 4.6,
    reviews: 71,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85",
    colors: ["#f0ece3", "#91a8b1", "#52604f"],
    colorImages: {
      "#f0ece3": "/products/dokulu-gunluk-gomlek/krem.png",
      "#91a8b1": "/products/dokulu-gunluk-gomlek/mavi.png",
      "#52604f": "/products/dokulu-gunluk-gomlek/haki.png",
    },
    description:
      "Rahat kesimli, doğal dokulu ve kolay kombinlenen günlük gömlek. Katmanlı kullanım için ideal ağırlıkta.",
    featured: true,
  },
  {
    id: 5,
    name: "Yumuşak Dokulu Kazak",
    category: "women",
    categoryLabel: "Kadın",
    price: 1599,
    rating: 4.8,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85",
    colors: ["#ded5c8", "#a8b6aa", "#7b6876"],
    colorImages: {
      "#ded5c8": "/products/yumusak-dokulu-kazak/bej.png",
      "#a8b6aa": "/products/yumusak-dokulu-kazak/adacayi.png",
      "#7b6876": "/products/yumusak-dokulu-kazak/murdum.png",
    },
    description:
      "Yumuşak tuşeli iplik, düşük omuz ve rahat silüet. Serin günlerde konforlu ve rafine bir görünüm sunar.",
  },
  {
    id: 6,
    name: "Modern Kesim Ceket",
    category: "men",
    categoryLabel: "Erkek",
    price: 2799,
    rating: 4.7,
    reviews: 64,
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=85",
    colors: ["#22252a", "#816d5d", "#52604f"],
    colorImages: {
      "#22252a": "/products/modern-kesim-ceket/lacivert.png",
      "#816d5d": "/products/modern-kesim-ceket/vizon.png",
      "#52604f": "/products/modern-kesim-ceket/haki.png",
    },
    description:
      "Net omuz çizgisi ve sade detaylarla güncellenen klasik ceket. Ofisten akşam buluşmalarına geçişi kolaylaştırır.",
  },
  {
    id: 7,
    name: "Deri Omuz Çantası",
    category: "accessories",
    categoryLabel: "Aksesuar",
    price: 1999,
    rating: 4.9,
    reviews: 112,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85",
    colors: ["#6e402b", "#151515", "#d0b58a"],
    colorImages: {
      "#6e402b": "/products/deri-omuz-cantasi/kahverengi.png",
      "#151515": "/products/deri-omuz-cantasi/siyah.png",
      "#d0b58a": "/products/deri-omuz-cantasi/taba.png",
    },
    description:
      "Günlük ihtiyaçlara uygun bölmeler, ayarlanabilir askı ve dayanıklı yüzey. Zamansız formuyla her stile eşlik eder.",
  },
  {
    id: 8,
    name: "Oversize Denim Ceket",
    category: "women",
    categoryLabel: "Kadın",
    price: 1899,
    rating: 4.6,
    reviews: 98,
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=85",
    colors: ["#7891aa", "#34383f"],
    colorImages: {
      "#7891aa": "/products/oversize-denim-ceket/mavi.png",
      "#34383f": "/products/oversize-denim-ceket/antrasit.png",
    },
    description:
      "Yumuşatılmış denim kumaş ve dengeli oversize kalıp. Dört mevsim kullanılabilen güçlü bir katman parçası.",
  },
  {
    id: 9,
    name: "Klasik Polo Yaka",
    category: "men",
    categoryLabel: "Erkek",
    price: 1099,
    rating: 4.5,
    reviews: 53,
    image:
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=900&q=85",
    colors: ["#222d3a", "#e7e0d5", "#7d282c"],
    colorImages: {
      "#222d3a": "/products/klasik-polo-yaka/lacivert.png",
      "#e7e0d5": "/products/klasik-polo-yaka/krem.png",
      "#7d282c": "/products/klasik-polo-yaka/bordo.png",
    },
    description:
      "Nefes alan pamuklu doku ve temiz yaka formu. Günlük şıklığın kolay ve güvenilir tamamlayıcısı.",
  },
  {
    id: 10,
    name: "İnce Metal Saat",
    category: "accessories",
    categoryLabel: "Aksesuar",
    price: 2399,
    rating: 4.8,
    reviews: 142,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85",
    colors: ["#d1b36d", "#bbc0c4"],
    colorImages: {
      "#d1b36d": "/products/ince-metal-saat/altin.png",
      "#bbc0c4": "/products/ince-metal-saat/gumus.png",
    },
    description:
      "İnce kasa, sade kadran ve ayarlanabilir metal bilezik. Günlük ve klasik kombinlerle uyumlu.",
  },
  {
    id: 11,
    name: "Çizgili Yazlık Elbise",
    category: "women",
    categoryLabel: "Kadın",
    price: 1699,
    rating: 4.7,
    reviews: 76,
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=85",
    colors: ["#f2eee6", "#42566f"],
    colorImages: {
      "#f2eee6": "/products/cizgili-yazlik-elbise/krem.png",
      "#42566f": "/products/cizgili-yazlik-elbise/mavi.png",
    },
    description:
      "Hafif kumaş, bel vurgusu ve hareketli etek formuyla sıcak günlere uygun ferah bir silüet.",
  },
  {
    id: 12,
    name: "Rahat Kesim Pantolon",
    category: "men",
    categoryLabel: "Erkek",
    price: 1399,
    rating: 4.6,
    reviews: 67,
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=85",
    colors: ["#8f8b7f", "#29313a"],
    colorImages: {
      "#8f8b7f": "/products/rahat-kesim-pantolon/vizon.png",
      "#29313a": "/products/rahat-kesim-pantolon/antrasit.png",
    },
    description:
      "Esnek bel yapısı ve modern daralan paça. Uzun günlerde rahatlıkla şehir stilini bir araya getirir.",
  },
];
