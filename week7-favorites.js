
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("w7Favorites");

    // Stop if this page does not contain the favorites container.
    if (!container) return;

    // Sample services used by the Week 7 marketplace.
    // These IDs must match the IDs saved by your marketplace.
    const services = [
        {
            id: 1,
            title: "Professional Website Development",
            freelancer: "Ali Raza",
            category: "Web Development",
            price: 150,
            rating: 4.9
        },
        {
            id: 2,
            title: "Modern Logo and Brand Design",
            freelancer: "Sara Ahmed",
            category: "Graphic Design",
            price: 50,
            rating: 4.8
        },
        {
            id: 3,
            title: "Mobile App UI Design",
            freelancer: "Hamza Khan",
            category: "Mobile App Development",
            price: 100,
            rating: 4.7
        },
        {
            id: 4,
            title: "Data Analysis and Reports",
            freelancer: "Ayesha Malik",
            category: "Data Analysis",
            price: 75,
            rating: 4.5
        },
        {
            id: 5,
            title: "Digital Marketing Campaign",
            freelancer: "Usman Tariq",
            category: "Digital Marketing",
            price: 120,
            rating: 4.6
        }
    ];

    const STORAGE_KEY = "skilloraWeek7Favorites";

    // Read saved favorite IDs safely.
    function getFavoriteIds() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            if (!Array.isArray(saved)) return [];

            // Accept numeric IDs and numeric strings.
            return [...new Set(
                saved
                    .map(id => Number(id))
                    .filter(id => Number.isFinite(id))
            )];
        } catch (error) {
            console.error("Could not read favorites:", error);
            return [];
        }
    }

    // Save updated favorite IDs.
    function saveFavoriteIds(ids) {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(ids)
            );
            return true;
        } catch (error) {
            console.error("Could not save favorites:", error);
            return false;
        }
    }

    // Create a service card safely.
    function createServiceCard(service) {
        const card = document.createElement("article");
        card.className = "w7-service-card";

        const title = document.createElement("h3");
        title.textContent = service.title;

        const freelancer = document.createElement("p");
        freelancer.textContent = `By ${service.freelancer}`;

        const category = document.createElement("p");
        category.textContent = service.category;

        const price = document.createElement("strong");
        price.textContent = `$${service.price}`;

        const rating = document.createElement("p");
        rating.textContent = `⭐ ${service.rating} / 5`;

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "w7-button";
        removeButton.textContent = "♥ Remove from Favorites";

        removeButton.addEventListener("click", () => {
            const currentIds = getFavoriteIds();
            const updatedIds = currentIds.filter(
                id => id !== Number(service.id)
            );

            if (saveFavoriteIds(updatedIds)) {
                renderFavorites();
            } else {
                showMessage(
                    "Unable to update favorites. Please try again.",
                    "error"
                );
            }
        });

        card.append(
            title,
            freelancer,
            category,
            price,
            rating,
            removeButton
        );

        return card;
    }

    // Display a message when no services are saved.
    function showEmptyState() {
        const empty = document.createElement("div");
        empty.className = "w7-empty";

        const heading = document.createElement("h3");
        heading.textContent = "No favorites saved yet";

        const description = document.createElement("p");
        description.textContent =
            "Browse the marketplace and save services to see them here.";

        const link = document.createElement("a");
        link.href = "marketplace.html";
        link.textContent = "Browse Marketplace";

        empty.append(heading, description, link);
        container.appendChild(empty);
    }

    // Show a status message if saving fails.
    function showMessage(message, type) {
        let status = document.getElementById("w7FavoriteStatus");

        if (!status) {
            status = document.createElement("p");
            status.id = "w7FavoriteStatus";
            status.setAttribute("role", "status");
            container.prepend(status);
        }

        status.className = `w7-status ${type}`;
        status.textContent = message;
    }

    // Render all currently saved services.
    function renderFavorites() {
        container.replaceChildren();

        const ids = getFavoriteIds();

        const favorites = services.filter(service =>
            ids.includes(Number(service.id))
        );

        if (favorites.length === 0) {
            showEmptyState();
            return;
        }

        const heading = document.createElement("h2");
        heading.textContent = `Saved Services (${favorites.length})`;
        container.appendChild(heading);

        favorites.forEach(service => {
            container.appendChild(createServiceCard(service));
        });
    }

    // Update the page when favorites change in another browser tab.
    window.addEventListener("storage", event => {
        if (event.key === STORAGE_KEY) {
            renderFavorites();
        }
    });

    renderFavorites();
});
