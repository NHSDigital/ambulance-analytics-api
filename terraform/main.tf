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
  proxy_type         = "sandbox"
  namespace          = var.namespace
  make_api_product   = length(var.namespace) == 0
  api_product_display_name = "Ambulance Data Api"
}
