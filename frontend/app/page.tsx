'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, ChevronDown, Heart, Search, ShoppingBag, SlidersHorizontal, Star, UserRound, X } from 'lucide-react'

type Product = { id: number | string; title: string; description: string; category: string; fabric: string; basePrice: number; mrp: number; rating: number; reviews: number; image: string; badge: string; variants: string[]; color: string }

const fallbackImage = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85'

function normalizeProduct(product: Record<string, unknown>, index: number): Product {
  const variants = Array.isArray(product.variants)
    ? product.variants.map(variant => typeof variant === 'string' ? variant : JSON.stringify(variant))
    : Array.isArray(product.options)
      ? product.options.map(option => String(option))
      : Array.isArray(product.sizes) ? product.sizes.map(size => String(size)) : []
  const basePrice = Number(product.base_price ?? product.basePrice ?? product.price ?? 0)
  const image = product.image ?? product.image_url

  return {
    id: (product.id as number | string) ?? index,
    title: String(product.title ?? product.name ?? 'Untitled product'),
    description: String(product.description ?? ''),
    category: String(product.category ?? product.category_name ?? 'All'),
    fabric: String(product.fabric ?? ''),
    basePrice,
    mrp: Number(product.mrp ?? product.original_price ?? basePrice),
    rating: Number(product.rating ?? 0),
    reviews: Number(product.reviews ?? 0),
    image: typeof image === 'string' && image.trim() ? image : fallbackImage,
    badge: String(product.badge ?? ''),
    variants,
    color: String(product.color ?? ''),
  }
}

const productUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`
const categories = ['All', 'Shirts', 'T-Shirts', 'Kurta', 'Kurta Sets', 'Sarees', 'Trousers', 'Dresses']
const filterGroups: Record<string, string[]> = { 'Quick Filters': ['Top Brands','Top Rated','Hot Trends','Global Finds','House of Brands','Rising Star'], Size: ['XS','S','M','L','XL','XXL'], Color: ['Black','Blue','Ivory','Pink','Rose','Terracotta'], Brand: ['Pehnawa Exclusive','House of Brands'], Categories: ['Shirts','T-Shirts','Kurta','Kurta Set','Saree','Trousers'], 'Country of Origin': ['India'], 'More Filters': ['New arrivals','Bestsellers'], 'Price Range': ['Under ₹999','₹999 - ₹1999','₹2000+'], Discount: ['10% and above','30% and above','50% and above'], 'Delivery Time': ['2-3 days','4-7 days'] }
const sortOptions = ["What's new", 'Price - high to low', 'Popularity', 'Discount', 'Price - low to high', 'Customer Rating']
const money = (value: number) => `₹${value.toLocaleString('en-IN')}`

export default function Page() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState("What's new")
  const [wishlist, setWishlist] = useState<number[]>([])
  const [bag, setBag] = useState<Product[]>([])
  const [sortOpen, setSortOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filterTab, setFilterTab] = useState('Quick Filters')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [quickView, setQuickView] = useState<Product | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(productUrl, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(`Products request failed with ${response.status}`)
        return response.json()
      })
      .then(data => {
        const records = Array.isArray(data) ? data : Array.isArray(data.products) ? data.products : []
        setProducts(records.map((product, index) => normalizeProduct(product, index)))
        setLoadError('')
      })
      .catch(error => {
        if (error.name !== 'AbortError') setLoadError('Products could not be loaded right now.')
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

  const visible = useMemo(() => {
    const list = products.filter(p => (category === 'All' || p.category === category || (category === 'Kurta Sets' && p.category === 'Kurta Set')) && (!query || `${p.title} ${p.description} ${p.category} ${p.fabric}`.toLowerCase().includes(query.toLowerCase())))
    return [...list].sort((a, b) => sort === 'Price - high to low' ? b.basePrice - a.basePrice : sort === 'Price - low to high' ? a.basePrice - b.basePrice : sort === 'Customer Rating' ? b.rating - a.rating : sort === 'Discount' ? (b.mrp-b.basePrice)/b.mrp - (a.mrp-a.basePrice)/a.mrp : sort === 'Popularity' ? b.reviews - a.reviews : Number(b.id) - Number(a.id))
  }, [category, query, sort])
  const toggle = (value: string) => setSelectedFilters(current => current.includes(value) ? current.filter(item => item !== value) : [...current, value])

  return <main className="site-shell">
    <div className="announcement">Festive edit is here <span>Flat 50% off with PEHNAWA50</span></div>
    <header className="header">
      <a className="wordmark" href="#top"><span className="logo-mark">P</span>pehnawa<span className="dot">.</span></a>
      <nav className="desktop-nav"><a href="#shop">Women</a><a href="#shop">Men</a><a href="#shop">Kids</a><a href="#shop">Home & Living</a><a href="#founder">Pehnawa Studio</a></nav>
      <div className="header-actions"><label className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder={'Search for "Kurtas", "Sarees", "Dresses"...'} aria-label="Search products" /></label><button className="icon-button" aria-label="Profile"><UserRound size={20}/><small>Profile</small></button><button className="icon-button" aria-label="Wishlist"><Heart size={20}/><small>{wishlist.length || ''}</small></button><button className="icon-button" onClick={() => setFiltersOpen(true)} aria-label="Bag"><ShoppingBag size={20}/><small>{bag.length || ''}</small></button></div>
    </header>
    <nav className="category-nav">{categories.map(item => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</nav>
    <div className="quick-chips"><button>Deal of the Day</button><button>Value+</button><button>30Day BestPrice</button></div>

    <section className="hero" id="top"><img src="/pehnawa-hero.png" alt="Woman in a Pehnawa festive outfit"/><div className="hero-overlay"/><div className="hero-copy"><p className="eyebrow">THE FESTIVE EDIT · 2025</p><h1>Wear your<br/><em>story.</em></h1><p>Thoughtfully made Indian wear for every version of you.</p><button className="primary-button" onClick={() => document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})}>Shop the edit <ArrowRight size={17}/></button></div></section>

    <section className="content-width arrivals" id="shop"><div className="section-heading"><div><p className="eyebrow">JUST LANDED</p><h2>Newly <em>added</em></h2></div><span className="product-count">{visible.length} styles</span></div><div className="shop-toolbar"><div className="filter-pills"><button className="filter-button" onClick={() => setFiltersOpen(true)}><SlidersHorizontal size={16}/> Filters {selectedFilters.length ? `(${selectedFilters.length})` : ''}</button></div><button className="sort-button" onClick={() => setSortOpen(true)}>SORT BY: <strong>{sort}</strong><ChevronDown size={15}/></button></div>{loading && <p>Loading products...</p>}{loadError && <p role="alert">{loadError}</p>}{!loading && !loadError && <div className="product-grid">{visible.map(product => <article className="product-card" key={product.id}><div className="product-image"><img src={product.image} alt={product.title}/><span className="badge">{product.badge}</span><button className="heart" onClick={() => setWishlist(current => current.includes(product.id) ? current.filter(id => id !== product.id) : [...current, product.id])} aria-label={`Wishlist ${product.title}`}><Heart size={18} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'}/></button><button className="quick-view" onClick={() => setQuickView(product)}>Quick view</button></div><div className="product-info"><div className="product-meta"><span>{product.fabric} · {product.color}</span><span className="rating"><Star size={12} fill="currentColor"/> {product.rating} <i>({product.reviews})</i></span></div><h3>{product.title}</h3><p>{product.description}</p><div className="price-row"><strong>{money(product.basePrice)}</strong>{product.mrp > product.basePrice && <><del>{money(product.mrp)}</del><span>{Math.round((1-product.basePrice/product.mrp)*100)}% OFF</span></>}</div><p>Variants: {product.variants.length ? product.variants.join(', ') : 'No options listed'}</p><button className="add-button" onClick={() => setBag(current => current.some(item => item.id === product.id) ? current : [...current, product])}>ADD TO BAG</button></div></article>)}</div>}</section>

    <section className="founder content-width" id="founder"><div className="founder-portrait"><img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=700&q=85" alt="Pehnawa founder"/><span>Founder’s pick</span></div><div className="founder-copy"><p className="eyebrow">A NOTE FROM THE STUDIO</p><h2>Curated by<br/><em>Pehnawa’s founder</em></h2><blockquote>“I want every piece to feel like a little discovery — rooted in craft, made for the way you live now.”</blockquote><p className="founder-name">— Ananya Mehta, Founder</p><button className="text-button" onClick={() => setCategory('Kurta Sets')}>Shop signature styles <ArrowRight size={16}/></button></div><div className="founder-picks">{products.slice(0,3).map(product => <button key={product.id} onClick={() => setQuickView(product)}><img src={product.image} alt=""/><span>{product.title}</span></button>)}</div></section>

    <section className="reviews-section content-width" id="reviews"><div className="section-heading"><div><p className="eyebrow">LOVED BY YOU</p><h2>Real people, <em>real love</em></h2></div></div><div className="review-grid"><div className="review-score"><strong>4.8</strong><div className="stars">★★★★★</div><p>Based on 2,400+ reviews</p>{[88,62,22,8].map((width,index) => <span className="review-bar" key={index}><b>{5-index}</b><i style={{width: `${width}%`}}/></span>)}</div>{[['“The Mitti set is my new favourite. Pure cotton, perfect fitting for festive wear.”','Ananya S.','Mitti Handblock Co-ord'],['“Beautifully packed and even better in person. The colour is exactly as pictured.”','Rhea M.','Noor Silk Kurta Set']].map(([quote,name,item]) => <article className="review-card" key={name}><div className="stars">★★★★★</div><p>{quote}</p><footer><div className="avatar">{name[0]}</div><span><strong>{name} <small><Check size={11}/> VERIFIED BUYER</small></strong><small>{item} · 12 Aug 2025</small><a href="#reviews">Helpful (24)</a></span></footer></article>)}</div></section>

    <footer className="footer"><div className="content-width footer-top"><div><a className="wordmark" href="#top"><span className="logo-mark">P</span>pehnawa<span className="dot">.</span></a><p>Clothes with a point of view.<br/>Made for your kind of beautiful.</p></div><div><strong>Explore</strong><a href="#shop">New arrivals</a><a href="#shop">Best sellers</a><a href="#founder">Pehnawa Studio</a></div><div><strong>Help</strong><a href="#reviews">Shipping & returns</a><a href="#reviews">Size guide</a><a href="#reviews">Contact us</a></div><div><strong>Stay in the loop</strong><p>New drops, slow stories, good things.</p><div className="newsletter"><input placeholder="Your email address" aria-label="Email address"/><button aria-label="Subscribe"><ArrowRight size={16}/></button></div></div></div></footer>

    {sortOpen && <div className="modal-backdrop" onClick={() => setSortOpen(false)}><div className="sort-sheet" onClick={e => e.stopPropagation()}><div className="sheet-head"><strong>SORT BY</strong><button onClick={() => setSortOpen(false)} aria-label="Close sort"><X size={20}/></button></div>{sortOptions.map(option => <button className={sort === option ? 'selected' : ''} key={option} onClick={() => {setSort(option);setSortOpen(false)}}>{option}{sort === option && <Check size={17}/>}</button>)}</div></div>}
    {filtersOpen && <div className="modal-backdrop" onClick={() => setFiltersOpen(false)}><div className="filter-drawer" onClick={e => e.stopPropagation()}><div className="sheet-head"><strong>FILTERS</strong><button onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X size={20}/></button></div><div className="filter-layout"><div className="filter-sidebar">{Object.keys(filterGroups).map(group => <button className={filterTab === group ? 'selected' : ''} key={group} onClick={() => setFilterTab(group)}>{group}<ChevronDown size={14}/></button>)}</div><div className="filter-options"><p className="eyebrow">{filterTab}</p>{filterGroups[filterTab].map(option => <label key={option}><input type="checkbox" checked={selectedFilters.includes(option)} onChange={() => toggle(option)}/><span>{option}</span></label>)}</div></div><div className="drawer-actions"><button onClick={() => setSelectedFilters([])}>CLEAR ALL</button><button onClick={() => setFiltersOpen(false)}>CLOSE</button><button className="apply" onClick={() => setFiltersOpen(false)}>APPLY</button></div></div></div>}
    {quickView && <div className="modal-backdrop" onClick={() => setQuickView(null)}><div className="quick-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setQuickView(null)} aria-label="Close quick view"><X size={20}/></button><img src={quickView.image} alt={quickView.title}/><div className="quick-content"><p className="eyebrow">PEHNAWA EXCLUSIVE · {quickView.fabric}</p><h2>{quickView.title}</h2><p>{quickView.description}</p><div className="price-row"><strong>{money(quickView.basePrice)}</strong>{quickView.mrp > quickView.basePrice && <><del>{money(quickView.mrp)}</del><span>{Math.round((1-quickView.basePrice/quickView.mrp)*100)}% OFF</span></>}</div><p>Variants: {quickView.variants.length ? quickView.variants.join(', ') : 'No options listed'}</p><div className="quick-rating"><span className="rating"><Star size={13} fill="currentColor"/> {quickView.rating}</span> {quickView.reviews} reviews</div><button className="primary-button full" onClick={() => {setBag(current => current.some(item => item.id === quickView.id) ? current : [...current, quickView]);setQuickView(null)}}>Add to bag <ShoppingBag size={17}/></button></div></div></div>}
  </main>
}

const _unused = { UserRound }
