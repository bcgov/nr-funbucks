-- Start audit.lua

function has_data_key(table, key)
    return table[key] ~= nil and table[key]["data"] ~= nil
end

function remove_nested_fields(tag, timestamp, record)
    new_record = record
    code = 0
    if new_record["auth"] ~= nil and new_record["auth"]["policy_results"] ~= nil then
        new_record["auth"]["policy_results"] = nil
        code = 2
    end
    return code, timestamp, new_record
end

function forwarded_for_to_source_ip(tag, timestamp, record)
    new_record = record
    code = 0
    if new_record["request"] ~= nil and new_record["request"]["headers"] ~= nil then
        if new_record["request"]["headers"]["x-forwarded-for"] ~= nil then
            new_record["source"] = {}
            new_record["source"]["ip"] = new_record["request"]["headers"]["x-forwarded-for"][1]
        end
        new_record["request"]["headers"] = nil
        code = 2
    end

    return code, timestamp, new_record
end

function copy_to_new_message(src, dest, record, new_record)
    if record[src] ~= nil then
        new_record[dest] = record[src]
    end
end

function construct_log_message(tag, timestamp, record)
    new_record = {}
    new_record["event.dataset"] = "application.log"
    copy_to_new_message("@message", "message", record, new_record)
    copy_to_new_message("@level", "log.level", record, new_record)
    copy_to_new_message("@module", "log.logger", record, new_record)
    copy_to_new_message("error", "error.message", record, new_record)
    copy_to_new_message("lease_id", "event.id", record, new_record)
    -- ecs
    copy_to_new_message("agent.type", "agent.type", record, new_record)
    copy_to_new_message("agent.version", "agent.version", record, new_record)
    copy_to_new_message("agent.name", "agent.name", record, new_record)
    copy_to_new_message("ecs.version", "ecs.version", record, new_record)
    copy_to_new_message("event.sequence", "event.sequence", record, new_record)
    copy_to_new_message("event.created", "event.created", record, new_record)
    copy_to_new_message("log.file.path", "log.file.path", record, new_record)
    copy_to_new_message("host", "host", record, new_record)
    return 2, timestamp, new_record
end

pathEnvToStandardEnv = {}
pathEnvToStandardEnv["prod"] = "production"
pathEnvToStandardEnv["test"] = "test"
pathEnvToStandardEnv["dev"] = "development"

function path_to_service_target(tag, timestamp, record)
    new_record = record
    code = 0
    if new_record["request"] ~= nil and new_record["request"]["path"] ~= nil then
        local path = new_record["request"]["path"]
        local path_segment = {}
        if string.sub(path, 0, 5) == "apps/" then
            for i in string.gmatch(path, "[^/]+") do
                path_segment[#path_segment + 1] = i
            end
            local env = path_segment[3]
            local project = path_segment[4]
            local service = path_segment[5]
            if env ~= nil and pathEnvToStandardEnv[env] ~= nil then
                record["service.target.environment"] = pathEnvToStandardEnv[env]
                code = 2
            end
            if project ~= nil then
                record["labels.target_project"] = project
                code = 2
            end
            if service ~= nil then
                record["service.target.name"] = service
                code = 2
            end
        end
        if string.sub(path, 0, 7) == "groups/" then
            for i in string.gmatch(path, "[^/]+") do
                path_segment[#path_segment + 1] = i
            end
            local groupname = path_segment[3]
            if groupname ~= nil then
                record["group.name"]=groupname
                code =2
            end
        end
    end
    return code, timestamp, new_record
end
