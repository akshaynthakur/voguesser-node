import { fetchCollectionSlugs, fetchImages } from "./graphql";
import { migrateCollections } from "./supabase";

// fetchCollectionSlugs("prada");

migrateCollections();
