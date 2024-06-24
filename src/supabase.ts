import { createClient } from "@supabase/supabase-js";
import { fetchCollectionSlugs, fetchImages } from "./graphql";
require("dotenv").config();

const url = process.env.NODE_SUPABASE_URL || "";
const serviceKey = process.env.NODE_SUPABASE_SERVICE_KEY || "";

const supabase = createClient(url, serviceKey);

const collectionSlugBlocklist = [
	"spring-2005-ready-to-wear/chanel",
	"spring-2002-ready-to-wear/giorgio-armani",
	"fall-2016-ready-to-wear/burberry-prorsum",
	"spring-2017-ready-to-wear/paco-rabanne",
	"fall-2016-ready-to-wear/paco-rabanne",
	"spring-2019-menswear/dolce-gabbana",
];

export const migrateCollections = async () => {
	const { data: slugs } = await supabase.from("brands").select("id, slug");
	slugs?.map(async ({ id, slug }) => {
		fetchCollectionSlugs(slug)
			.then((collectionSlugs) => {
				collectionSlugs = collectionSlugs.filter(
					(element) => element !== undefined
				);
				console.log(collectionSlugs.length, "collections for", slug);
				collectionSlugs.forEach(async (collectionSlug) => {
					if (!collectionSlugBlocklist.includes(collectionSlug)) {
						await supabase
							.from("collections")
							.upsert({ brand_id: id, slug: collectionSlug });
					}
				});
			})
			.catch((error) => {
				console.log("Error for ", slug, ": ", error);
			});
	});
};

export const migrateImages = async (start: number, end: number) => {
	const { data: collectionSlugs, error } = await supabase
		.from("collections")
		.select("id, slug")
		.order("id")
		.range(start, end);
	if (error || !collectionSlugs) {
		console.error("Error fetching data: ", error);
		return;
	} else {
		let ind = start;
		await Promise.all(
			collectionSlugs.map(async ({ id, slug }) => {
				await fetchImages(slug)
					.then((images) => {
						images.forEach(async (url) => {
							await supabase
								.from("images")
								.upsert({ collection_id: id, url: url });
						});
					})
					.finally(() => {
						console.log("Finished", ind, slug);
						ind++;
					});
			})
		).then(() => {
			console.log("Finished migrating images.");
		});
	}
};
