import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {Product} from '@shopify/hydrogen/storefront-api-types';

export default function ProductCard({product}: {product: Product}) {
  const {price, compareAtPrice} = product.variants?.nodes[0] || {};
  const isDiscounted = +(compareAtPrice?.amount ?? 0) > +price?.amount;

  return (
    <Link to={`/products/${product.handle}`}>
      <div className="grid gap-6">
        <div className="shadow-md relative">
          {isDiscounted && (
            <span className="subpixel-antialiased absolute top-0 right-0 m-4 text-right text-notice text-rose-600 text-sm">
              Sale
            </span>
          )}
          {product.variants.nodes[0].image && (
            <Image
              className="rounded-xl"
              data={product.variants.nodes[0].image}
              alt={product.title}
            />
          )}
        </div>
        <div className="grid gap-1">
          <h3 className="max-w-prose text-copy overflow-hidden whitespace-nowrap text-ellipsis">
            {product.title}
          </h3>
          <p className="max-w-prose whitespace-pre-wrap inherit text-copy flex gap-4">
            <Money
              as="span"
              className="dark:text-lime-300"
              withoutTrailingZeros
              data={price}
            />
            {isDiscounted && compareAtPrice && (
              <Money
                as="span"
                className="line-through opacity-50"
                withoutTrailingZeros
                data={compareAtPrice}
              />
            )}
          </p>
        </div>
      </div>
    </Link>
  );
}
