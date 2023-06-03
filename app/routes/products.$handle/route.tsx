import {useLoaderData} from '@remix-run/react';
import {Money, ShopPayButton} from '@shopify/hydrogen';
import {Product, ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import {LoaderArgs, json} from '@shopify/remix-oxygen';
import ProductGallery from '~/components/ProductGallery';
import ProductOptions from '~/components/ProductOptions';
import {PRODUCT_QUERY} from './query';
import {ProductForm} from '~/components/ProductForm';

export async function loader({params, context, request}: LoaderArgs) {
  const {handle} = params;
  const searchParams = new URL(request.url).searchParams;
  const selectedOptions: {name: string; value: string}[] = [];
  const storeDomain = context.storefront.getShopifyDomain();

  searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
  });

  const {product} = await context.storefront.query<{
    product: Product & {selectedVariant: ProductVariant};
  }>(PRODUCT_QUERY, {
    variables: {
      handle,
      selectedOptions,
    },
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const selectedVariant =
    product.selectedVariant ?? product?.variants?.nodes[0];

  return json({
    product,
    selectedVariant,
    storeDomain,
  });
}

export default function ProductHandle() {
  const {product, selectedVariant, storeDomain} =
    useLoaderData<typeof loader>();
  const orderable = selectedVariant?.availableForSale || false;

  return (
    <section className="px-6 py-10 md:px-8 md:py-12">
      <div className="mx-auto max-w-screen-xl grid items-start gap-6 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProductGallery media={product.media.nodes} />
        </div>
        <div className="md:sticky md:mx-auto max-w-xl md:max-w-sm grid gap-8 md:py-6 md:px-0 md:top-36">
          <div className="grid gap-2">
            <h1 className="text-4xl font-bold leading-10 whitespace-normal">
              {product.title}
            </h1>
            <span className="max-w-prose whitespace-pre-wrap inherit text-gray-500 dark:text-zinc-400 font-medium">
              {product.vendor}
            </span>
          </div>
          <ProductOptions
            options={product.options}
            selectedVariant={selectedVariant as ProductVariant}
          />
          <Money
            withoutTrailingZeros
            data={selectedVariant.price}
            className="text-xl font-semibold mb-2"
          />
          {orderable && (
            <div className="space-y-4">
              <ShopPayButton
                storeDomain={storeDomain}
                variantIds={[selectedVariant?.id]}
                width="100%"
                className="grid"
              />
              <ProductForm variantId={selectedVariant?.id} />
            </div>
          )}
          <div
            className="prose border-t border-gray-200 pt-6 text-black text-md dark:text-zinc-400"
            dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
          ></div>
        </div>
      </div>
    </section>
  );
}
