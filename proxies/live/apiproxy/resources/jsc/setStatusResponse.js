responseStatus = context.getVariable("response.status.code")
if (responseStatus >= 200 && resosneStatus < 300) {
  context.setVariable("health.total", "pass")
} else {
  context.setVariable("health.total", "fail")
}
