import imageUrlBuilder from '@sanity/image-url'
import { createClient } from "@sanity/client";
require('dotenv').config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_DATASET,
  apiVersion: '2021-03-25', // use current UTC date - see "specifying API version"!
  token: process.env.NEXT_PUBLIC_TOKEN, // or leave blank for unauthenticated usage
  useCdn: true, // `false` if you want to ensure fresh data
  ignoreBrowserTokenWarning: true
})

const builder = imageUrlBuilder(client)

export function grabImage (source) {
    return builder.image(source).toString();
}

export function createURL (type) {
  let QUERY = encodeURIComponent(`*[_type == "${type}"]`);
  return `https://${process.env.NEXT_PUBLIC_PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${process.env.NEXT_PUBLIC_DATASET}?query=${QUERY}`;
}


export const grabFile = (source) => {
  const ref = source.file.asset._ref;
  const link = ref.slice(ref.indexOf('-') + 1, ref.lastIndexOf('-'));
  return `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_PROJECT_ID}/${process.env.NEXT_PUBLIC_DATASET}/${link}.pdf`;
}