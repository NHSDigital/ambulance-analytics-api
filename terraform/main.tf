provider "apigee" {
  org          = var.apigee_organization
  access_token = var.apigee_token
}

terraform {
  backend "azurerm" {}

  required_providers {
    apigee = "~> 0.0"
    archive = "~> 1.3"
  }
}

module "ambulance-data" {
  source             = "github.com/NHSDigital/api-platform-service-module.git"
  name               = "ambulance-data"
  path               = "ambulance-data"
  apigee_environment = var.apigee_environment
  proxy_type         = (var.force_sandbox || length(regexall("sandbox", var.apigee_environment)) > 0) ? "sandbox" : "live"
  namespace          = var.namespace
  make_api_product   = length(var.namespace) == 0
  api_product_display_name = length(var.namespace) > 0 ? "ambulance-data${var.namespace}" : "Ambulance Data Api"
}

resource "apigee_target_server" "ambulance-api" {
    count   = (var.force_sandbox || length(regexall("sandbox", var.apigee_environment)) > 0) ? 0 : 1
    name    = "dps-ambulance-api"
    host    = var.dps-submission-api-host
    env     = var.apigee_environment
    enabled = true
    port    = 443

    ssl_info {
        ssl_enabled              = true
        client_auth_enabled      = false
        ignore_validation_errors = false
        ciphers                  = []
        protocols                = []
    }
}
