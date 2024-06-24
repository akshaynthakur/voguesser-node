import { fetchCollectionSlugs, fetchImages } from "./graphql";
import { migrateCollections, migrateImages } from "./supabase";

// fetchCollectionSlugs("prada");

// migrateCollections();

migrateImages();
