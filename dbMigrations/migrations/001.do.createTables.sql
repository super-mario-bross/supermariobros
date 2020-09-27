CREATE TABLE entities (
	uuid UUID NOT NULL,
	entity_id integer NOT NULL,
	avg_rating float DEFAULT 0.0,
	positive_sentiments integer DEFAULT 0,
	negative_sentiments integer DEFAULT 0,
	neutral_sentiments integer DEFAULT 0,
	total_reviews integer DEFAULT 0,
	updated_at timestamp with time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP),
	deleted_at timestamp with time zone  DEFAULT NULL,
    created_at timestamp with time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP),
	CONSTRAINT entity_pkey PRIMARY KEY (uuid)
)
WITH (
	OIDS=FALSE
);

CREATE UNIQUE INDEX entity_unique_idx ON entities (entity_id);
CREATE TABLE rating_n_reviews (
	uuid UUID NOT NULL,
	entity UUID NOT NULL,
	author integer NOT NULL,
    title varchar(500) NULL,
	review_desc varchar(2000) NULL,
	rating float NOT NULL,
	is_helpful integer DEFAULT 0,
	is_not_helpful integer DEFAULT 0,
	moderation_status varchar(100),
	is_published boolean DEFAULT false,
	sentiment_score integer NOT NULL DEFAULT 0,
	updated_at timestamp with time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP),
	deleted_at timestamp with time zone  DEFAULT NULL,
    created_at timestamp with time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP),
	CONSTRAINT rating_pkey PRIMARY KEY (uuid),
	FOREIGN KEY (entity) REFERENCES entities (uuid) ON DELETE CASCADE
)
WITH (
	OIDS=FALSE
);
CREATE UNIQUE INDEX rating_n_reviews_unique_idx ON rating_n_reviews (entity,author);