
/* ==========================================
   SKILLORA WEEK 5 - ORDERS DASHBOARD
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
    const ordersGrid = document.getElementById("ordersGrid");

    // This script is shared by multiple pages.
    // Run the Orders Dashboard code only on orders.html.
    if (!ordersGrid) {
        return;
    }

    const searchInput = document.getElementById("orderSearch");
    const statusFilter = document.getElementById("orderStatus");
    const roleFilter = document.getElementById("orderRole");
    const emptyState = document.getElementById("ordersEmpty");

    const statAll = document.getElementById("statAll");
    const statProgress = document.getElementById("statProgress");
    const statSubmitted = document.getElementById("statSubmitted");
    const statValue = document.getElementById("statValue");

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /*
     * Storage key:
     * Future Week 5 features will save projects here.
     *
     * For now, sample projects are shown if this key
     * does not exist yet. This lets us test the page
     * before connecting proposal acceptance.
     */

    const PROJECTS_KEY = "skilloraWeek5Projects";

    const sampleProjects = [
        {
            id: 5001,
            title: "Business Website Development",
            description:
                "Build a responsive business website with a homepage, services page, contact form, and mobile-friendly layout.",
            client: "Demo Client",
            freelancer: "Demo Freelancer",
            budget: 45000,
            deadline: "2026-11-15",
            status: "In Progress",
            progress: 60,
            deliveryNotes: "",
            deliveryDate: "",
            milestones: [
                {
                    title: "Website Structure",
                    description: "Create the main pages and navigation.",
                    completed: true
                },
                {
                    title: "Responsive Design",
                    description: "Make the website work on mobile and desktop.",
                    completed: true
                },
                {
                    title: "Final Testing",
                    description: "Test forms, links, and page layouts.",
                    completed: false
                }
            ]
        },
        {
            id: 5002,
            title: "E-Commerce UI Design",
            description:
                "Design a clean online store interface with product cards, category navigation, and a shopping cart layout.",
            client: "Demo Client",
            freelancer: "Demo Freelancer",
            budget: 30000,
            deadline: "2026-11-20",
            status: "Submitted",
            progress: 100,
            deliveryNotes: "The initial design has been submitted for client review.",
            deliveryDate: "2026-10-12",
            milestones: [
                {
                    title: "Wireframes",
                    description: "Prepare the main screen layouts.",
                    completed: true
                },
                {
                    title: "Visual Design",
                    description: "Apply colors, typography, and components.",
                    completed: true
                },
                {
                    title: "Design Delivery",
                    description: "Submit the finished design for review.",
                    completed: true
                }
            ]
        },
        {
            id: 5003,
            title: "Social Media Graphics",
            description:
                "Create a coordinated set of social media graphics for a small business campaign.",
            client: "Demo Client",
            freelancer: "Demo Freelancer",
            budget: 12000,
            deadline: "2026-11-25",
            status: "Completed",
            progress: 100,
            deliveryNotes: "Final graphics delivered and approved.",
            deliveryDate: "2026-10-10",
            milestones: [
                {
                    title: "Campaign Planning",
                    description: "Confirm the content and graphic requirements.",
                    completed: true
                },
                {
                    title: "Graphic Creation",
                    description: "Create the agreed campaign graphics.",
                    completed: true
                },
                {
                    title: "Final Delivery",
                    description: "Deliver the approved files.",
                    completed: true
                }
            ]
        }
    ];

    function readProjects() {
        try {
            const saved = localStorage.getItem(PROJECTS_KEY);

            if (saved === null) {
                // Initialize demo data once.
                localStorage.setItem(
                    PROJECTS_KEY,
                    JSON.stringify(sampleProjects)
                );

                return sampleProjects;
            }

            const parsed = JSON.parse(saved);

            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error("Unable to read project data:", error);
            return [];
        }
    }

    function saveProjects(projects) {
        try {
            localStorage.setItem(
                PROJECTS_KEY,
                JSON.stringify(projects)
            );

            return true;
        } catch (error) {
            console.error("Unable to save project data:", error);
            return false;
        }
    }

    function formatMoney(amount) {
        const value = Number(amount) || 0;

        return "Rs. " + value.toLocaleString("en-PK");
    }

    function formatDate(dateString) {
        if (!dateString) {
            return "Not set";
        }

        const date = new Date(dateString + "T00:00:00");

        if (Number.isNaN(date.getTime())) {
            return "Not set";
        }

        return date.toLocaleDateString("en-PK", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (char) {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return entities[char];
        });
    }

    function getStatusClass(status) {
        const normalized = String(status || "").toLowerCase();

        if (normalized === "in progress") {
            return "in-progress";
        }

        if (normalized === "submitted") {
            return "submitted";
        }

        if (normalized === "completed") {
            return "completed";
        }

        if (normalized === "cancelled") {
            return "cancelled";
        }

        if (normalized === "revision requested") {
            return "revision-requested";
        }

        return "";
    }

    function updateStatistics(projects) {
        const allProjects = projects.length;

        const inProgress = projects.filter(function (project) {
            return project.status === "In Progress";
        }).length;

        const submitted = projects.filter(function (project) {
            return project.status === "Submitted";
        }).length;

        const totalValue = projects.reduce(function (total, project) {
            return total + (Number(project.budget) || 0);
        }, 0);

        statAll.textContent = allProjects;
        statProgress.textContent = inProgress;
        statSubmitted.textContent = submitted;
        statValue.textContent = formatMoney(totalValue);
    }

    function createProjectCard(project) {
        const progress = Math.min(
            100,
            Math.max(0, Number(project.progress) || 0)
        );

        const title = escapeHTML(project.title || "Untitled Project");
        const description = escapeHTML(
            project.description || "No project description provided."
        );

        const status = escapeHTML(project.status || "In Progress");
        const statusClass = getStatusClass(project.status);

        const budget = formatMoney(project.budget);
        const deadline = formatDate(project.deadline);

        const client = escapeHTML(project.client || "Not specified");
        const freelancer = escapeHTML(
            project.freelancer || "Not specified"
        );

        const projectId = encodeURIComponent(String(project.id));

        return `
            <article class="w5-project-card">

                <div class="w5-project-top">
                    <div>
                        <h3>${title}</h3>
                        <p>
                            Project #${escapeHTML(project.id)}
                        </p>
                    </div>

                    <span class="w5-status ${statusClass}">
                        ${status}
                    </span>
                </div>

                <p class="w5-project-description">
                    ${description}
                </p>

                <div class="w5-project-meta">
                    <div>
                        <span class="w5-meta-label">Project Budget</span>
                        <span class="w5-meta-value">${budget}</span>
                    </div>

                    <div>
                        <span class="w5-meta-label">Deadline</span>
                        <span class="w5-meta-value">${deadline}</span>
                    </div>

                    <div>
                        <span class="w5-meta-label">Client</span>
                        <span class="w5-meta-value">${client}</span>
                    </div>

                    <div>
                        <span class="w5-meta-label">Freelancer</span>
                        <span class="w5-meta-value">${freelancer}</span>
                    </div>
                </div>

                <div class="w5-progress-info">
                    <span>Project progress</span>
                    <strong>${progress}%</strong>
                </div>

                <div
                    class="w5-progress"
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow="${progress}"
                    aria-label="Project progress"
                >
                    <div
                        class="w5-progress-bar"
                        style="width: ${progress}%"
                    ></div>
                </div>

                <div class="w5-project-footer">
                    <span class="w5-meta-label">
                        ${progress === 100 ? "Work submitted or finished" : "Work in progress"}
                    </span>

                    <a
                        class="w5-button w5-button-primary"
                        href="project-details.html?id=${projectId}"
                    >
                        View Project
                    </a>
                </div>

            </article>
        `;
    }

    function renderOrders() {
        const projects = readProjects();

        updateStatistics(projects);

        const searchTerm = searchInput.value
            .trim()
            .toLowerCase();

        const selectedStatus = statusFilter.value;
        const selectedRole = roleFilter.value;

        const filteredProjects = projects.filter(function (project) {
            const title = String(project.title || "").toLowerCase();
            const description = String(
                project.description || ""
            ).toLowerCase();

            const matchesSearch =
                title.includes(searchTerm) ||
                description.includes(searchTerm);

            const matchesStatus =
                selectedStatus === "all" ||
                project.status === selectedStatus;

            /*
             * Demo role filtering:
             * These are sample role assignments, not authenticated
             * user accounts. We will connect real role selection later.
             */
            const matchesRole =
                selectedRole === "all" ||
                (
                    selectedRole === "client" &&
                    project.client
                ) ||
                (
                    selectedRole === "freelancer" &&
                    project.freelancer
                );

            return matchesSearch && matchesStatus && matchesRole;
        });

        ordersGrid.innerHTML = filteredProjects
            .map(createProjectCard)
            .join("");

        emptyState.hidden = filteredProjects.length !== 0;
        ordersGrid.hidden = filteredProjects.length === 0;
    }

    // Search projects while the user types.
    searchInput.addEventListener("input", renderOrders);

    // Update projects when a filter changes.
    statusFilter.addEventListener("change", renderOrders);
    roleFilter.addEventListener("change", renderOrders);

    // Allow other Week 5 features to refresh this page's data.
    window.renderSkilloraOrders = renderOrders;

    // Initial render.
    renderOrders();

    console.log("Skillora Week 5 Orders Dashboard loaded.");
});
