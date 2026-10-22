const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("open");

        const icon = menuBtn.querySelector("i");

        if (navLinks.classList.contains("open")) {
            icon?.classList.remove("fa-bars");
            icon?.classList.add("fa-xmark");
        } else {
            icon?.classList.remove("fa-xmark");
            icon?.classList.add("fa-bars");
        }
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");

            const icon = menuBtn.querySelector("i");

            icon?.classList.remove("fa-xmark");
            icon?.classList.add("fa-bars");
        });
    });
}

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

let toastTimer;

function showToast(message) {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);

    if (!modal) return;

    modal.classList.add("show");
    document.body.classList.add("modal-open");
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);

    if (!modal) return;

    modal.classList.remove("show");

    if (!document.querySelector(".modal.show")) {
        document.body.classList.remove("modal-open");
    }
}

function switchModal(currentModal, nextModal) {
    closeModal(currentModal);
    openModal(nextModal);
}

document.querySelectorAll(".open-login").forEach(button => {
    button.addEventListener("click", event => {
        event.preventDefault();
        openModal("loginModal");
    });
});

document.querySelectorAll(".open-register").forEach(button => {
    button.addEventListener("click", event => {
        event.preventDefault();
        openModal("registerModal");
    });
});

document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    });
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeModal("loginModal");
        closeModal("registerModal");
    }
});

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", event => {
        event.preventDefault();

        closeModal("loginModal");
        showToast("Login successful! Welcome back.");

        loginForm.reset();
    });
}

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", event => {
        event.preventDefault();

        closeModal("registerModal");
        showToast("Account created successfully!");

        registerForm.reset();
    });
}

const heroSearch = document.getElementById("heroSearch");
const heroSearchBtn = document.getElementById("searchBtn");
const searchCategory = document.getElementById("searchCategory");

function performHeroSearch() {
    if (!heroSearch || !searchCategory) return;

    const query = heroSearch.value.trim();
    const category = searchCategory.value;

    if (!query && category === "all") {
        showToast("Please enter a service or choose a category.");
        heroSearch.focus();
        return;
    }

    const params = new URLSearchParams();

    if (query) {
        params.set("search", query);
    }

    if (category !== "all") {
        params.set("category", category);
    }

    window.location.href = `services.html?${params.toString()}`;
}

if (heroSearchBtn) {
    heroSearchBtn.addEventListener("click", performHeroSearch);
}

if (heroSearch) {
    heroSearch.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            performHeroSearch();
        }
    });
}

document.querySelectorAll(".popular-searches button").forEach(button => {
    button.addEventListener("click", () => {
        if (!heroSearch) return;

        heroSearch.value = button.dataset.search;

        if (searchCategory) {
            searchCategory.value = "all";
        }

        performHeroSearch();
    });
});

document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
        const category = card.dataset.category;

        if (!category) return;

        window.location.href =
            `services.html?category=${encodeURIComponent(category)}`;
    });
});

const filterButtons = document.querySelectorAll(".filter-btn");
const freelancerCards = document.querySelectorAll(".freelancer-card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const filter = button.dataset.filter;

        freelancerCards.forEach(card => {
            if (filter === "all" || card.dataset.role === filter) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    });
});

document.querySelectorAll(".favorite").forEach(button => {
    button.addEventListener("click", event => {
        event.stopPropagation();

        button.classList.toggle("liked");

        const icon = button.querySelector("i");

        if (!icon) return;

        if (button.classList.contains("liked")) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");

            showToast("Freelancer added to favorites.");
        } else {
            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");

            showToast("Removed from favorites.");
        }
    });
});

document.querySelectorAll(".view-profile").forEach(button => {
    button.addEventListener("click", () => {
        const card = button.closest(".freelancer-card");

        if (!card) return;

        const name = card.querySelector("h3")?.textContent.trim();

        if (!name) return;

        localStorage.setItem("selectedFreelancer", name);

        window.location.href = "profile.html";
    });
});

const servicesGrid = document.getElementById("servicesGrid");
const marketplaceSearch = document.getElementById("serviceSearch");
const marketplaceSearchBtn = document.getElementById("marketplaceSearchBtn");
const resultCount = document.getElementById("resultCount");
const noResults = document.getElementById("noResults");
const sortSelect = document.getElementById("sortSelect");
const clearFilters = document.getElementById("clearFilters");

let selectedSkill = "";

function filterServices() {
    if (!servicesGrid) return;

    const cards = Array.from(
        servicesGrid.querySelectorAll(".market-card")
    );

    const searchTerm = marketplaceSearch
        ? marketplaceSearch.value.toLowerCase().trim()
        : "";

    const selectedCategory =
        document.querySelector('input[name="category"]:checked');

    const category = selectedCategory
        ? selectedCategory.value
        : "All";

    let visibleCount = 0;

    cards.forEach(card => {

        const name = (card.dataset.name || "").toLowerCase();
        const title = (card.dataset.title || "").toLowerCase();
        const cardCategory = card.dataset.category || "";
        const skills = (card.dataset.skills || "").toLowerCase();

        const matchesSearch =
            !searchTerm ||
            name.includes(searchTerm) ||
            title.includes(searchTerm) ||
            cardCategory.toLowerCase().includes(searchTerm) ||
            skills.includes(searchTerm);

        const matchesCategory =
            category === "All" ||
            cardCategory === category;

        const matchesSkill =
            !selectedSkill ||
            skills.includes(selectedSkill.toLowerCase());

        if (matchesSearch && matchesCategory && matchesSkill) {
            card.style.display = "";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    if (resultCount) {
        resultCount.textContent =
            `Showing ${visibleCount} result${visibleCount !== 1 ? "s" : ""}`;
    }

    if (noResults) {
        noResults.style.display =
            visibleCount === 0 ? "block" : "none";
    }
}

if (marketplaceSearchBtn) {
    marketplaceSearchBtn.addEventListener("click", filterServices);
}

if (marketplaceSearch) {
    marketplaceSearch.addEventListener("input", filterServices);

    marketplaceSearch.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            filterServices();
        }
    });
}

document.querySelectorAll('input[name="category"]').forEach(input => {
    input.addEventListener("change", () => {
        filterServices();
    });
});

document.querySelectorAll(".skill-tags button").forEach(button => {
    button.addEventListener("click", () => {

        const skill = button.dataset.skill;

        if (selectedSkill === skill) {
            selectedSkill = "";
            button.classList.remove("active");
        } else {
            document.querySelectorAll(".skill-tags button").forEach(btn => {
                btn.classList.remove("active");
            });

            selectedSkill = skill;
            button.classList.add("active");
        }

        filterServices();
    });
});

if (sortSelect && servicesGrid) {

    sortSelect.addEventListener("change", () => {

        const cards = Array.from(
            servicesGrid.querySelectorAll(".market-card")
        );

        const sortType = sortSelect.value;

        cards.sort((a, b) => {

            const priceA = Number(a.dataset.price || 0);
            const priceB = Number(b.dataset.price || 0);

            const ratingA = Number(a.dataset.rating || 0);
            const ratingB = Number(b.dataset.rating || 0);

            if (sortType === "priceLow") {
                return priceA - priceB;
            }

            if (sortType === "priceHigh") {
                return priceB - priceA;
            }

            if (sortType === "rating") {
                return ratingB - ratingA;
            }

            return 0;
        });

        cards.forEach(card => {
            servicesGrid.appendChild(card);
        });

        filterServices();
    });
}

if (clearFilters) {

    clearFilters.addEventListener("click", () => {

        if (marketplaceSearch) {
            marketplaceSearch.value = "";
        }

        const allCategory =
            document.querySelector(
                'input[name="category"][value="All"]'
            );

        if (allCategory) {
            allCategory.checked = true;
        }

        if (sortSelect) {
            sortSelect.value = "default";
        }

        selectedSkill = "";

        document.querySelectorAll(".skill-tags button").forEach(button => {
            button.classList.remove("active");
        });

        filterServices();

        showToast("Filters cleared.");
    });
}

document.querySelectorAll(".favorite-btn").forEach(button => {

    button.addEventListener("click", event => {

        event.stopPropagation();

        button.classList.toggle("active");

        const icon = button.querySelector("i");

        if (!icon) return;

        if (button.classList.contains("active")) {

            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");

            showToast("Added to favorites.");

        } else {

            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");

            showToast("Removed from favorites.");
        }
    });
});

document.querySelectorAll(".profile-link").forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.name;

        if (!name) return;

        localStorage.setItem("selectedFreelancer", name);

        window.location.href = "profile.html";
    });
});

document.querySelectorAll(".service-link").forEach(button => {

    button.addEventListener("click", () => {

        const service = button.dataset.service;

        if (!service) return;

        localStorage.setItem("selectedService", service);

        window.location.href = "service-details.html";
    });
});

const freelancerData = {

    "Ali Raza": {
        image: "https://i.pravatar.cc/300?img=12",
        role: "Professional Web Developer",
        rating: "4.9",
        reviews: "128 reviews",
        projects: "156",
        response: "1 hour",
        experience: "5+ Years",
        about: "I am a professional freelance developer focused on building modern, responsive and high-quality websites for businesses and startups. I specialize in creating clean user interfaces and reliable web experiences.",
        skills: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "UI/UX", "Web Development"]
    },

    "Sara Ahmed": {
        image: "https://i.pravatar.cc/300?img=47",
        role: "Professional Graphic Designer",
        rating: "4.8",
        reviews: "96 reviews",
        projects: "121",
        response: "2 hours",
        experience: "4+ Years",
        about: "I am a creative graphic designer specializing in logos, brand identities and visual content for businesses and modern startups.",
        skills: ["Logo Design", "Brand Identity", "UI/UX", "Photoshop", "Illustrator"]
    },

    "Hamza Khan": {
        image: "https://i.pravatar.cc/300?img=68",
        role: "Mobile App Developer",
        rating: "5.0",
        reviews: "74 reviews",
        projects: "98",
        response: "1 hour",
        experience: "4+ Years",
        about: "I build modern and scalable mobile applications with clean interfaces and smooth user experiences for Android and iOS platforms.",
        skills: ["React", "JavaScript", "Mobile Development", "UI Design", "API Integration"]
    },

    "Ayesha Malik": {
        image: "https://i.pravatar.cc/300?img=44",
        role: "Data Analyst",
        rating: "4.9",
        reviews: "81 reviews",
        projects: "113",
        response: "2 hours",
        experience: "5+ Years",
        about: "I help businesses transform raw data into useful insights through professional analysis, visualization and reporting.",
        skills: ["Python", "Data Analysis", "Excel", "Visualization", "Statistics"]
    },

    "Usman Tariq": {
        image: "https://i.pravatar.cc/300?img=11",
        role: "Digital Marketing Expert",
        rating: "4.7",
        reviews: "65 reviews",
        projects: "87",
        response: "3 hours",
        experience: "4+ Years",
        about: "I create practical digital marketing strategies that help businesses improve visibility, engagement and online growth.",
        skills: ["SEO", "Marketing", "Social Media", "Content Strategy", "Analytics"]
    },

    "Zain Abbas": {
        image: "https://i.pravatar.cc/300?img=53",
        role: "UI/UX Designer",
        rating: "4.8",
        reviews: "103 reviews",
        projects: "142",
        response: "1 hour",
        experience: "5+ Years",
        about: "I design modern, intuitive and user-focused interfaces for websites, dashboards and digital products.",
        skills: ["UI/UX", "Figma", "Wireframing", "Prototyping", "Design Systems"]
    },

    "Bilal Ahmed": {
        image: "https://i.pravatar.cc/300?img=60",
        role: "Python Developer",
        rating: "4.9",
        reviews: "92 reviews",
        projects: "134",
        response: "2 hours",
        experience: "5+ Years",
        about: "I develop reliable Python web applications with clean architecture, responsive interfaces and scalable functionality.",
        skills: ["Python", "Django", "HTML", "CSS", "JavaScript", "SQL"]
    },

    "Maham Noor": {
        image: "https://i.pravatar.cc/300?img=49",
        role: "Marketing Specialist",
        rating: "4.6",
        reviews: "57 reviews",
        projects: "79",
        response: "3 hours",
        experience: "3+ Years",
        about: "I help brands build stronger social media presence through engaging content and effective marketing campaigns.",
        skills: ["Social Media", "Marketing", "Content Creation", "Campaigns"]
    },

    "Hassan Ali": {
        image: "https://i.pravatar.cc/300?img=14",
        role: "Data Specialist",
        rating: "4.8",
        reviews: "69 reviews",
        projects: "104",
        response: "2 hours",
        experience: "4+ Years",
        about: "I specialize in business dashboards, data reporting and analytical solutions that help organizations make better decisions.",
        skills: ["Data Analysis", "Dashboards", "Excel", "SQL", "Visualization"]
    },

    "Fatima Khan": {
        image: "https://i.pravatar.cc/300?img=32",
        role: "Brand Designer",
        rating: "5.0",
        reviews: "88 reviews",
        projects: "126",
        response: "1 hour",
        experience: "5+ Years",
        about: "I create memorable brand identities that help businesses communicate their values through professional visual design.",
        skills: ["Brand Identity", "UI/UX", "Logo Design", "Typography"]
    },

    "Omar Shah": {
        image: "https://i.pravatar.cc/300?img=5",
        role: "Frontend Developer",
        rating: "4.7",
        reviews: "76 reviews",
        projects: "101",
        response: "2 hours",
        experience: "4+ Years",
        about: "I build modern frontend applications with responsive layouts, interactive interfaces and clean JavaScript code.",
        skills: ["React", "JavaScript", "HTML5", "CSS3", "Responsive Design"]
    },

    "Noor Fatima": {
        image: "https://i.pravatar.cc/300?img=25",
        role: "Mobile Developer",
        rating: "4.9",
        reviews: "91 reviews",
        projects: "119",
        response: "1 hour",
        experience: "5+ Years",
        about: "I develop cross-platform mobile applications focused on performance, usability and modern design.",
        skills: ["React", "JavaScript", "Mobile Development", "API Integration"]
    }
};

const selectedFreelancer =
    localStorage.getItem("selectedFreelancer");

if (
    selectedFreelancer &&
    freelancerData[selectedFreelancer]
) {

    const data = freelancerData[selectedFreelancer];

    const profileName = document.getElementById("profileName");
    const profileRole = document.getElementById("profileRole");
    const profileImage = document.getElementById("profileImage");
    const profileRating = document.getElementById("profileRating");
    const profileReviews = document.getElementById("profileReviews");
    const profileAbout = document.getElementById("profileAbout");
    const profileProjects = document.getElementById("profileProjects");
    const profileStatRating = document.getElementById("profileStatRating");
    const profileResponse = document.getElementById("profileResponse");
    const profileExperience = document.getElementById("profileExperience");
    const profileSkills = document.getElementById("profileSkills");

    if (profileName) profileName.textContent = selectedFreelancer;
    if (profileRole) profileRole.textContent = data.role;
    if (profileImage) profileImage.src = data.image;
    if (profileRating) profileRating.textContent = data.rating;
    if (profileReviews) profileReviews.textContent = data.reviews;
    if (profileAbout) profileAbout.textContent = data.about;
    if (profileProjects) profileProjects.textContent = data.projects;
    if (profileStatRating) profileStatRating.textContent = `${data.rating}/5`;
    if (profileResponse) profileResponse.textContent = data.response;
    if (profileExperience) profileExperience.textContent = data.experience;

    if (profileSkills) {
        profileSkills.innerHTML = "";

        data.skills.forEach(skill => {
            const span = document.createElement("span");
            span.textContent = skill;
            profileSkills.appendChild(span);
        });
    }
}

const saveProfile = document.getElementById("saveProfile");

if (saveProfile) {

    saveProfile.addEventListener("click", () => {

        saveProfile.classList.toggle("saved");

        const icon = saveProfile.querySelector("i");

        if (saveProfile.classList.contains("saved")) {

            icon?.classList.remove("fa-regular");
            icon?.classList.add("fa-solid");

            showToast("Freelancer saved.");

        } else {

            icon?.classList.remove("fa-solid");
            icon?.classList.add("fa-regular");

            showToast("Freelancer removed from saved list.");
        }
    });
}

const contactFreelancer =
    document.getElementById("contactFreelancer");

if (contactFreelancer) {
    contactFreelancer.addEventListener("click", () => {
        showToast("Messaging feature coming soon.");
    });
}

const serviceData = {

    "Modern Responsive Website": {
        category: "Web Development",
        title: "Modern Responsive Website",
        price: "$80",
        rating: "4.9",
        reviews: "128 Reviews",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        seller: "Ali Raza",
        sellerRole: "Professional Web Developer",
        sellerImage: "https://i.pravatar.cc/100?img=12",
        description: "I will create a modern, professional and fully responsive website designed according to your requirements. The website will work smoothly across desktop, tablet and mobile devices. The service includes clean code, responsive layouts, modern UI design and optimized user experience."
    },

    "Professional Logo Design": {
        category: "Graphic Design",
        title: "Professional Logo Design",
        price: "$45",
        rating: "4.8",
        reviews: "96 Reviews",
        image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80",
        seller: "Sara Ahmed",
        sellerRole: "Professional Graphic Designer",
        sellerImage: "https://i.pravatar.cc/100?img=47",
        description: "I will create a professional and memorable logo that represents your brand identity. You will receive a modern design created according to your business requirements."
    },

    "Android & iOS Mobile App": {
        category: "Mobile Development",
        title: "Android & iOS Mobile App",
        price: "$150",
        rating: "5.0",
        reviews: "74 Reviews",
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80",
        seller: "Hamza Khan",
        sellerRole: "Mobile App Developer",
        sellerImage: "https://i.pravatar.cc/100?img=68",
        description: "I will develop a modern mobile application with a clean interface and smooth user experience for Android and iOS platforms."
    },

    "Data Analysis & Visualization": {
        category: "Data Analysis",
        title: "Data Analysis & Visualization",
        price: "$95",
        rating: "4.9",
        reviews: "81 Reviews",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        seller: "Ayesha Malik",
        sellerRole: "Data Analyst",
        sellerImage: "https://i.pravatar.cc/100?img=44",
        description: "I will analyze your data and create professional visualizations and reports that help you understand important trends and business insights."
    },

    "SEO & Digital Marketing": {
        category: "Digital Marketing",
        title: "SEO & Digital Marketing",
        price: "$60",
        rating: "4.7",
        reviews: "65 Reviews",
        image: "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1200&q=80",
        seller: "Usman Tariq",
        sellerRole: "Digital Marketing Expert",
        sellerImage: "https://i.pravatar.cc/100?img=11",
        description: "I will improve your online presence through professional SEO and digital marketing strategies designed to increase visibility and engagement."
    },

    "UI UX Website Design": {
        category: "Graphic Design",
        title: "UI UX Website Design",
        price: "$70",
        rating: "4.8",
        reviews: "103 Reviews",
        image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=80",
        seller: "Zain Abbas",
        sellerRole: "UI/UX Designer",
        sellerImage: "https://i.pravatar.cc/100?img=53",
        description: "I will design a modern and user-friendly website interface focused on usability, visual hierarchy and an excellent user experience."
    },

    "Python Web Application": {
        category: "Web Development",
        title: "Python Web Application",
        price: "$120",
        rating: "4.9",
        reviews: "92 Reviews",
        image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80",
        seller: "Bilal Ahmed",
        sellerRole: "Python Developer",
        sellerImage: "https://i.pravatar.cc/100?img=60",
        description: "I will build a reliable Python web application with clean architecture, responsive interfaces and functionality tailored to your requirements."
    },

    "Social Media Marketing": {
        category: "Digital Marketing",
        title: "Social Media Marketing",
        price: "$55",
        rating: "4.6",
        reviews: "57 Reviews",
        image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=1200&q=80",
        seller: "Maham Noor",
        sellerRole: "Marketing Specialist",
        sellerImage: "https://i.pravatar.cc/100?img=49",
        description: "I will create a professional social media marketing strategy to improve your brand awareness, engagement and online growth."
    },

    "Business Dashboard": {
        category: "Data Analysis",
        title: "Business Dashboard",
        price: "$110",
        rating: "4.8",
        reviews: "69 Reviews",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        seller: "Hassan Ali",
        sellerRole: "Data Specialist",
        sellerImage: "https://i.pravatar.cc/100?img=14",
        description: "I will create a professional business dashboard that transforms your data into clear and useful visual reports."
    },

    "Creative Brand Identity": {
        category: "Graphic Design",
        title: "Creative Brand Identity",
        price: "$90",
        rating: "5.0",
        reviews: "88 Reviews",
        image: "https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=1200&q=80",
        seller: "Fatima Khan",
        sellerRole: "Brand Designer",
        sellerImage: "https://i.pravatar.cc/100?img=32",
        description: "I will develop a creative brand identity that gives your business a professional and memorable visual presence."
    },

    "React Web Application": {
        category: "Web Development",
        title: "React Web Application",
        price: "$135",
        rating: "4.7",
        reviews: "76 Reviews",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
        seller: "Omar Shah",
        sellerRole: "Frontend Developer",
        sellerImage: "https://i.pravatar.cc/100?img=5",
        description: "I will build a modern and interactive React web application with responsive layouts and clean frontend architecture."
    },

    "Cross Platform Mobile App": {
        category: "Mobile Development",
        title: "Cross Platform Mobile App",
        price: "$180",
        rating: "4.9",
        reviews: "91 Reviews",
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80",
        seller: "Noor Fatima",
        sellerRole: "Mobile Developer",
        sellerImage: "https://i.pravatar.cc/100?img=25",
        description: "I will develop a high-quality cross-platform mobile application with a modern interface, responsive experience and reliable functionality."
    }
};

const selectedService =
    localStorage.getItem("selectedService");

if (
    selectedService &&
    serviceData[selectedService]
) {

    const data = serviceData[selectedService];

    const serviceImage = document.getElementById("serviceImage");
    const serviceCategory = document.getElementById("serviceCategory");
    const serviceTitle = document.getElementById("serviceTitle");
    const servicePrice = document.getElementById("servicePrice");
    const serviceRating = document.getElementById("serviceRating");
    const serviceReviews = document.getElementById("serviceReviews");
    const serviceDescription = document.getElementById("serviceDescription");
    const sellerImage = document.getElementById("sellerImage");
    const sellerName = document.getElementById("sellerName");
    const sellerRole = document.getElementById("sellerRole");

    if (serviceImage) {
        serviceImage.src = data.image;
        serviceImage.alt = data.title;
    }

    if (serviceCategory) {
        serviceCategory.textContent = data.category;
    }

    if (serviceTitle) {
        serviceTitle.textContent = data.title;
    }

    if (servicePrice) {
        servicePrice.textContent = data.price;
    }

    if (serviceRating) {
        serviceRating.textContent = data.rating;
    }

    if (serviceReviews) {
        serviceReviews.textContent = data.reviews;
    }

    if (serviceDescription) {
        serviceDescription.textContent = data.description;
    }

    if (sellerImage) {
        sellerImage.src = data.sellerImage;
        sellerImage.alt = data.seller;
    }

    if (sellerName) {
        sellerName.textContent = data.seller;
    }

    if (sellerRole) {
        sellerRole.textContent = data.sellerRole;
    }
}

const orderService =
    document.getElementById("orderService");

if (orderService) {
    orderService.addEventListener("click", () => {
        showToast("Order feature coming soon.");
    });
}

const messageSeller =
    document.getElementById("messageSeller");

if (messageSeller) {
    messageSeller.addEventListener("click", () => {
        showToast("Messaging feature coming soon.");
    });
}

const sellerProfile =
    document.getElementById("sellerProfile");

if (sellerProfile) {

    sellerProfile.addEventListener("click", () => {

        const service =
            serviceData[localStorage.getItem("selectedService")];

        if (!service) return;

        localStorage.setItem(
            "selectedFreelancer",
            service.seller
        );

        window.location.href = "profile.html";
    });
}

const serviceSearchParams =
    new URLSearchParams(window.location.search);

if (servicesGrid) {

    const urlSearch =
        serviceSearchParams.get("search");

    const urlCategory =
        serviceSearchParams.get("category");

    if (urlSearch && marketplaceSearch) {
        marketplaceSearch.value = urlSearch;
    }

    if (urlCategory) {

        const categoryInput =
            document.querySelector(
                `input[name="category"][value="${CSS.escape(urlCategory)}"]`
            );

        if (categoryInput) {
            categoryInput.checked = true;
        }
    }

    filterServices();
}

console.log("Skillora Freelancing Marketplace loaded successfully.");

const jobsGrid = document.getElementById("jobsGrid");
const jobSearch = document.getElementById("jobSearch");
const jobSearchBtn = document.getElementById("jobSearchBtn");
const jobCategory = document.getElementById("jobCategory");
const jobSort = document.getElementById("jobSort");
const clearJobFilters = document.getElementById("clearJobFilters");
const jobResultCount = document.getElementById("jobResultCount");
const noJobs = document.getElementById("noJobs");

let jobsData = [
    {
        id: 1,
        title: "Build a Modern Business Website",
        category: "Web Development",
        budget: 450,
        skills: ["HTML", "CSS", "JavaScript", "Responsive Design"],
        description: "We are looking for a skilled frontend developer to build a modern and responsive business website with multiple pages, animations and a professional user interface.",
        posted: "2 hours ago",
        proposals: 8,
        client: "Daniel Morgan",
        experience: "Intermediate"
    },
    {
        id: 2,
        title: "Professional E-Commerce Website Design",
        category: "Web Development",
        budget: 750,
        skills: ["HTML", "CSS", "JavaScript", "UI/UX"],
        description: "Need a professional e-commerce website design with product pages, shopping experience, responsive layouts and a clean modern interface.",
        posted: "5 hours ago",
        proposals: 14,
        client: "Michael Carter",
        experience: "Expert"
    },
    {
        id: 3,
        title: "Create a Complete Brand Identity",
        category: "Graphic Design",
        budget: 300,
        skills: ["Logo Design", "Branding", "Typography", "Illustrator"],
        description: "Looking for a creative designer to develop a complete brand identity including logo, colors, typography and supporting visual assets.",
        posted: "1 day ago",
        proposals: 11,
        client: "Sophia Wilson",
        experience: "Intermediate"
    },
    {
        id: 4,
        title: "Develop a Mobile Application",
        category: "Mobile Development",
        budget: 1200,
        skills: ["React Native", "JavaScript", "API", "Mobile UI"],
        description: "We need an experienced mobile developer to create a modern cross-platform application with API integration and a professional user experience.",
        posted: "1 day ago",
        proposals: 19,
        client: "James Anderson",
        experience: "Expert"
    },
    {
        id: 5,
        title: "Create Business Data Dashboard",
        category: "Data Analysis",
        budget: 500,
        skills: ["Python", "Excel", "Data Visualization", "Power BI"],
        description: "Create an interactive business dashboard that displays important business metrics, charts and reports in an easy-to-understand format.",
        posted: "2 days ago",
        proposals: 7,
        client: "Robert Taylor",
        experience: "Intermediate"
    },
    {
        id: 6,
        title: "SEO and Digital Marketing Campaign",
        category: "Digital Marketing",
        budget: 350,
        skills: ["SEO", "Google Ads", "Social Media", "Analytics"],
        description: "Looking for a digital marketing professional to improve our online presence, search rankings, social media engagement and website traffic.",
        posted: "2 days ago",
        proposals: 13,
        client: "Emily Davis",
        experience: "Intermediate"
    },
    {
        id: 7,
        title: "Design a Modern SaaS Dashboard",
        category: "Graphic Design",
        budget: 600,
        skills: ["Figma", "UI/UX", "Wireframing", "Prototyping"],
        description: "We need a professional UI/UX designer to create a modern SaaS dashboard with a clean layout, reusable components and responsive design.",
        posted: "3 days ago",
        proposals: 16,
        client: "William Thomas",
        experience: "Expert"
    },
    {
        id: 8,
        title: "Python Django Web Application",
        category: "Web Development",
        budget: 900,
        skills: ["Python", "Django", "MySQL", "REST API"],
        description: "Build a scalable Django web application with authentication, database integration, REST APIs and a professional frontend interface.",
        posted: "4 days ago",
        proposals: 21,
        client: "Oliver Martin",
        experience: "Expert"
    }
];

const savedJobs =
    JSON.parse(localStorage.getItem("skilloraJobs")) || [];

if (savedJobs.length > 0) {
    jobsData = [...jobsData, ...savedJobs];
}

function renderJobs(data = jobsData) {

    if (!jobsGrid) return;

    jobsGrid.innerHTML = "";

    if (data.length === 0) {

        if (noJobs) {
            noJobs.style.display = "block";
        }

        if (jobResultCount) {
            jobResultCount.textContent = "Showing 0 jobs";
        }

        return;
    }

    if (noJobs) {
        noJobs.style.display = "none";
    }

    data.forEach(job => {

        const card = document.createElement("article");

        card.className = "job-card";

        card.dataset.id = job.id;
        card.dataset.category = job.category;
        card.dataset.budget = job.budget;

        card.innerHTML = `
            <div class="job-card-top">
                <div>
                    <span class="job-category">${job.category}</span>
                    <h3>${job.title}</h3>
                </div>

                <button class="job-save-btn" data-id="${job.id}" aria-label="Save job">
                    <i class="fa-regular fa-heart"></i>
                </button>
            </div>

            <p class="job-description">
                ${job.description}
            </p>

            <div class="job-skills">
                ${job.skills.map(skill => `
                    <span>${skill}</span>
                `).join("")}
            </div>

            <div class="job-meta">
                <span>
                    <i class="fa-solid fa-dollar-sign"></i>
                    $${job.budget}
                </span>

                <span>
                    <i class="fa-regular fa-clock"></i>
                    ${job.posted}
                </span>

                <span>
                    <i class="fa-regular fa-file-lines"></i>
                    ${job.proposals} proposals
                </span>
            </div>

            <div class="job-card-footer">

                <div class="job-client">
                    <div class="client-avatar">
                        ${job.client.charAt(0)}
                    </div>

                    <div>
                        <strong>${job.client}</strong>
                        <small>${job.experience}</small>
                    </div>
                </div>

                <div class="job-actions">
                    <button class="job-view-btn" data-id="${job.id}">
                        View Details
                    </button>

                    <button class="job-apply-btn" data-id="${job.id}">
                        Apply Now
                    </button>
                </div>

            </div>
        `;

        jobsGrid.appendChild(card);
    });

    if (jobResultCount) {
        jobResultCount.textContent =
            `Showing ${data.length} job${data.length !== 1 ? "s" : ""}`;
    }

    attachJobEvents();
}

function filterJobs() {

    if (!jobsGrid) return;

    const searchTerm =
        jobSearch
            ? jobSearch.value.toLowerCase().trim()
            : "";

    const category =
        jobCategory
            ? jobCategory.value
            : "all";

    let filteredJobs = jobsData.filter(job => {

        const searchableText = `
            ${job.title}
            ${job.category}
            ${job.description}
            ${job.skills.join(" ")}
            ${job.client}
        `.toLowerCase();

        const matchesSearch =
            !searchTerm ||
            searchableText.includes(searchTerm);

        const matchesCategory =
            category === "all" ||
            job.category === category;

        return matchesSearch && matchesCategory;
    });

    const sortType =
        jobSort
            ? jobSort.value
            : "newest";

    if (sortType === "price-low") {

        filteredJobs.sort(
            (a, b) => a.budget - b.budget
        );

    } else if (sortType === "price-high") {

        filteredJobs.sort(
            (a, b) => b.budget - a.budget
        );

    } else if (sortType === "proposals") {

        filteredJobs.sort(
            (a, b) => a.proposals - b.proposals
        );
    }

    renderJobs(filteredJobs);
}

if (jobSearchBtn) {
    jobSearchBtn.addEventListener("click", filterJobs);
}

if (jobSearch) {

    jobSearch.addEventListener("input", filterJobs);

    jobSearch.addEventListener("keydown", event => {

        if (event.key === "Enter") {
            filterJobs();
        }
    });
}

if (jobCategory) {
    jobCategory.addEventListener(
        "change",
        filterJobs
    );
}

if (jobSort) {
    jobSort.addEventListener(
        "change",
        filterJobs
    );
}

if (clearJobFilters) {

    clearJobFilters.addEventListener("click", () => {

        if (jobSearch) {
            jobSearch.value = "";
        }

        if (jobCategory) {
            jobCategory.value = "all";
        }

        if (jobSort) {
            jobSort.value = "newest";
        }

        filterJobs();

        showToast("Job filters cleared.");
    });
}

function attachJobEvents() {

    document.querySelectorAll(".job-view-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                const id =
                    Number(button.dataset.id);

                localStorage.setItem(
                    "selectedJob",
                    id
                );

                window.location.href =
                    "job-details.html";
            });
        });

    document.querySelectorAll(".job-apply-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                const id =
                    Number(button.dataset.id);

                localStorage.setItem(
                    "selectedJob",
                    id
                );

                openModal("proposalModal");

                const selectedJob =
                    jobsData.find(job => job.id === id);

                const proposalJobTitle =
                    document.getElementById(
                        "proposalJobTitle"
                    );

                if (
                    proposalJobTitle &&
                    selectedJob
                ) {
                    proposalJobTitle.textContent =
                        selectedJob.title;
                }
            });
        });

    document.querySelectorAll(".job-save-btn")
        .forEach(button => {

            button.addEventListener("click", event => {

                event.stopPropagation();

                button.classList.toggle("saved");

                const icon =
                    button.querySelector("i");

                if (!icon) return;

                if (button.classList.contains("saved")) {

                    icon.classList.remove(
                        "fa-regular"
                    );

                    icon.classList.add(
                        "fa-solid"
                    );

                    showToast(
                        "Job saved successfully."
                    );

                } else {

                    icon.classList.remove(
                        "fa-solid"
                    );

                    icon.classList.add(
                        "fa-regular"
                    );

                    showToast(
                        "Job removed from saved jobs."
                    );
                }
            });
        });
}

if (jobsGrid) {
    renderJobs();
}

const selectedJobId =
    Number(
        localStorage.getItem("selectedJob")
    );

const selectedJob =
    jobsData.find(
        job => job.id === selectedJobId
    );

if (selectedJob) {

    const jobDetailsTitle =
        document.getElementById("jobDetailsTitle");

    const jobDetailsCategory =
        document.getElementById("jobDetailsCategory");

    const jobDetailsDescription =
        document.getElementById("jobDetailsDescription");

    const jobDetailsBudget =
        document.getElementById("jobDetailsBudget");

    const jobDetailsPosted =
        document.getElementById("jobDetailsPosted");

    const jobDetailsProposals =
        document.getElementById("jobDetailsProposals");

    const jobDetailsClient =
        document.getElementById("jobDetailsClient");

    const jobDetailsExperience =
        document.getElementById("jobDetailsExperience");

    const jobDetailsSkills =
        document.getElementById("jobDetailsSkills");

    if (jobDetailsTitle) {
        jobDetailsTitle.textContent =
            selectedJob.title;
    }

    if (jobDetailsCategory) {
        jobDetailsCategory.textContent =
            selectedJob.category;
    }

    if (jobDetailsDescription) {
        jobDetailsDescription.textContent =
            selectedJob.description;
    }

    if (jobDetailsBudget) {
        jobDetailsBudget.textContent =
            `$${selectedJob.budget}`;
    }

    if (jobDetailsPosted) {
        jobDetailsPosted.textContent =
            selectedJob.posted;
    }

    if (jobDetailsProposals) {
        jobDetailsProposals.textContent =
            selectedJob.proposals;
    }

    if (jobDetailsClient) {
        jobDetailsClient.textContent =
            selectedJob.client;
    }

    if (jobDetailsExperience) {
        jobDetailsExperience.textContent =
            selectedJob.experience;
    }

    if (jobDetailsSkills) {

        jobDetailsSkills.innerHTML = "";

        selectedJob.skills.forEach(skill => {

            const span =
                document.createElement("span");

            span.textContent = skill;

            jobDetailsSkills.appendChild(span);
        });
    }
}

const detailsApplyBtn =
    document.getElementById("detailsApplyBtn");

if (detailsApplyBtn) {

    detailsApplyBtn.addEventListener(
        "click",
        () => {

            if (!selectedJob) {
                showToast("Job information not found.");
                return;
            }

            openModal("proposalModal");

            const proposalJobTitle =
                document.getElementById(
                    "proposalJobTitle"
                );

            if (proposalJobTitle) {
                proposalJobTitle.textContent =
                    selectedJob.title;
            }
        }
    );
}

const postJobForm =
    document.getElementById("postJobForm");

if (postJobForm) {

    postJobForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const title =
                document.getElementById("jobTitle")?.value.trim();

            const category =
                document.getElementById("jobCategoryInput")?.value;

            const budget =
                Number(
                    document.getElementById("jobBudget")?.value
                );

            const skillsInput =
                document.getElementById("jobSkills")?.value.trim();

            const description =
                document.getElementById("jobDescription")?.value.trim();

            const experience =
                document.getElementById("jobExperience")?.value;

            if (!title) {
                showToast("Please enter a job title.");
                return;
            }

            if (!category) {
                showToast("Please select a category.");
                return;
            }

            if (!budget || budget <= 0) {
                showToast("Please enter a valid budget.");
                return;
            }

            if (!skillsInput) {
                showToast("Please enter required skills.");
                return;
            }

            if (!description || description.length < 30) {
                showToast(
                    "Project description must contain at least 30 characters."
                );
                return;
            }

            if (!experience) {
                showToast(
                    "Please select the required experience level."
                );
                return;
            }

            const skills =
                skillsInput
                    .split(",")
                    .map(skill => skill.trim())
                    .filter(skill => skill.length > 0);

            const newJob = {

                id: Date.now(),

                title,

                category,

                budget,

                skills,

                description,

                posted: "Just now",

                proposals: 0,

                client: "You",

                experience
            };

            jobsData.unshift(newJob);

            const customJobs =
                jobsData.filter(
                    job => job.client === "You"
                );

            localStorage.setItem(
                "skilloraJobs",
                JSON.stringify(customJobs)
            );

            postJobForm.reset();

            showToast(
                "Your job has been posted successfully!"
            );

            setTimeout(() => {

                window.location.href =
                    "jobs.html";

            }, 1000);
        }
    );
}

const proposalForm =
    document.getElementById("proposalForm");

if (proposalForm) {

    proposalForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const coverLetter =
                document.getElementById("coverLetter")
                    ?.value.trim();

            const proposedPrice =
                Number(
                    document.getElementById("proposedPrice")
                        ?.value
                );

            const deliveryTime =
                document.getElementById("deliveryTime")
                    ?.value.trim();

            const relevantExperience =
                document.getElementById("relevantExperience")
                    ?.value.trim();

            if (!coverLetter) {
                showToast(
                    "Please write a cover letter."
                );
                return;
            }

            if (coverLetter.length < 50) {
                showToast(
                    "Cover letter must contain at least 50 characters."
                );
                return;
            }

            if (!proposedPrice || proposedPrice <= 0) {
                showToast(
                    "Please enter a valid proposed price."
                );
                return;
            }

            if (!deliveryTime) {
                showToast(
                    "Please enter your delivery time."
                );
                return;
            }

            if (!relevantExperience) {
                showToast(
                    "Please describe your relevant experience."
                );
                return;
            }

            const proposals =
                JSON.parse(
                    localStorage.getItem(
                        "skilloraProposals"
                    )
                ) || [];

            const proposal = {

                id: Date.now(),

                jobId: selectedJobId,

                jobTitle:
                    selectedJob
                        ? selectedJob.title
                        : (
                            document.getElementById(
                                "proposalJobTitle"
                            )?.textContent ||
                            "Freelance Project"
                        ),

                coverLetter,

                proposedPrice,

                deliveryTime,

                relevantExperience,

                status: "Pending",

                submittedAt: new Date()
                    .toLocaleDateString(
                        "en-US",
                        {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        }
                    )
            };

            proposals.unshift(proposal);

            localStorage.setItem(
                "skilloraProposals",
                JSON.stringify(proposals)
            );

            proposalForm.reset();

            closeModal("proposalModal");

            showToast(
                "Proposal submitted successfully!"
            );

            renderProposals();
        }
    );
}


function renderProposals() {
    const proposalsGrid = document.getElementById("proposalsGrid");
    const noProposals = document.getElementById("noProposals");

    if (!proposalsGrid) return;

    const proposals =
        JSON.parse(localStorage.getItem("skilloraProposals")) || [];

    proposalsGrid.innerHTML = "";

    if (proposals.length === 0) {
        if (noProposals) {
            noProposals.style.display = "block";
        }
        return;
    }

    if (noProposals) {
        noProposals.style.display = "none";
    }

    proposals.forEach(proposal => {
        const card = document.createElement("div");
        card.className = "proposal-card";

        const status = proposal.status || "Pending";
        const isPending = status.toLowerCase() === "pending";
        const isAccepted = status.toLowerCase() === "accepted";

        card.innerHTML = `
            <div class="proposal-card-header">
                <div>
                    <span class="proposal-label">Proposal</span>
                    <h3>${proposal.jobTitle || "Untitled Project"}</h3>
                </div>

                <span class="proposal-status ${status.toLowerCase()}">
                    ${status}
                </span>
            </div>

            <div class="proposal-info">
                <div>
                    <span>Proposed Price</span>
                    <strong>$${proposal.proposedPrice}</strong>
                </div>

                <div>
                    <span>Delivery Time</span>
                    <strong>${proposal.deliveryTime}</strong>
                </div>

                <div>
                    <span>Submitted</span>
                    <strong>${proposal.submittedAt || "Recently"}</strong>
                </div>
            </div>

            <div class="proposal-cover">
                <strong>Cover Letter</strong>
                <p>${proposal.coverLetter || "No cover letter provided."}</p>
            </div>

            ${
                isPending
                    ? `<button type="button"
                               class="accept-proposal-btn"
                               data-proposal-id="${proposal.id}">
                           Accept Proposal
                       </button>`
                    : isAccepted
                        ? `<p class="proposal-accepted-message">
                               This proposal has been accepted.
                           </p>`
                        : ""
            }
        `;

        proposalsGrid.appendChild(card);
    });
}

document.addEventListener("click", function (event) {
    const button = event.target.closest(".accept-proposal-btn");

    if (!button) return;

    const proposalId = Number(button.dataset.proposalId);

    const proposals =
        JSON.parse(localStorage.getItem("skilloraProposals")) || [];

    const proposal = proposals.find(
        item => Number(item.id) === proposalId
    );

    if (!proposal) {
        alert("Proposal not found.");
        return;
    }

    if (proposal.status !== "Pending") {
        alert("This proposal has already been processed.");
        return;
    }

    const confirmed = confirm(
        `Accept the proposal for "${proposal.jobTitle}"?`
    );

    if (!confirmed) return;

    const projects =
        JSON.parse(localStorage.getItem("skilloraWeek5Projects")) || [];

    const alreadyCreated = projects.some(
        project => Number(project.proposalId) === proposalId
    );

    if (!alreadyCreated) {
        projects.push({
            id: Date.now(),
            proposalId: proposal.id,
            jobId: proposal.jobId,
            title: proposal.jobTitle || "Untitled Project",
            client: "Demo Client",
            freelancer: "Demo Freelancer",
            budget: Number(proposal.proposedPrice) || 0,
            deadline: proposal.deliveryTime || "Not specified",
            status: "In Progress",
            progress: 0,
            deliveryNotes: "",
            milestones: [
                {
                    title: "Project Started",
                    completed: false
                },
                {
                    title: "Work in Progress",
                    completed: false
                },
                {
                    title: "Final Delivery",
                    completed: false
                }
            ]
        });

        localStorage.setItem(
            "skilloraWeek5Projects",
            JSON.stringify(projects)
        );
    }

    proposal.status = "Accepted";

    localStorage.setItem(
        "skilloraProposals",
        JSON.stringify(proposals)
    );

    renderProposals();

    alert(
        "Proposal accepted! The project has been added to My Orders."
    );
});


const proposalStatusFilter =
    document.getElementById(
        "proposalStatusFilter"
    );

if (proposalStatusFilter) {

    proposalStatusFilter.addEventListener(
        "change",
        () => {

            const status =
                proposalStatusFilter.value;

            const cards =
                document.querySelectorAll(
                    ".proposal-card"
                );

            cards.forEach(card => {

                const badge =
                    card.querySelector(
                        ".proposal-status"
                    );

                if (!badge) return;

                if (
                    status === "all" ||
                    badge.textContent
                        .trim()
                        .toLowerCase() ===
                    status.toLowerCase()
                ) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            });
        }
    );
}

renderProposals();

document.querySelectorAll(
    "[data-job-category]"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const category =
                button.dataset.jobCategory;

            if (jobCategory) {
                jobCategory.value =
                    category;
            }

            filterJobs();
        }
    );
});

document.querySelectorAll(
    ".open-proposal"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const jobId =
                Number(button.dataset.jobId);

            if (jobId) {
                localStorage.setItem(
                    "selectedJob",
                    jobId
                );
            }

            openModal("proposalModal");
        }
    );
});

document.querySelectorAll(
    ".close-proposal"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {
            closeModal("proposalModal");
        }
    );
});

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {
            closeModal("proposalModal");
        }
    }
);

console.log(
    "Skillora Week 4 Job Marketplace loaded successfully."
);