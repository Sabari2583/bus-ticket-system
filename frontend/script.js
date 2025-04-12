document.addEventListener("DOMContentLoaded", function () {
    // User Registration
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            let fullName = document.getElementById("full-name").value.trim();
            let email = document.getElementById("email").value.trim();
            let password = document.getElementById("password").value;

            if (!fullName || !email || !password) {
                alert("Please fill all fields.");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fullName, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Registration successful! You can now sign in.");
                    window.location.href = "index.html";
                } else {
                    alert(data.error);
                }
            } catch (error) {
                alert("Error connecting to the server.");
                console.error(error);
            }
        });
    }

    // User Login
    const signInForm = document.getElementById("signin-form");
    if (signInForm) {
        signInForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            let email = document.getElementById("email").value.trim();
            let password = document.getElementById("password").value;

            try {
                const response = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Login successful!");
                    localStorage.setItem("loggedInUser", JSON.stringify(data.user));
                    window.location.href = "booking.html"; // Redirect to booking page
                } else {
                    alert(data.error);
                }
            } catch (error) {
                alert("Error connecting to server.");
                console.error(error);
            }
        });
    }

    // Protect Booking Page (Ensure User is Logged In)
    if (window.location.pathname.includes("booking.html")) {
        if (!localStorage.getItem("loggedInUser")) {
            alert("You must log in first!");
            window.location.href = "index.html"; // Redirect to login page
        }
    }

    // Bus Booking Logic
    const bookingForm = document.getElementById("booking-form");
    const busList = document.getElementById("bus-list");
    const logoutButton = document.getElementById("logout");

    // Sample bus data
    const buses = [
        { id: 1, from: "Madurai", to: "Chennai", time: "10:00 AM", price: "Rs.400" },
        { id: 2, from: "Madurai", to: "Chennai", time: "1:00 PM", price: "Rs.500" },
        { id: 3, from: "Madurai", to: "Bangalore", time: "2:00 PM", price: "Rs.550" },
        { id: 4, from: "Madurai", to: "Bangalore", time: "6:00 PM", price: "Rs.650" },
    ];

    if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const from = document.getElementById("from").value;
            const to = document.getElementById("to").value;
            const date = document.getElementById("date").value;

            busList.innerHTML = ""; // Clear previous results

            const availableBuses = buses.filter(bus => bus.from === from && bus.to === to);

            if (availableBuses.length > 0) {
                availableBuses.forEach(bus => {
                    const busItem = document.createElement("div");
                    busItem.classList.add("bus-card");
                    busItem.innerHTML = `
                        <h3>${bus.from} → ${bus.to}</h3>
                        <p><strong>Departure Time:</strong> ${bus.time}</p>
                        <p><strong>Price:</strong> ${bus.price}</p>
                        <button onclick="bookTicket('${bus.id}')">Book Now</button>
                    `;
                    busList.appendChild(busItem);
                });
            } else {
                busList.innerHTML = "<p>No buses available for the selected route.</p>";
            }
        });
    }

    // Book Ticket Function
    window.bookTicket = function (busId) {
        alert(`Bus ${busId} booked successfully!`);
    };

    // Logout Function
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("loggedInUser");
            alert("Logged out successfully.");
            window.location.href = "index.html"; // Redirect to login page
        });
    }
});
