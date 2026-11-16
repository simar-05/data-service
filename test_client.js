
const BASE_URL = "http://localhost:3001";

async function testEndpoint(endpoint, requestData) {
    try {
        console.log(`\nTesting ${endpoint}`);
        console.log("Request:", requestData);

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();

        console.log("Status:", response.status);
        console.log("Response:", data);

    } catch (error) {
        console.error("Error:", error.message);
    }
}

async function runTests() {

    // User Story 1: Days Remaining

    // Future due date
    await testEndpoint("/daysRemaining", {
        initial_date: "2026-11-16",
        target_date: "2026-11-20"
    });

    // Overdue date
    await testEndpoint("/daysRemaining", {
        initial_date: "2026-11-16",
        target_date: "2026-11-12"
    });

    // Invalid date
    await testEndpoint("/daysRemaining", {
        initial_date: "2026-11-16",
        target_date: "2026-02-30"
    });

    // Single date tests
    await testEndpoint("/dateStringSingle", {
        dateString: "today"
    });

    await testEndpoint("/dateStringSingle", {
        dateString: "tomorrow"
    });

    await testEndpoint("/dateStringSingle", {
        dateString: "yesterday"
    });

    await testEndpoint("/dateStringSingle", {
        dateString: "invalid-string"
    });

    // Multiple date tests
    await testEndpoint("/dateStringMulti", {
        direction: "previous",
        unit: "week",
        number: 2
    });

    await testEndpoint("/dateStringMulti", {
        direction: "next",
        unit: "day",
        number: 6
    });

    await testEndpoint("/dateStringMulti", {
        direction: "previous",
        unit: "year",
        number: 5
    });

    await testEndpoint("/dateStringMulti", {
        direction: "next",
        unit: "month",
        number: 1
    });
}

runTests();

