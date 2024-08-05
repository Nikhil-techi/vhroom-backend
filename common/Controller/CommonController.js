const { validationResult } = require('express-validator');
const pool = require('../db');

exports.createAddress = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { Name, City, State, Country, PinCode, RefUser, IsDefault, IsActive } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO Addresses (Name, City, State, Country, PinCode, RefUser, IsDefault, IsActive) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [Name, City, State, Country, PinCode, RefUser, IsDefault, IsActive]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllAddresses = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Addresses');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateAddress = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { Id } = req.params;
    const { Name, City, State, Country, PinCode, RefUser, IsDefault, IsActive } = req.body;
    try {
        const result = await pool.query(
            `UPDATE Addresses SET Name = $1, City = $2, State = $3, Country = $4, PinCode = $5, RefUser = $6, IsDefault = $7, IsActive = $8, UpdatedOn = CURRENT_TIMESTAMP 
            WHERE Id = $9 RETURNING *`,
            [Name, City, State, Country, PinCode, RefUser, IsDefault, IsActive, Id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAddress = async (req, res) => {
    const { Id } = req.params;
    try {
        await pool.query('DELETE FROM Addresses WHERE Id = $1', [Id]);
        res.status(200).send(`Address deleted with ID: ${Id}`);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
