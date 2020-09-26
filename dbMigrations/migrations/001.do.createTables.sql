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

