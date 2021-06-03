const express = require('express');

const router = express.Router();

const mockupUsers = [
    {
        name: 'Mohamed Salah',
        age: 28,
    },
    {
        name: 'Lionel Messi',
        age: 33,
    },
];

/* GET users listing. */
router.get('/', (req, res) => {
    res.json({ users: mockupUsers });
});

module.exports = router;
