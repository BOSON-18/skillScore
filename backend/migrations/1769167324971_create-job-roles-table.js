exports.up = (pgm) => {
    pgm.createTable('job_roles', {
        id: {
            type: 'bigserial',
            primaryKey: true
        },
        job_role_id: {
            type: 'varchar(100)',
            notNull: true,
        },
        version: {
            type: 'integer',
            notNull: true,
        },
        title: {
            type: 'varchar(255)',
            notNull: true,
        },
        requirements: {
            type: "jsonb",
            notNull: true,
        },
        requirements_hash: {
            type: 'varchar(64)',
            notNull: true,
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('now()')
        },
    });


    pgm.addConstraint(
        "job_roles",
        "job_roles_role_version_unique",
        {
            unique: ["job_role_id", "version"]
        }
    );

    pgm.createIndex(
        "job_roles",
        ["job_role_id", {
            name: "version", sort: "DESC"
        }], {
        name: "job_roles_latest_version_idx"
    }
    );

    // For fast Idempotency Lookup
    pgm.createIndex(
        "job_roles",
        ["job_role_id", "requirements_hash", { name: "version", sort: "DESC" }],
        {
            name: "job_roles_latest_hash_idx"
        }
    )
};


exports.down = (pgm) => {
    pgm.dropTable('job_roles');
};