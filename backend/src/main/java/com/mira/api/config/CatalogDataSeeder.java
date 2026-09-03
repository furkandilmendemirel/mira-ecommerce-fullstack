package com.mira.api.config;

import com.mira.api.category.Category;
import com.mira.api.category.CategoryRepository;
import com.mira.api.product.Product;
import com.mira.api.product.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Component
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true", matchIfMissing = true)
public class CatalogDataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CatalogDataSeeder(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (productRepository.count() > 0) {
            backfillProductOptions();
            return;
        }

        Category women = category("Kadın", "women", "k", "4.90",
                "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85");
        Category men = category("Erkek", "men", "e", "4.80",
                "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1200&q=85");
        Category accessories = category("Aksesuar", "accessories", "k", "4.85",
                "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&w=1200&q=85");

        product("Kum Beji Trençkot", "Mevsim geçişleri için tasarlanan akışkan kesimli trençkot. Hafif dokusu ve zamansız kalıbıyla günlük kombinlere kolayca uyum sağlar.",
                "2499.00", 18, "4.80", 124, women,
                "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85");
        product("Minimal Beyaz Sneaker", "Gün boyu konfor sağlayan destekli taban ve nefes alan yüzey. Şehir temposuna uygun yalın bir sneaker.",
                "1899.00", 32, "4.90", 208, accessories,
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85");
        product("Saten Midi Elbise", "Işığı yumuşakça yansıtan saten yüzey, dengeli midi boy ve modern yaka detayıyla gece ve davet stilinin ana parçası.",
                "2199.00", 21, "4.70", 89, women,
                "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85");
        product("Dokulu Günlük Gömlek", "Rahat kesimli, doğal dokulu ve kolay kombinlenen günlük gömlek. Katmanlı kullanım için ideal ağırlıkta.",
                "1299.00", 27, "4.60", 71, men,
                "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85");
        product("Yumuşak Dokulu Kazak", "Yumuşak tuşeli iplik, düşük omuz ve rahat silüet. Serin günlerde konforlu ve rafine bir görünüm sunar.",
                "1599.00", 25, "4.80", 156, women,
                "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85");
        product("Modern Kesim Ceket", "Net omuz çizgisi ve sade detaylarla güncellenen klasik ceket. Ofisten akşam buluşmalarına geçişi kolaylaştırır.",
                "2799.00", 14, "4.70", 64, men,
                "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=85");
        product("Deri Omuz Çantası", "Günlük ihtiyaçlara uygun bölmeler, ayarlanabilir askı ve dayanıklı yüzey. Zamansız formuyla her stile eşlik eder.",
                "1999.00", 19, "4.90", 112, accessories,
                "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85");
        product("Oversize Denim Ceket", "Yumuşatılmış denim kumaş ve dengeli oversize kalıp. Dört mevsim kullanılabilen güçlü bir katman parçası.",
                "1899.00", 23, "4.60", 98, women,
                "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=85");
        product("Klasik Polo Yaka", "Nefes alan pamuklu doku ve temiz yaka formu. Günlük şıklığın kolay ve güvenilir tamamlayıcısı.",
                "1099.00", 36, "4.50", 53, men,
                "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=900&q=85");
        product("İnce Metal Saat", "İnce kasa, sade kadran ve ayarlanabilir metal bilezik. Günlük ve klasik kombinlerle uyumlu.",
                "2399.00", 16, "4.80", 142, accessories,
                "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85");
        product("Çizgili Yazlık Elbise", "Hafif kumaş, bel vurgusu ve hareketli etek formuyla sıcak günlere uygun ferah bir silüet.",
                "1699.00", 20, "4.70", 76, women,
                "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=85");
        product("Rahat Kesim Pantolon", "Esnek bel yapısı ve modern daralan paça. Uzun günlerde rahatlıkla şehir stilini bir araya getirir.",
                "1399.00", 28, "4.60", 67, men,
                "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=85");
    }

    private Category category(String title, String code, String gender, String rating, String image) {
        return categoryRepository.findByCodeIgnoreCase(code).orElseGet(() -> categoryRepository.save(
                new Category(title, title + " koleksiyonu", code, image, new BigDecimal(rating), gender)
        ));
    }

    private void product(String name, String description, String price, int stock, String rating,
                         int reviews, Category category, String image) {
        Product product = new Product(name, description, new BigDecimal(price), stock,
                1, new BigDecimal(rating), reviews, category, List.of(image));
        product.setSizes(sizeOptions(product));
        product.setColors(colorOptions(product));
        product.setColorImages(colorImages(product));
        productRepository.save(product);
    }

    private void backfillProductOptions() {
        productRepository.findAll().forEach(product -> {
            if (product.getSizes().isEmpty()) product.setSizes(sizeOptions(product));
            Map<String, String> catalogColorImages = colorImages(product);
            if (!catalogColorImages.isEmpty()) {
                product.setColors(colorOptions(product));
                product.setColorImages(catalogColorImages);
            } else if (product.getColors().isEmpty()) {
                product.setColors(colorOptions(product));
            }
        });
    }

    private List<String> sizeOptions(Product product) {
        if (product.getName().toLowerCase().contains("sneaker")) {
            return List.of("36", "37", "38", "39", "40", "41", "42");
        }
        if ("accessories".equals(product.getCategory().getCode())) {
            return List.of();
        }
        return List.of("S", "M", "L", "XL");
    }

    private List<String> colorOptions(Product product) {
        return switch (product.getName()) {
            case "Kum Beji Trençkot" -> List.of("#c9ad8b", "#202124", "#ded6cb");
            case "Minimal Beyaz Sneaker" -> List.of("#f3f3f1", "#d54935");
            case "Saten Midi Elbise" -> List.of("#263a2e", "#a34a52", "#1f2023");
            case "Dokulu Günlük Gömlek" -> List.of("#f0ece3", "#91a8b1", "#52604f");
            case "Yumuşak Dokulu Kazak" -> List.of("#ded5c8", "#a8b6aa", "#7b6876");
            case "Modern Kesim Ceket" -> List.of("#22252a", "#816d5d", "#52604f");
            case "Deri Omuz Çantası" -> List.of("#6e402b", "#151515", "#d0b58a");
            case "Oversize Denim Ceket" -> List.of("#7891aa", "#34383f");
            case "Klasik Polo Yaka" -> List.of("#222d3a", "#e7e0d5", "#7d282c");
            case "İnce Metal Saat" -> List.of("#d1b36d", "#bbc0c4");
            case "Çizgili Yazlık Elbise" -> List.of("#f2eee6", "#42566f");
            case "Rahat Kesim Pantolon" -> List.of("#8f8b7f", "#29313a");
            default -> switch (product.getCategory().getCode()) {
                case "men" -> List.of("#22252a", "#816d5d", "#52604f");
                case "accessories" -> List.of("#d1b36d", "#151515", "#bbc0c4");
                default -> List.of("#c9ad8b", "#202124", "#ded6cb");
            };
        };
    }

    private Map<String, String> colorImages(Product product) {
        return switch (product.getName()) {
            case "Kum Beji Trençkot" -> Map.of(
                    "#c9ad8b", "/products/kum-beji-trenckot/bej.png",
                    "#202124", "/products/kum-beji-trenckot/siyah.png",
                    "#ded6cb", "/products/kum-beji-trenckot/krem.png");
            case "Minimal Beyaz Sneaker" -> Map.of(
                    "#f3f3f1", "/products/minimal-beyaz-sneaker/beyaz.png",
                    "#d54935", "/products/minimal-beyaz-sneaker/kirmizi.png");
            case "Saten Midi Elbise" -> Map.of(
                    "#263a2e", "/products/saten-midi-elbise/yesil.png",
                    "#a34a52", "/products/saten-midi-elbise/bordo.png",
                    "#1f2023", "/products/saten-midi-elbise/siyah.png");
            case "Dokulu Günlük Gömlek" -> Map.of(
                    "#f0ece3", "/products/dokulu-gunluk-gomlek/krem.png",
                    "#91a8b1", "/products/dokulu-gunluk-gomlek/mavi.png",
                    "#52604f", "/products/dokulu-gunluk-gomlek/haki.png");
            case "Yumuşak Dokulu Kazak" -> Map.of(
                    "#ded5c8", "/products/yumusak-dokulu-kazak/bej.png",
                    "#a8b6aa", "/products/yumusak-dokulu-kazak/adacayi.png",
                    "#7b6876", "/products/yumusak-dokulu-kazak/murdum.png");
            case "Modern Kesim Ceket" -> Map.of(
                    "#22252a", "/products/modern-kesim-ceket/lacivert.png",
                    "#816d5d", "/products/modern-kesim-ceket/vizon.png",
                    "#52604f", "/products/modern-kesim-ceket/haki.png");
            case "Deri Omuz Çantası" -> Map.of(
                    "#6e402b", "/products/deri-omuz-cantasi/kahverengi.png",
                    "#151515", "/products/deri-omuz-cantasi/siyah.png",
                    "#d0b58a", "/products/deri-omuz-cantasi/taba.png");
            case "Oversize Denim Ceket" -> Map.of(
                    "#7891aa", "/products/oversize-denim-ceket/mavi.png",
                    "#34383f", "/products/oversize-denim-ceket/antrasit.png");
            case "Klasik Polo Yaka" -> Map.of(
                    "#222d3a", "/products/klasik-polo-yaka/lacivert.png",
                    "#e7e0d5", "/products/klasik-polo-yaka/krem.png",
                    "#7d282c", "/products/klasik-polo-yaka/bordo.png");
            case "İnce Metal Saat" -> Map.of(
                    "#d1b36d", "/products/ince-metal-saat/altin.png",
                    "#bbc0c4", "/products/ince-metal-saat/gumus.png");
            case "Çizgili Yazlık Elbise" -> Map.of(
                    "#f2eee6", "/products/cizgili-yazlik-elbise/krem.png",
                    "#42566f", "/products/cizgili-yazlik-elbise/mavi.png");
            case "Rahat Kesim Pantolon" -> Map.of(
                    "#8f8b7f", "/products/rahat-kesim-pantolon/vizon.png",
                    "#29313a", "/products/rahat-kesim-pantolon/antrasit.png");
            default -> Map.of();
        };
    }
}
