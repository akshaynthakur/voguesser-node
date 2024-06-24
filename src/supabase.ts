import { createClient } from "@supabase/supabase-js";
import { fetchCollectionSlugs } from "./graphql";
import { error } from "console";
require("dotenv").config();

const url = process.env.NODE_SUPABASE_URL || "";
const serviceKey = process.env.NODE_SUPABASE_SERVICE_KEY || "";

const supabase = createClient(url, serviceKey);

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
					await supabase
						.from("collections")
						.upsert({ brand_id: id, slug: collectionSlug });
				});
			})
			.catch((error) => {
				console.log("Error for ", slug, ": ", error);
			});
	});
};

export const migrateImages = async () => {
	const { data: collectionSlugs } = await supabase
		.from("collections")
		.select("id, slug");
	console.log(collectionSlugs?.length);
};
