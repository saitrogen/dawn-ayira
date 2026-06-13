import { Hero } from '@/components/sections/Hero';
import { CollectionList } from '@/components/sections/CollectionList';
import { FeaturedCollection } from '@/components/sections/FeaturedCollection';
import { MultiColumn } from '@/components/sections/MultiColumn';
import { RichText } from '@/components/sections/RichText';
import { SHOP } from '@/lib/data';

export default function Home() {
  const featured = SHOP.products.filter(p => p.collection === "soft-drinks").slice(0, 4);
  const icecream = SHOP.products.filter(p => p.collection === "ice-cream-1");
  const juice = SHOP.products.filter(p => p.collection === "juice");
  
  return (
    <main className="ay-page-fade">
      <Hero />
      <CollectionList />
      <FeaturedCollection 
        title="Soft drinks · weekly favourites" 
        eyebrow="Weekly picks" 
        viewAllLink="/collections/soft-drinks" 
        products={featured} 
      />
      <MultiColumn />
      <FeaturedCollection 
        title="Cool down — ice cream" 
        eyebrow="Frozen aisle" 
        viewAllLink="/collections/ice-cream-1" 
        products={[...icecream, ...juice].slice(0, 3)} 
        cols={3} 
      />
      <RichText />
    </main>
  );
}
