variable "REV" {
    default = "dev"
}

group "default" {
    targets = ["app"]
}

target "docker-metadata-action" {}

target "app" {
    inherits = ["docker-metadata-action"]
    platforms = ["linux/amd64", "linux/arm64"]
    args = {
        revision= "${REV}"
    }
}

target "app-v7" {
    inherits = ["app"]
    // armv7 is broken, see https://github.com/docker/buildx/issues/395 
    platforms = ["linux/arm/v7"]
}
