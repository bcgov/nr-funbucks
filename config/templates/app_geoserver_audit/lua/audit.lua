-- Start audit.lua

function copy_to_new_message(src, dest, record, new_record)
    if record[src] ~= nil then
        new_record[dest] = record[src]
    end
end

function copy_as_number_to_new_message(src, dest, record, new_record)
    if tonumber(record[src]) ~= nil then
        new_record[dest] = tonumber(record[src])
    end
end

function construct_log_message(tag, timestamp, record)
    new_record = {}
    copy_to_new_message("id", "http.request.id", record, new_record)
    copy_to_new_message("Service", "event.provider", record, new_record)
    -- Drop: Version
    -- Drop: Operation
    -- Drop: SubOperation
    -- Drop: Resources
    -- Drop: ResourcesProcessingTime
    -- Drop: LabelsProcessingTime
    copy_to_new_message("Path", "url.path", record, new_record)
    copy_to_new_message("QueryString", "url.query", record, new_record)
    copy_to_new_message("HttpMethod", "http.request.method", record, new_record)
    copy_to_new_message("StartTime", "event.start", record, new_record)
    copy_to_new_message("EndTime", "event.end", record, new_record)
    copy_as_number_to_new_message("TotalTime", "event.duration", record, new_record)
    copy_to_new_message("RemoteAddr", "source.ip", record, new_record)
    copy_to_new_message("RemoteHost", "source.domain", record, new_record)
    -- Drop: Host
    -- Drop: RemoteUser
    copy_to_new_message("ResponseStatus", "http.response.status_code", record, new_record)
    copy_as_number_to_new_message("ResponseLength", "http.response.body.bytes", record, new_record)
    copy_to_new_message("ResponseContentType", "http.response.mime_type", record, new_record)
    -- Drop: CacheResult
    -- Drop: MissReason
    -- Drop: Failed (Dervired from http.response.status_code)

    if record["Failed"] == "false" then
        new_record["event.outcome"] = "success"
    end
    if record["Failed"] == "true" then
        new_record["event.outcome"] = "failure"
    end

    return 2, timestamp, new_record
end
