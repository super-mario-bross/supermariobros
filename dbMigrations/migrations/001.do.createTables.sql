CREATE TABLE entities (
	uuid UUID NOT NULL,
	entity_id varchar(50) NOT NULL,
	avg_rating float NOT NULL,
	updated_at timestamp with time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP),
	deleted_at timestamp with time zone  DEFAULT NULL,
    created_at timestamp with time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP),
	CONSTRAINT entity_pkey PRIMARY KEY (uuid)
)
WITH (
	OIDS=FALSE
);

CREATE UNIQUE INDEX entity_unique_idx ON entities (entity_id);


CREATE TABLE ratings (
	uuid UUID NOT NULL,
	entity_id varchar(50) NOT NULL,
    title varchar(50) NOT NULL,
	review_dec varchar(50) NOT NULL,
	rating float NOT NULL,
	is_helpful BOOLEAN,
	sentiment_score integer NOT NULL,
	updated_at timestamp with time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP),
	deleted_at timestamp with time zone  DEFAULT NULL,
    created_at timestamp with time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP),
	CONSTRAINT rating_pkey PRIMARY KEY (uuid)
)
WITH (
	OIDS=FALSE
);
