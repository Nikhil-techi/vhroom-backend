const pool = require("../../config/DBConfig");

class VehicleController {
  // Add or update vehicle
  static async AddAndUpdateVehicle(req, res) {
    const {
      Id,
      VehicleName,
      VehicleNumber,
      VehicleModelNumber,
      VehicleType,
      WheelType,
      VehicleSeat,
      RefUser,
      IsActive
    } = req.body;

    // Validate required fields
    if (!VehicleName || !VehicleNumber || !VehicleModelNumber || !VehicleType || !WheelType || !VehicleSeat || !RefUser) {
      return res.status(400).send('Missing required fields');
    }

    try {
      let result;

      if (Id) {
        // Update existing vehicle
        result = await pool.query(
          `UPDATE "Vehicles"
           SET "VehicleName" = $1, "VehicleNumber" = $2, "VehicleModelNumber" = $3, "VehicleType" = $4, "WheelType" = $5, "VehicleSeat" = $6, "RefUser" = $7, "IsActive" = $8, "UpdatedOn" = CURRENT_TIMESTAMP
           WHERE "Id" = $9
           RETURNING *`,
          [VehicleName, VehicleNumber, VehicleModelNumber, VehicleType, WheelType, VehicleSeat, RefUser, IsActive, Id]
        );
      } else {
        // Add new vehicle
        result = await pool.query(
          `INSERT INTO "Vehicles" ("VehicleName", "VehicleNumber", "VehicleModelNumber", "VehicleType", "WheelType", "VehicleSeat", "RefUser", "IsActive")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING *`,
          [VehicleName, VehicleNumber, VehicleModelNumber, VehicleType, WheelType, VehicleSeat, RefUser, IsActive]
        );
      }

      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error('Database error:', err.stack);

      if (err.code === '23505' && err.constraint === 'Vehicles_VehicleNumber_key') {
        return res.status(400).send('Vehicle number already exists');
      }

      res.status(500).send('Internal Server Error');
    }
  }
}

module.exports = VehicleController;
