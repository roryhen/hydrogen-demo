import {MediaFile} from '@shopify/hydrogen';
import {Product} from '@shopify/hydrogen/storefront-api-types';

const typeNameMap = {
  MODEL_3D: 'Model3d',
  VIDEO: 'Video',
  IMAGE: 'MediaImage',
  EXTERNAL_VIDEO: 'ExternalVideo',
};

export default function ProductGallery({
  media,
}: {
  media: Product['media']['nodes'];
}) {
  if (!media.length) {
    return null;
  }

  return (
    <div
      className={`-ms-6 md:ms-0 px-6 md:px-2 pb-4 grid gap-4 overflow-x-auto snap-x grid-flow-col md:grid-flow-row  md:grid-cols-2 w-screen md:w-full lg:col-span-2`}
    >
      {media.map((med, i) => {
        let extraProps = {};

        if (med.mediaContentType === 'MODEL_3D') {
          extraProps = {
            interactionPromptThreshold: '0',
            ar: true,
            loading: 'eager',
            disableZoom: true,
            style: {height: '100%', margin: '0 auto'},
          };
        }

        const data = {
          ...med,
          __typename: typeNameMap[med.mediaContentType],
        };

        return (
          <div
            className={`${
              i % 3 === 0 ? 'md:col-span-2' : 'md:col-span-1'
            } snap-center card-image bg-white aspect-square md:w-full w-[calc(100vw-3rem)] shadow-md rounded-xl`}
            key={med.id}
          >
            <MediaFile
              tabIndex={0}
              className={`w-full h-full aspect-square object-cover rounded-xl`}
              data={data as typeof med}
              {...extraProps}
            />
          </div>
        );
      })}
    </div>
  );
}
