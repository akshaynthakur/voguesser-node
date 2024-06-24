import { createClient } from "@supabase/supabase-js";
require("dotenv").config();

const url = process.env.NODE_SUPABASE_URL || "";
const serviceKey = process.env.NODE_SUPABASE_SERVICE_KEY || "";

const supabase = createClient(url, serviceKey);

export const migrateCollections = async () => {
	const { data: slugs } = await supabase.from("brands").select("slug");
	console.log(slugs);
};

export const migrateImages = async () => {
	const { data: notes } = await supabase.from("notes").select();
};

migrateCollections();
