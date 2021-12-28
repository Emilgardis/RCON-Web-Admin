variable "DOCKER_TAG" {
    default = "latest"
}

variable "DOCKER_REPO" {
    default = "rcon-web-admin"
}

group "default" {
    targets = ["app"]
}

target "app" {
    tags = ["ghcr.io/emilgardis/${DOCKER_REPO}:${DOCKER_TAG}"]
    platforms = ["linux/amd64", "linux/arm64"]
    args = {

    }
}

target "app-v7" {
    inherits = ["app"]
    // armv7 is broken, see https://github.com/docker/buildx/issues/395 
    platforms = ["linux/arm/v7"]
}