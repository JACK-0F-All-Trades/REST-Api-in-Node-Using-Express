const express = require('express');
const Joi = require('joi');
const app = express();

app.use(express.json());

// lets have a course array
const courses = [
    { id: 1, name: "course1" },
    { id: 2, name: "course2" },
    { id: 3, name: "course3" }
]

// now we define some endpoints and the handler functions for them.

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.get("/api/courses", (req, res) => {
    res.send(courses);
})

function courseExists(id) {
    return courses.find(course => course.id === id);
}

app.get("/api/courses/:id", (req, res) => {
    // find the course in the courses array.
    // const course = courses.find(course => course.id === parseInt(req.params.id));
    const result = courseExists(parseInt(req.params.id));
    if (!result) res.status(404).send("The course was ot found!");
    res.send(result);
})

function validateRequest(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    // validate the name.
    return schema.validate(course);

}


// time to handle a post request.

app.post("/api/courses", (req, res) => {

    const result = validateRequest(req.body);
    if (result.error) res.status(400).send(result.error.details[0].message);
    else {
        courses.push({ id: courses.length + 1, name: req.body.name });
        res.send(courses);
    }

})

// for a put request.
app.put("/api/courses/:id", (req, res) => {
    // check if the course exists.
    const course = courseExists(parseInt(req.params.id));
    if (!course) { res.status(404).send("Course Not Found!"); return };

    // check if the request is valid.
    const result = validateRequest(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    course.name = req.body.name;
    res.status(200).send(courses);



})

// delete operation
app.delete("/api/courses/:id", (req, res) => {
    // check whether the course exists.
    const course = courseExists(parseInt(req.params.id));
    if (!course) return res.status(404).send("Course Not found");

    const indexOfDelete = courses.indexOf(course);
    courses.splice(indexOfDelete, 1);
    return res.send(courses);
})


// // Route Parameters
// app.get("/api/courses/:id", (req, res) => {
//     res.send(req.query);
//     // Query strings.
//     // res.send(req.query);
// })



// we need the app to listen at a specific port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));

