"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { categories } from "../lib/products";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchProducts,
  setCategory,
  setQuery,
  setSort,
} from "../store/productSlice";
import ProductCard from "./ProductCard";

export default function ShopClient() {
  const dispatch = useAppDispatch();
  const { items, total, status, error, filters } = useAppSelector(
    (state) => state.products,
  );
  const [limit, setLimit] = useState(8);

 useEffect(() => {
  dispatch(
    fetchProducts({
      filters: {
        category: filters.category,
        query: filters.query,
        sort: filters.sort,
      },
      limit,
    })
  );
}, [
  dispatch,
  filters.category,
  filters.query,
  filters.sort,
  limit,
]);
  return (
    <main>
      <section className="shop-hero page-shell">
        <div>
          <span className="eyebrow">MIRA / MAĞAZA</span>
          <h1>Kendine göre olanı bul.</h1>
          <p>
            Zamansız temel parçalar, güçlü aksesuarlar ve yeni sezon
            favorileri tek yerde.
          </p>
        </div>
      </section>

      <section className="category-strip page-shell">
        {categories.map((category) => (
          <button
            className={filters.category === category.id ? "active" : ""}
            type="button"
            key={category.id}
            onClick={() => {
              dispatch(setCategory(category.id));
              setLimit(8);
            }}
          >
            <img src={category.image} alt="" />
            <span>{category.label}</span>
          </button>
        ))}
      </section>

      <section className="shop-layout page-shell">
        <aside className="filters">
          <h2>Filtreler</h2>
          <button
            type="button"
            className={filters.category === "all" ? "active" : ""}
            onClick={() => dispatch(setCategory("all"))}
          >
            Tüm ürünler
          </button>
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              className={filters.category === category.id ? "active" : ""}
              onClick={() => dispatch(setCategory(category.id))}
            >
              {category.label}
              <span>{category.count}</span>
            </button>
          ))}
        </aside>

        <div className="shop-content">
          <div className="shop-toolbar">
            <label className="search-box">
              <Search size={17} />
              <input
                value={filters.query}
                onChange={(event) => dispatch(setQuery(event.target.value))}
                placeholder="Ürün ara"
              />
            </label>
            <span>{total} ürün</span>
            <select
              aria-label="Ürünleri sırala"
              value={filters.sort}
              onChange={(event) => dispatch(setSort(event.target.value))}
            >
              <option value="featured">Öne çıkanlar</option>
              <option value="price-asc">Fiyat: düşükten yükseğe</option>
              <option value="price-desc">Fiyat: yüksekten düşüğe</option>
              <option value="rating">En yüksek puan</option>
            </select>
          </div>

          {status === "loading" && items.length === 0 ? (
            <div className="loading-grid" aria-label="Ürünler yükleniyor">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} />
              ))}
            </div>
          ) : error ? (
            <p className="form-message error">{error}</p>
          ) : (
            <div className="product-grid">
              {items.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
            </div>
          )}

          {items.length < total && (
            <button
              className="secondary-button load-more"
              type="button"
              onClick={() => setLimit((value) => value + 4)}
            >
              Daha fazla göster
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
