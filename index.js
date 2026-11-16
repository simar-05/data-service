const express = require('express')

const app = express()
const PORT = 3001;

app.use(express.json())


 //User story 1
 //Calculate days remaining until a due date
 app.post('/daysRemaining', (req, res) => {
    const { initial_date, target_date } = req.body;

    // Check that both dates use YYYY-MM-DD format
    function parseDate(value) {
        if (typeof value !== "string" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return null;
        }

        const [year, month, day] = value.split("-").map(Number);
        const date = new Date(Date.UTC(year, month - 1, day));

        // Reject invalid dates such as February 30
        if (date.getUTCFullYear() !== year ||
            date.getUTCMonth() !== month - 1 ||
            date.getUTCDate() !== day) {
            return null;
        }

        return date;
    }

    const startDate = parseDate(initial_date);
    const dueDate = parseDate(target_date);

    if (!startDate || !dueDate) {
        return res.status(400).json({
            error: "Both dates must be valid YYYY-MM-DD dates"
        });
    }

    // Calculate the difference in whole calendar days
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const days_remaining = Math.round(
        (dueDate - startDate) / millisecondsPerDay
    );

    return res.status(200).json({
        days_remaining
    });
});

//User story 2
app.post('/dateStringSingle', (req, res) => {
    //converts "today", "tomorrow", "yesterday"
    const {dateString} = req.body;

    //Check if dateString is string
    if (typeof dateString != "string") {
        return res.status(400).json({
            error: "dateString must be a string"
        })
    }

    let date_returned = new Date()
    //Check which string is sent
    if (dateString === "today"){
        date_returned = date_returned.toISOString().substring(0,10)

        return res.status(200).json({
            date_returned
        })
    } else if (dateString === "tomorrow"){
        date_returned.setDate(date_returned.getDate() + 1)

        date_returned = date_returned.toISOString().substring(0,10)
        return res.status(200).json({
            date_returned
        })
    } else if (dateString === "yesterday"){
        date_returned.setDate(date_returned.getDate() - 1)

        date_returned = date_returned.toISOString().substring(0,10)
        return res.status(200).json({
            date_returned
        })        
    } else {
        return res.status(400).json({
            error: "dateString invalid. Must be 'tomorrow', 'today', or 'yesterday'"
        })
    }

})

//User story 3
app.post('/dateStringMulti', (req, res) => {
    //Takes multiple strings to return date
    //Ex: direction: "next", unit: "week", number: 3 would return date
    //3 weeks from today.

    //direction must be: "next" or "previous"
    //unit must be: "day", "week", "month", "year"
    //number must be an int

    const {direction, unit, number} = req.body;
    let unit_list = ["day", "week", "month", "year"]
    let direction_list = ["next", "previous"]
    let date_returned = new Date()

    //Check if number is int
    if (!Number.isInteger(number)) {
        return res.status(400).json({
            error: "number must be an integer"
        })
    }

    //Check if unit is valid
    if (!unit_list.includes(unit)) {
        return res.status(400).json({
            error: "unit must be day, week, month, or year"
        })
    }

    //Check if direction is valid
    if (!direction_list.includes(direction)) {
        return res.status(400).json({
            error: "direction must be next or previous"
        })
    }

    // Calculate using actual calendar days, months, and years
    const amount = direction === "previous" ? -number : number;

    if (unit === "day") {
        date_returned.setDate(date_returned.getDate() + amount);
    } else if (unit === "week") {
        date_returned.setDate(date_returned.getDate() + amount * 7);
    } else if (unit === "month") {
        const originalDay = date_returned.getDate();

        date_returned.setDate(1);
        date_returned.setMonth(date_returned.getMonth() + amount);

        const lastDay = new Date(
            date_returned.getFullYear(),
            date_returned.getMonth() + 1,
            0
        ).getDate();

        date_returned.setDate(Math.min(originalDay, lastDay));
    } else if (unit === "year") {
        const originalMonth = date_returned.getMonth();

        date_returned.setFullYear(date_returned.getFullYear() + amount);

        // Handle February 29 in non-leap years
        if (date_returned.getMonth() !== originalMonth) {
            date_returned.setDate(0);
        }
    }

    date_returned = date_returned.toISOString().substring(0,10)
    return res.status(200).json({
        date_returned
    })
})

app.listen(PORT, () => {
    console.log(`Microservice listening on http://localhost:${PORT}...`)
});