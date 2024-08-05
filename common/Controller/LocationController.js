const pool = require('../../config/DBConfig'); // Assuming config is defined here

class LocationController {
    static async getAllCountries(req, res) {
        try {
            const result = await pool.query('SELECT * FROM "Countries"');
            res.json(result.rows);
        } catch (err) {
            console.error('Query error:', err.stack);
            res.status(500).send('Internal Server Error');
        }
    }

    static async getAllStates(req, res) {
        const { RefCountry } = req.query; // Extract RefCountry from query parameters
    
        if (!RefCountry) {
          return res.status(400).send('RefCountry is required');
        }
    
        try {
          // Use parameterized query to avoid SQL injection
          const result = await pool.query(
            'SELECT * FROM "States" WHERE "Id" = $1',
            [RefCountry]
          );
          res.json(result.rows);
        } catch (err) {
          console.error('Query error:', err.stack);
          res.status(500).send('Internal Server Error');
        }
      }
    
      static async getAllCities(req, res) {
        const { RefState } = req.query; // Extract RefState from query parameters
    
        if (!RefState) {
          return res.status(400).send('RefState is required');
        }
    
        try {
          // Use parameterized query to avoid SQL injection
          const result = await pool.query(
            'SELECT * FROM "Cities" WHERE "Id" = $1',
            [RefState]
          );
          res.json(result.rows);
        } catch (err) {
          console.error('Query error:', err.stack);
          res.status(500).send('Internal Server Error');
        }
      }

}

module.exports = LocationController;
