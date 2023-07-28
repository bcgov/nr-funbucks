function parse_network_information(tag,timestamp,record)
  new_record = record
  code = 0
    if new_record["log.level"] == "INFO" then
      new_record["event.dataset"] = "mq.audit"
      new_record["event.provider"]="ActiveMQ"
      message=new_record["message"]
      i,j=string.find(message, "| ActiveMQ Transport: ")      
      new_str=string.sub(message, i+2)
      new_record["message"]=string.sub(message,1,i-2)
      --> append network information
      a,b =string.find(new_str, "Transport: ")  --> get position for network scheme
      l,m = string.find(new_str, ":///")   -->get position for ip address
      c,d=string.find(new_str, "@")         -->to remove after port
      new_record["url.scheme"]=string.sub(new_str, b+1, l-1)       --> tcp 
      ip_string=string.sub(new_str,m+1,c-1)     --> IP address with port
      e,f=string.find(ip_string,':')        --> get port position
      new_record["source.ip"]=string.sub(ip_string,1,e-1)        -->IP
      new_record["source.port"]=string.sub(ip_string,e+1)        -->port
      code = 2
    end
    return code,timestamp,new_record
end