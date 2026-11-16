const express = require('express')

const app = express()
const PORT = 3001;

app.use(express.json())

//User story 1
//TODO: !!!

//User story 2
app.post('/dateStringSingle', (req, res) => {
    //converts "today", "tomorrow", "yesterday"
    const {dateString} = req.body;

    //Check if dateString is string
    if (typeof dateString != "string") {
        res.status(400).json({
            error: "dateString must be a string"
        })
    }

    let date_returned = new Date()
    //Check which string is sent
    if (dateString === "today"){
        date_returned = date_returned.toISOString().substring(0,10)

        res.status(200).json({
            date_returned
        })
    } else if (dateString === "tomorrow"){
        date_returned.setDate(date_returned.getDate() + 1)

        date_returned = date_returned.toISOString().substring(0,10)
        res.status(200).json({
            date_returned
        })
    } else if (dateString === "yesterday"){
        date_returned.setDate(date_returned.getDate() - 1)

        date_returned = date_returned.toISOString().substring(0,10)
        res.status(200).json({
            date_returned
        })        
    } else {
        res.status(400).json({
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
    let multiplier_list = [1, 7, 30, 365]
    let date_returned = new Date()

    //Check if number is int
    if (!Number.isInteger(number)) {
        res.status(400).json({
            error: "number must be an integer"
        })
    }

    //Check if unit is valid
    if (!unit_list.includes(unit)) {
        res.status(400).json({
            error: "unit must be day, week, month, or year"
        })
    }

    //Check if direction is valid
    if (!direction_list.includes(direction)) {
        res.status(400).json({
            error: "direction must be next or previous"
        })
    }

    //Set multiplier (unit list mapped to multiplier list)
    for (let i = 0; i < unit_list.length; i++){
        if (unit_list[i] === unit) {
            multiplier = multiplier_list[i]
        }
    }

    //If previous, make multiplier negative
    if (direction === "previous") {
        multiplier *= -1
    }

    date_returned.setDate(date_returned.getDate() + multiplier * number)

    date_returned = date_returned.toISOString().substring(0,10)
    res.status(200).json({
        date_returned
    })
})

app.listen(PORT, () => {
    console.log(`Microservice listening on http://localhost:${PORT}...`)
});