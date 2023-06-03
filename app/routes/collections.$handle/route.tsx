import {useLoaderData} from '@remix-run/react';
import {SeoHandleFunction} from '@shopify/hydrogen';
import {Collection} from '@shopify/hydrogen/storefront-api-types';
import {LoaderArgs, V2_MetaFunction, json} from '@shopify/remix-oxygen';
import ProductGrid from '~/components/ProductGrid';
import {COLLECTION_QUERY} from './query';

const seo: SeoHandleFunction = ({data}) => ({
  title: data?.collection?.title,
  description: data?.collection?.description.substr(0, 154),
});

export const handle = {
  seo,
};

export const meta: V2_MetaFunction = ({data}) => {
  return [
    {title: data?.collection?.title ?? 'Collection'},
    {description: data?.collection?.description},
  ];
};

export async function loader({params, context, request}: LoaderArgs) {
  const {handle} = params;
  const searchParams = new URL(request.url).searchParams;
  const cursor = searchParams.get('cursor');

  const {collection} = await context.storefront.query<{collection: Collection}>(
    COLLECTION_QUERY,
    {
      variables: {
        handle,
        cursor,
      },
    },
  );

  if (!collection) {
    throw new Response(null, {status: 404});
  }

  return json({
    collection,
  });
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();

  return (
    <>
      <header className="px-6 py-10 md:px-8 md:py-12">
        <div className="mx-auto max-w-screen-xl grid gap-8 justify-items-start">
          <h1 className="text-4xl whitespace-pre-wrap font-bold inline-block">
            {collection.title}
          </h1>

          {collection.description && (
            <div className="flex items-baseline justify-between w-full">
              <div>
                <p className="max-w-md whitespace-pre-wrap inherit text-copy dark:text-zinc-300">
                  {collection.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </header>
      <ProductGrid
        collection={collection as Collection}
        url={`/collections/${collection.handle}`}
      />
    </>
  );
}
