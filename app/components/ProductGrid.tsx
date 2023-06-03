import {Collection} from '@shopify/hydrogen/storefront-api-types';
import ProductCard from './ProductCard';
import {useEffect, useState} from 'react';
import {useFetcher} from '@remix-run/react';

export default function ProductGrid({
  collection,
  url,
}: {
  collection: Collection;
  url: string;
}) {
  const [nextPage, setNextPage] = useState(
    collection.products.pageInfo.hasNextPage,
  );

  const [endCursor, setEndCursor] = useState(
    collection.products.pageInfo.endCursor,
  );

  const [products, setProducts] = useState(collection.products.nodes || []);

  const fetcher = useFetcher();

  function fetchMoreProducts() {
    fetcher.load(`${url}?index&cursor=${endCursor}`);
  }

  useEffect(() => {
    if (!fetcher.data) return;
    const {collection} = fetcher.data;

    setProducts((prev) => [...prev, ...collection.products.nodes]);
    setNextPage(collection.products.pageInfo.hasNextPage);
    setEndCursor(collection.products.pageInfo.endCursor);
  }, [fetcher.data]);

  return (
    <section className="px-6 pb-10 md:px-8 md:pb-12">
      <div className="max-w-screen-xl mx-auto gap-10 md:gap-14 grid">
        <div className="grid-flow-row grid gap-2 gap-y-6 md:gap-4 md:gap-y-6 lg:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {nextPage && (
          <button
            className="md:justify-self-center rounded-xl font-medium text-center py-3 px-6 border cursor-pointer"
            disabled={fetcher.state !== 'idle'}
            onClick={fetchMoreProducts}
            type="button"
          >
            {fetcher.state !== 'idle' ? 'Loading...' : 'Load more products'}
          </button>
        )}
      </div>
    </section>
  );
}
