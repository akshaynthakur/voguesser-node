import { CollectionSlugResult, ImageResult } from "./utils/graphql";
import { gql, GraphQLClient } from "graphql-request";

const graphQLClient = new GraphQLClient("https://graphql.vogue.com/graphql", {
	headers: {
		"Content-Type": "application/json",
		Host: "graphql.vogue.com",
		"User-Agent":
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
	},
});

export async function fetchImages(collectionSlug: string): Promise<string[]> {
	try {
		const query =
			gql`
                { 
					fashionShowV2 (slug: "` +
			collectionSlug +
			`") { 
						galleries { 
							collection { 
								slidesV2 { 
									edges { 
										node { 
											... on CollectionSlide { 
												photosTout { 
													... on Image { 
														url 
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}`;
		const result: ImageResult = await graphQLClient.request(query);
		const images = result.fashionShowV2.galleries.collection.slidesV2.edges.map(
			(entry) => entry.node.photosTout.url
		);
		return images;
	} catch (error) {
		throw new Error(
			`An error occurred when trying to fetch images: ${
				error instanceof Error ? error.message : error
			}`
		);
	}
}

export async function fetchCollectionSlugs(brandSlug: string) {
	try {
		const query =
			gql`
			{
				brand(slug: "` +
			brandSlug +
			`") {
					fashionShows {
						fashionShow {
							slug
						}
					}
				}
			}
		`;
		const result: CollectionSlugResult = await graphQLClient.request(query);
		const collectionSlugs = result?.brand?.fashionShows?.fashionShow?.map(
			(entry) => entry.slug
		);
		return collectionSlugs;
	} catch (error) {
		throw new Error(
			`An error occurred when trying to fetch collection slug: ${
				error instanceof Error ? error.message : error
			}`
		);
	}
}
