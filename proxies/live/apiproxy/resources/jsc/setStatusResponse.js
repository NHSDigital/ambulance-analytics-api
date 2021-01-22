// response = JSON.parse(context.getVariable("response.content"))
health = true //response.validator && response.coordinator
status = health ? "pass" : "fail"
context.setVariable("health.total", status)
