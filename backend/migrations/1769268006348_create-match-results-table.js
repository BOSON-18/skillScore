exports.up = (pgm) =>{


    pgm.createType("match_status",[
        "PROCESSING",
        "AVAILABLE",
        "FAILED"
    ]);

    pgm.createTable("match_results",{
        id:{
            type:"bigserial",
            primaryKey:true
        },
        resume_snapshot_id:{
            type: "varchar(100)",
            notNull: true
        },
        job_role_id:{
            type:"varchar(100)",
            notNull:true
        },
        job_role_version:{
            type:"integer",
            notNull:true
        },
        status:{
            type:"match_status",
            notNull:true,
        },
        score:{
            type:"numeric",
            notNull:false
        },
        explanation:{
            type:"jsonb",
            notNull:false
        },
        error_reason:{
            type:"varchar(100)",
            notNull:false
        },
        created_at:{
            type:"timestamptz",
            notNull:true,
            default: pgm.func("now()")
        },
        updated_at:{
            type:"timestamptz",
            notNull:true,
            default: pgm.func("now()")
        }
    });

    pgm.addConstraint(
        "match_results",
        "match_results_unique_identity",
        {
            unique:[
                "resume_snapshot_id",
                "job_role_id",
                "job_role_version"
            ]
        }
    );


    // HR views : all matches for a role/version
    pgm.createIndex(
        "match_results",
        ["job_role_id","job_role_version"],
        {
            name:"match_results_role_version_idx"
        }
    );

    // Candidate /debugging trace
    pgm.createIndex(
        "match_results",
        ["resume_snapshot_id"],
        {
            name:"match_results_resume_idx"
        }
    );

    pgm.createIndex(
        "match_results",
        ["status"],
        {
            name:"match_results_status_idx"
        }
    )
}

exports.down = (pgm) =>{
    pgm.dropTable("match_results");
    pgm.dropType("match_status");
}