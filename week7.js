
/* ===================================
   SKILLORA WEEK 7
   Search, Filters, Sorting, Favorites
=================================== */

const week7Services = [
    {
        id: 1,
        title: "Professional Website Development",
        freelancer: "Ali Raza",
        category: "Web Development",
        price: 150,
        rating: 4.9,
        delivery: 5,
        experience: "Expert",
        popularity: 95,
        date: "2026-10-20",
        description: "Responsive business websites with modern design."
    },
    {
        id: 2,
        title: "Modern Logo and Brand Design",
        freelancer: "Sara Ahmed",
        category: "Graphic Design",
        price: 50,
        rating: 4.8,
        delivery: 3,
        experience: "Intermediate",
        popularity: 88,
        date: "2026-10-18",
        description: "Creative logos and professional brand identity."
    },
    {
        id: 3,
        title: "Mobile App UI Design",
        freelancer: "Hamza Khan",
        category: "Mobile App Development",
        price: 100,
        rating: 4.7,
        delivery: 7,
        experience: "Expert",
        popularity: 80,
        date: "2026-10-15",
        description: "Clean and user-friendly mobile app interfaces."
    },
    {
        id: 4,
        title: "Data Analysis and Reports",
        freelancer: "Ayesha Malik",
        category: "Data Analysis",
        price: 75,
        rating: 4.5,
        delivery: 4,
        experience: "Intermediate",
        popularity: 72,
        date: "2026-10-12",
        description: "Organized data analysis and clear reports."
    },
    {
        id: 5,
        title: "Digital Marketing Campaign",
        freelancer: "Usman Tariq",
        category: "Digital Marketing",
        price: 120,
        rating: 4.6,
        delivery: 6,
        experience: "Expert",
        popularity: 90,
        date: "2026-10-10",
        description: "Marketing strategy and campaign optimization."
    }
];

const W7_FAVORITES_KEY = "skilloraWeek7Favorites";

function w7GetFavorites() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(W7_FAVORITES_KEY) || "[]"
        );

        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

function w7SaveFavorites(favorites) {
    localStorage.setItem(
        W7_FAVORITES_KEY,
        JSON.stringify(favorites)
    );
}

function w7RenderMarketplace() {
    const results = document.getElementById("w7Results");

    if (!results) return;

    const search = (
        document.getElementById("w7Search")?.value || ""
    ).trim().toLowerCase();

    const category =
        document.getElementById("w7Category")?.value || "all";

    const minPrice = Number(
        document.getElementById("w7MinPrice")?.value || 0
    );

    const maxPriceInput =
        document.getElementById("w7MaxPrice")?.value || "";

    const maxPrice = maxPriceInput === ""
        ? Infinity
        : Number(maxPriceInput);

    const minRating = Number(
        document.getElementById("w7Rating")?.value || 0
    );

    const maxDelivery = Number(
        document.getElementById("w7Delivery")?.value || 0
    );

    const experience =
        document.getElementById("w7Experience")?.value || "all";

    const sort =
        document.getElementById("w7Sort")?.value || "newest";

    let filtered = week7Services.filter(service => {
        const searchableText = [
            service.title,
            service.freelancer,
            service.category,
            service.description
        ].join(" ").toLowerCase();

        return (
            searchableText.includes(search) &&
            (category === "all" || service.category === category) &&
            service.price >= minPrice &&
            service.price <= maxPrice &&
            service.rating >= minRating &&
            (!maxDelivery || service.delivery <= maxDelivery) &&
            (experience === "all" ||
                service.experience === experience)
        );
    });

    switch (sort) {
        case "price-low":
            filtered.sort((a, b) => a.price - b.price);
            break;

        case "price-high":
            filtered.sort((a, b) => b.price - a.price);
            break;

        case "rating":
            filtered.sort((a, b) => b.rating - a.rating);
            break;

        case "popular":
            filtered.sort((a, b) => b.popularity - a.popularity);
            break;

        case "newest":
            filtered.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );
            break;
    }

    const favorites = w7GetFavorites();

    document.getElementById("w7ResultCount").textContent =
        `${filtered.length} services found`;

    if (!filtered.length) {
        results.innerHTML = `
            <div class="w7-empty">
                <h3>No services found</h3>
                <p>Try changing your search or filters.</p>
            </div>
        `;
        return;
    }

    results.innerHTML = filtered.map(service => {
        const saved = favorites.includes(service.id);

        return `
            <article class="w7-service-card">
                <h3>${service.title}</h3>
                <p>${service.description}</p>

                <div class="w7-service-meta">
                    <span>${service.category}</span>
                    <span>⭐ ${service.rating}</span>
                </div>

                <div class="w7-service-meta">
                    <span>By ${service.freelancer}</span>
                    <strong>$${service.price}</strong>
                </div>

                <div class="w7-service-meta">
                    <span>${service.delivery} days delivery</span>
                    <span>${service.experience}</span>
                </div>

                <button
                    class="w7-favorite-button ${saved ? "is-saved" : ""}"
                    data-w7-favorite="${service.id}"
                    type="button"
                >
                    ${saved ? "♥ Saved" : "♡ Add to Favorites"}
                </button>
            </article>
        `;
    }).join("");
}

function w7ToggleFavorite(id) {
    const favorites = w7GetFavorites();
    const updated = favorites.includes(id)
        ? favorites.filter(item => item !== id)
        : [...favorites, id];

    w7SaveFavorites(updated);
    w7RenderMarketplace();
}

document.addEventListener("DOMContentLoaded", () => {
    const results = document.getElementById("w7Results");

    if (!results) return;

    [
        "w7Search",
        "w7Category",
        "w7MinPrice",
        "w7MaxPrice",
        "w7Rating",
        "w7Delivery",
        "w7Experience",
        "w7Sort"
    ].forEach(id => {
        document.getElementById(id)?.addEventListener(
            id === "w7Search" ? "input" : "change",
            w7RenderMarketplace
        );
    });

    results.addEventListener("click", event => {
        const button = event.target.closest("[data-w7-favorite]");

        if (button) {
            w7ToggleFavorite(Number(button.dataset.w7Favorite));
        }
    });

    document.getElementById("w7Reset")?.addEventListener("click", () => {
        document.getElementById("w7Search").value = "";
        document.getElementById("w7Category").value = "all";
        document.getElementById("w7MinPrice").value = "";
        document.getElementById("w7MaxPrice").value = "";
        document.getElementById("w7Rating").value = "0";
        document.getElementById("w7Delivery").value = "0";
        document.getElementById("w7Experience").value = "all";
        document.getElementById("w7Sort").value = "newest";

        w7RenderMarketplace();
    });

    w7RenderMarketplace();
});
