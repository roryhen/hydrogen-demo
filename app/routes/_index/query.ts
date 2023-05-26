export const COLLECTIONS_QUERY = `#graphql
query FeaturedCollections {
  collections(first: 3, query: "collection_type:smart") {
    nodes {
      id
      title
      handle
      image {
          altText
          width
          height
          url
        }
    }
  }
}`;
