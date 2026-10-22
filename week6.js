
document.addEventListener("DOMContentLoaded", function () {
    const conversationList = document.getElementById("conversationList");

    // Do nothing on pages that do not contain the chat interface.
    if (!conversationList) return;

    const STORAGE_KEY = "skilloraWeek6Chats";

    const sampleChats = [
        {
            id: "chat-1",
            name: "Alex Morgan",
            project: "Business Website Development",
            unread: 1,
            messages: [
                {
                    text: "Hello! I wanted to discuss the website project.",
                    sender: "other",
                    time: new Date().toISOString()
                },
                {
                    text: "Sure! We can discuss the requirements here.",
                    sender: "me",
                    time: new Date().toISOString()
                }
            ]
        },
        {
            id: "chat-2",
            name: "Sarah Ahmed",
            project: "E-Commerce UI Design",
            unread: 2,
            messages: [
                {
                    text: "Could you share an update on the design?",
                    sender: "other",
                    time: new Date().toISOString()
                }
            ]
        },
        {
            id: "chat-3",
            name: "Daniel Smith",
            project: "Social Media Graphics",
            unread: 0,
            messages: [
                {
                    text: "Thank you for completing the project!",
                    sender: "other",
                    time: new Date().toISOString()
                }
            ]
        }
    ];

    let chats;

    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        chats = saved ? JSON.parse(saved) : sampleChats;

        if (!Array.isArray(chats)) {
            chats = sampleChats;
        }
    } catch (error) {
        chats = sampleChats;
    }

    let activeChatId = null;

    const searchInput = document.getElementById("conversationSearch");
    const chatWelcome = document.getElementById("chatWelcome");
    const chatWindow = document.getElementById("chatWindow");
    const chatName = document.getElementById("chatName");
    const chatProject = document.getElementById("chatProject");
    const chatAvatar = document.getElementById("chatAvatar");
    const messageList = document.getElementById("messageList");
    const messageForm = document.getElementById("messageForm");
    const messageInput = document.getElementById("messageInput");
    const conversationCount = document.getElementById("conversationCount");
    const noConversations = document.getElementById("noConversations");

    function saveChats() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    }

    function getLastMessage(chat) {
        const messages = chat.messages || [];
        return messages.length ? messages[messages.length - 1] : null;
    }

    function formatTime(dateString) {
        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function renderConversations() {
        const query = (searchInput.value || "").trim().toLowerCase();

        const filtered = chats.filter(chat =>
            chat.name.toLowerCase().includes(query) ||
            chat.project.toLowerCase().includes(query)
        );

        conversationList.innerHTML = "";
        conversationCount.textContent = chats.length;
        noConversations.hidden = filtered.length !== 0;

        filtered.forEach(chat => {
            const lastMessage = getLastMessage(chat);
            const button = document.createElement("button");

            button.type = "button";
            button.className =
                "w6-conversation" +
                (chat.id === activeChatId ? " active" : "");

            const avatar = document.createElement("span");
            avatar.className = "w6-avatar";
            avatar.textContent = chat.name.charAt(0).toUpperCase();

            const info = document.createElement("span");
            info.className = "w6-conversation-info";

            const top = document.createElement("span");
            top.className = "w6-conversation-top";

            const name = document.createElement("strong");
            name.textContent = chat.name;

            const time = document.createElement("span");
            time.className = "w6-message-time";
            time.textContent = lastMessage ? formatTime(lastMessage.time) : "";

            top.append(name, time);

            const bottom = document.createElement("span");
            bottom.className = "w6-conversation-bottom";

            const lastText = document.createElement("span");
            lastText.className = "w6-last-message";
            lastText.textContent = lastMessage ? lastMessage.text : "No messages yet";

            bottom.appendChild(lastText);

            if (chat.unread > 0 && chat.id !== activeChatId) {
                const unread = document.createElement("span");
                unread.className = "w6-unread";
                unread.textContent = chat.unread;
                unread.setAttribute("aria-label", chat.unread + " unread messages");
                bottom.appendChild(unread);
            }

            info.append(top, bottom);
            button.append(avatar, info);

            button.addEventListener("click", function () {
                openConversation(chat.id);
            });

            conversationList.appendChild(button);
        });
    }

    function renderMessages(chat) {
        messageList.innerHTML = "";

        (chat.messages || []).forEach(message => {
            const item = document.createElement("article");
            item.className =
                "w6-message" + (message.sender === "me" ? " mine" : "");

            const bubble = document.createElement("div");
            bubble.className = "w6-message-bubble";
            bubble.textContent = message.text;

            const meta = document.createElement("span");
            meta.className = "w6-message-meta";
            meta.textContent =
                (message.sender === "me" ? "You" : chat.name) +
                " · " + formatTime(message.time);

            item.append(bubble, meta);
            messageList.appendChild(item);
        });

        messageList.scrollTop = messageList.scrollHeight;
    }

    function openConversation(chatId) {
        const chat = chats.find(item => item.id === chatId);
        if (!chat) return;

        activeChatId = chatId;
        chat.unread = 0;

        chatName.textContent = chat.name;
        chatProject.textContent = chat.project;
        chatAvatar.textContent = chat.name.charAt(0).toUpperCase();

        chatWelcome.hidden = true;
        chatWindow.hidden = false;

        renderMessages(chat);
        renderConversations();
        saveChats();
    }

    messageForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const chat = chats.find(item => item.id === activeChatId);
        const text = messageInput.value.trim();

        if (!chat || !text) return;

        chat.messages.push({
            text: text,
            sender: "me",
            time: new Date().toISOString()
        });

        messageInput.value = "";
        renderMessages(chat);
        renderConversations();
        saveChats();
        messageInput.focus();
    });

    searchInput.addEventListener("input", renderConversations);

    const currentYear = document.getElementById("currentYear");
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    saveChats();
    renderConversations();

    // Open the first conversation when the page loads.
    if (chats.length > 0) {
        openConversation(chats[0].id);
    }
});

/* WEEK 6 - NOTIFICATION CENTER */

document.addEventListener("DOMContentLoaded", function () {
    const notificationList = document.getElementById("notificationList");

    // Run this section only on the notifications page.
    if (!notificationList) return;

    const STORAGE_KEY = "skilloraWeek6Notifications";

    const sampleNotifications = [
        {
            id: "notification-1",
            type: "message",
            title: "New message received",
            message: "Alex Morgan sent you a message about Business Website Development.",
            date: new Date().toISOString(),
            read: false,
            link: "messages.html"
        },
        {
            id: "notification-2",
            type: "proposal",
            title: "Proposal accepted",
            message: "A proposal has been accepted. Check your project dashboard.",
            date: new Date().toISOString(),
            read: false,
            link: "orders.html"
        },
        {
            id: "notification-3",
            type: "project",
            title: "Project started",
            message: "Your project workflow has started. View your projects for details.",
            date: new Date().toISOString(),
            read: true,
            link: "orders.html"
        },
        {
            id: "notification-4",
            type: "completed",
            title: "Project completed",
            message: "A project has been marked as completed. You can now leave a review.",
            date: new Date().toISOString(),
            read: false,
            link: "reviews.html"
        },
        {
            id: "notification-5",
            type: "review",
            title: "New review received",
            message: "A new review activity is available on the reviews page.",
            date: new Date().toISOString(),
            read: true,
            link: "reviews.html"
        }
    ];

    let notifications = [];

    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        notifications = saved ? JSON.parse(saved) : sampleNotifications;

        if (!Array.isArray(notifications)) {
            notifications = sampleNotifications;
        }
    } catch (error) {
        notifications = sampleNotifications;
    }

    let currentFilter = "all";

    const summary = document.getElementById("notificationSummary");
    const noNotifications = document.getElementById("noNotifications");
    const markAllReadButton = document.getElementById("markAllRead");
    const filterButtons = document.querySelectorAll(".w6-filter-button");

    function saveNotifications() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }

    function getIcon(type) {
        const icons = {
            message: "💬",
            proposal: "📄",
            project: "📁",
            completed: "✅",
            review: "⭐"
        };

        return icons[type] || "🔔";
    }

    function renderNotifications() {
        const unreadCount = notifications.filter(item => !item.read).length;

        summary.textContent =
            notifications.length + " notifications · " +
            unreadCount + " unread";

        notificationList.innerHTML = "";

        const visible = notifications.filter(item =>
            currentFilter === "all" || !item.read
        );

        noNotifications.hidden = visible.length > 0;

        visible.forEach(item => {
            const card = document.createElement("article");
            card.className = "w6-notification" + (item.read ? "" : " unread");

            const icon = document.createElement("div");
            icon.className = "w6-notification-icon";
            icon.textContent = getIcon(item.type);

            const content = document.createElement("div");
            content.className = "w6-notification-content";

            const title = document.createElement("h3");
            title.textContent = item.title;

            const message = document.createElement("p");
            message.textContent = item.message;

            const date = document.createElement("span");
            date.className = "w6-notification-date";

            const parsedDate = new Date(item.date);
            date.textContent = Number.isNaN(parsedDate.getTime())
                ? ""
                : parsedDate.toLocaleString();

            content.append(title, message, date);

            const actions = document.createElement("div");
            actions.className = "w6-notification-actions";

            const openLink = document.createElement("a");
            openLink.href = item.link || "orders.html";
            openLink.textContent = "Open";

            openLink.addEventListener("click", function () {
                item.read = true;
                saveNotifications();
            });

            actions.appendChild(openLink);

            if (!item.read) {
                const markRead = document.createElement("button");
                markRead.type = "button";
                markRead.textContent = "Mark as read";

                markRead.addEventListener("click", function () {
                    item.read = true;
                    saveNotifications();
                    renderNotifications();
                });

                actions.appendChild(markRead);
            }

            content.appendChild(actions);

            if (!item.read) {
                const dot = document.createElement("span");
                dot.className = "w6-notification-dot";
                dot.setAttribute("aria-label", "Unread");
                card.append(icon, content, dot);
            } else {
                card.append(icon, content);
            }

            notificationList.appendChild(card);
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            currentFilter = button.dataset.filter;

            filterButtons.forEach(item => {
                item.classList.toggle("active", item === button);
            });

            renderNotifications();
        });
    });

    markAllReadButton.addEventListener("click", function () {
        notifications.forEach(item => {
            item.read = true;
        });

        saveNotifications();
        renderNotifications();
    });

    const currentYear = document.getElementById("currentYear");
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    saveNotifications();
    renderNotifications();
});

/* WEEK 6 - REVIEWS AND RATINGS */

document.addEventListener("DOMContentLoaded", function () {
    const reviewForm = document.getElementById("reviewForm");

    // Run this section only on reviews.html.
    if (!reviewForm) return;

    const STORAGE_KEY = "skilloraWeek6Reviews";

    const sampleReviews = [
        {
            id: "review-demo-1",
            name: "Sarah Ahmed",
            project: "Website Development",
            rating: 5,
            comment: "Excellent communication and a professional experience throughout the project.",
            date: "2026-10-15"
        },
        {
            id: "review-demo-2",
            name: "Ali Raza",
            project: "UI Design",
            rating: 4,
            comment: "Good quality work and helpful feedback during the project.",
            date: "2026-10-18"
        }
    ];

    let reviews = [];

    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        reviews = saved ? JSON.parse(saved) : sampleReviews;

        if (!Array.isArray(reviews)) {
            reviews = sampleReviews;
        }
    } catch (error) {
        reviews = sampleReviews;
    }

    let selectedRating = 0;

    const starButtons = document.querySelectorAll("#starPicker button");
    const ratingText = document.getElementById("ratingText");
    const reviewsList = document.getElementById("reviewsList");
    const noReviews = document.getElementById("noReviews");
    const averageRating = document.getElementById("averageRating");
    const reviewCount = document.getElementById("reviewCount");
    const feedback = document.getElementById("reviewFeedback");

    const ratingLabels = {
        1: "1 star — Poor",
        2: "2 stars — Fair",
        3: "3 stars — Good",
        4: "4 stars — Very good",
        5: "5 stars — Excellent"
    };

    function saveReviews() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    }

    function renderStars(rating) {
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    }

    function renderReviews() {
        reviewsList.innerHTML = "";

        const total = reviews.reduce(
            (sum, review) => sum + Number(review.rating || 0),
            0
        );

        const average = reviews.length ? total / reviews.length : 0;

        averageRating.textContent = average.toFixed(1);
        reviewCount.textContent =
            reviews.length + (reviews.length === 1 ? " review" : " reviews");

        noReviews.hidden = reviews.length > 0;

        reviews.slice().reverse().forEach(review => {
            const card = document.createElement("article");
            card.className = "w6-review-card";

            const header = document.createElement("div");
            header.className = "w6-review-card-header";

            const person = document.createElement("div");
            person.className = "w6-review-person";

            const avatar = document.createElement("div");
            avatar.className = "w6-review-avatar";
            avatar.textContent = (review.name || "?").charAt(0).toUpperCase();

            const details = document.createElement("div");

            const name = document.createElement("h3");
            name.textContent = review.name || "Anonymous";

            const project = document.createElement("span");
            project.className = "w6-review-project";
            project.textContent = review.project || "General review";

            const date = document.createElement("div");
            date.className = "w6-review-date";

            const parsedDate = new Date(review.date);
            date.textContent = Number.isNaN(parsedDate.getTime())
                ? ""
                : parsedDate.toLocaleDateString();

            details.append(name, project, date);
            person.append(avatar, details);

            const stars = document.createElement("div");
            stars.className = "w6-review-stars";
            stars.textContent = renderStars(Number(review.rating) || 0);
            stars.setAttribute("aria-label", (review.rating || 0) + " out of 5 stars");

            header.append(person, stars);

            const comment = document.createElement("p");
            comment.className = "w6-review-comment";
            comment.textContent = review.comment || "";

            card.append(header, comment);
            reviewsList.appendChild(card);
        });
    }

    function updateStarPicker() {
        starButtons.forEach(button => {
            const rating = Number(button.dataset.rating);
            button.classList.toggle("selected", rating <= selectedRating);
            button.setAttribute(
                "aria-pressed",
                rating === selectedRating ? "true" : "false"
            );
        });

        ratingText.textContent = selectedRating
            ? ratingLabels[selectedRating]
            : "Select your rating";
    }

    starButtons.forEach(button => {
        button.addEventListener("click", function () {
            selectedRating = Number(button.dataset.rating);
            updateStarPicker();
        });
    });

    reviewForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("reviewerName").value.trim();
        const project = document.getElementById("reviewProject").value.trim();
        const comment = document.getElementById("reviewComment").value.trim();

        if (!name || !project || !comment) {
            feedback.textContent = "Please complete all fields.";
            return;
        }

        if (selectedRating < 1 || selectedRating > 5) {
            feedback.textContent = "Please select a rating from 1 to 5 stars.";
            return;
        }

        const review = {
            id: "review-" + Date.now(),
            name: name,
            project: project,
            rating: selectedRating,
            comment: comment,
            date: new Date().toISOString()
        };

        reviews.push(review);
        saveReviews();
        renderReviews();

        // Add a notification about the new review.
        const notificationKey = "skilloraWeek6Notifications";

        try {
            const notifications =
                JSON.parse(localStorage.getItem(notificationKey)) || [];

            notifications.push({
                id: "notification-review-" + Date.now(),
                type: "review",
                title: "New review submitted",
                message: name + " submitted a review for " + project + ".",
                date: new Date().toISOString(),
                read: false,
                link: "reviews.html"
            });

            localStorage.setItem(
                notificationKey,
                JSON.stringify(notifications)
            );
        } catch (error) {
            console.error("Could not save the review notification.", error);
        }

        reviewForm.reset();
        selectedRating = 0;
        updateStarPicker();

        feedback.textContent = "Your review was submitted successfully!";
    });

    const currentYear = document.getElementById("currentYear");
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    saveReviews();
    updateStarPicker();
    renderReviews();
});
