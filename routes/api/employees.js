const express = require("express");
const router = express.Router();

const data = {};
data.employees = require("../../data/employees.json");

router
  .route("/")
  .get((req, res) => {
    res.json(data.employees);
  })
  .post((req, res) => {
    const id =
      data.employees.length > 0
        ? Math.max(...data.employees.map((emp) => emp.id)) + 1
        : 1;
    // Access data from request body
    const newEmployee = {
      id: id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };
    // Add the new employee to the data
    data.employees.push(newEmployee);
    // return the whole Employee
    res.status(201).json(data.employees);
  })
  .put((req, res) => {
    const { id, firstName, lastName } = req.body;

    // Find the employee to be updated
    const employee = data.employees.find((emp) => emp.id === id);
    if (!employee) res.status(404).json({ message: "Employee not found" });

    // Update the employee details
    if (firstName) employee.firstName = firstName;
    if (lastName) employee.lastName = lastName;

    res.json(employee);
  })
  .delete((req, res) => {
    const { id } = req.body;
    const index = data.employees.findIndex((emp) => emp.id === id);
    if (index === -1)
      return res.status(404).json({ message: "Employee not found" });
    const deletedEmployee = data.employees.splice(index, 1);
    res.json(deletedEmployee);
  });

router.route("/:id").get((req, res) => {
  const { id } = req.params;
  const employee = data.employees.find((emp) => emp.id === parseInt(id, 10));
  if (!employee) return res.status(404).json({ message: "Employee not found" });

  res.json(employee);
});

module.exports = router;
