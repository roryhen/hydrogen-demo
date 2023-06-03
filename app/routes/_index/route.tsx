import {Link, useLoaderData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {CollectionConnection} from '@shopify/hydrogen/storefront-api-types';
import {LoaderArgs} from '@shopify/remix-oxygen';
import {COLLECTIONS_QUERY} from './query';

export function meta() {
  return [
    {title: 'My Hydrogen Demo'},
    {description: 'A custom storefront powered by Hydrogen'},
  ];
}

export async function loader({context}: LoaderArgs) {
  return await context.storefront.query<{
    collections: CollectionConnection;
  }>(COLLECTIONS_QUERY);
}

export default function Index() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <section className="py-10 px-6 md:py-12 md:px-8">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="whitespace-pre-wrap max-w-prose font-bold text-4xl mb-4">
          Collections
        </h2>
        <div className="grid gap-8 lg:gap-12 md:grid-cols-2 lg:grid-cols-3">
          {collections.nodes.map((collection) => {
            return (
              <Link
                to={`/collections/${collection.handle}`}
                key={collection.id}
              >
                <div className="grid gap-4">
                  {collection?.image && (
                    <Image
                      className="rounded-xl shadow-md"
                      alt={`Image of ${collection.title}`}
                      data={collection.image}
                      key={collection.id}
                      sizes="(max-width: 32em) 100vw, 33vw"
                      width={400}
                      crop="center"
                    />
                  )}
                  <h2 className="whitespace-pre-wrap max-w-prose font-medium text-copy text-lg">
                    {collection.title}
                  </h2>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
