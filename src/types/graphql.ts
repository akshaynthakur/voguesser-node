export interface ImageResult {
	fashionShowV2: {
		galleries: {
			collection: {
				slidesV2: {
					edges: NestedImageResult[];
				};
			};
		};
	};
}

interface NestedImageResult {
	node: {
		photosTout: {
			url: string;
		};
	};
}

export interface CollectionSlugResult {
	brand: {
		fashionShows: {
			fashionShow: NestedCollectionSlugResult[];
		};
	};
}

interface NestedCollectionSlugResult {
	slug: string;
}
