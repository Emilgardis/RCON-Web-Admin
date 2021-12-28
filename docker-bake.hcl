variable "DOCKER_TAG" {
    default = "dev"
}

variable "DOCKER_REPO" {
    default = "rcon-web-admin"
}

variable "REV" {
    default = "dev"
}

group "default" {
    targets = ["app"]
}

target "app" {
    tags = [
        "ghcr.io/emilgardis/${DOCKER_REPO}:${DOCKER_TAG}",
        notequal("dev", DOCKER_TAG) ? "ghcr.io/emilgardis/${DOCKER_REPO}:latest" : "",
    ]
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