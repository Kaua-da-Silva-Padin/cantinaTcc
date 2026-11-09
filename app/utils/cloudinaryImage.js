export function toCloudinaryPublicId(name) {
    const words = name.trim().split(/\s+/).filter(Boolean);

    return words
        .map((word, index) => {
            const lower = word.toLowerCase();
            return index === 0
                ? lower
                : lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join("");
}

export function rememberCloudinaryVersion(publicId, version) {
    if (typeof window !== "undefined" && version) {
        window.sessionStorage.setItem(`cloudinary-version:${publicId}`, String(version));
    }
}

export function createCloudinaryImage(cloudinary, name) {
    const publicId = toCloudinaryPublicId(name);
    const image = cloudinary.image(publicId);
    const version = typeof window !== "undefined"
        ? window.sessionStorage.getItem(`cloudinary-version:${publicId}`)
        : null;

    if (version) {
        image.setVersion(version);
    }

    return image;
}