
CREATE TABLE "Countries" (
    "Id" SERIAL NOT NULL,
    "CountryName" TEXT NOT NULL,
    "IsActive" INTEGER NOT NULL DEFAULT 1,
    "CreatedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedOn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Countries_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "States" (
    "Id" SERIAL NOT NULL,
    "StateName" TEXT NOT NULL,
    "RefCountry" INTEGER NOT NULL,
    "IsActive" INTEGER NOT NULL DEFAULT 1,
    "CreatedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedOn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "States_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Cities" (
    "Id" SERIAL NOT NULL,
    "CityName" TEXT NOT NULL,
    "RefState" INTEGER NOT NULL,
    "IsActive" INTEGER NOT NULL DEFAULT 1,
    "CreatedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedOn" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Cities_pkey" PRIMARY KEY ("Id")
);

CREATE TABLE "PreRegistration" (
    "Id" SERIAL PRIMARY KEY,
    "Mobile" VARCHAR(15) NOT NULL UNIQUE,
    "OTP" VARCHAR(10) NOT NULL,
    "UserType" VARCHAR(10) NOT NULL,
    "IsActive" BOOLEAN DEFAULT true,
    "CreatedOn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedOn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "ExpiredAt" TIMESTAMP NOT NULL
);

CREATE TABLE "RiderUser" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(100),
    "Mobile" VARCHAR(15) NOT NULL UNIQUE,
    "Email" VARCHAR(100),
    "Gender" VARCHAR(15),
    "DOB" Date,
    "Photo" TEXT,
    "ServiceType" VARCHAR(100),
    "Code" VARCHAR(10),
    "IsActive" BOOLEAN DEFAULT true,
    "IsVerified" BOOLEAN DEFAULT false,
    "CreatedOn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedOn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE "RestroUser" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(100),
    "Mobile" VARCHAR(15) NOT NULL UNIQUE,
    "Email" VARCHAR(100),
    "Gender" VARCHAR(15),
    "DOB" Date,
    "Photo" TEXT,
    "ServiceType" VARCHAR(100),
    "Code" VARCHAR(10),
    "IsActive" BOOLEAN DEFAULT true,
    "IsVerified" BOOLEAN DEFAULT false,
    "CreatedOn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedOn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "CustomerUser" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(100),
    "Mobile" VARCHAR(15) NOT NULL UNIQUE,
    "Email" VARCHAR(100),
    "Gender" VARCHAR(15),
    "DOB" Date,
    "Photo" TEXT,
    "ServiceType" VARCHAR(100),
    "Code" VARCHAR(10),
    "IsActive" BOOLEAN DEFAULT true,
    "IsVerified" BOOLEAN DEFAULT false,
    "CreatedOn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedOn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
































CREATE TABLE "RestroAddresses" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(255) NOT NULL,
    "City" VARCHAR(255) NOT NULL,
    "State" VARCHAR(255) NOT NULL,
    "Country" VARCHAR(255) NOT NULL,
    "PinCode" VARCHAR(20) NOT NULL,
    "RefRiderUser" INTEGER,
    "IsDefault" BOOLEAN DEFAULT false,
    "IsActive" BOOLEAN DEFAULT true,
    "CreatedOn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedOn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE "RiderDocuments" (
    "Id" SERIAL PRIMARY KEY,
    "DocNumber" TEXT,
    "IssueDate" DATE,
    "ExpiredDate" DATE,
    "DocLocation" TEXT,
    "DocType" TEXT,
    "RefRiderUser" INT, -- Assuming Users table has an Id column
    "IsActive" BOOLEAN DEFAULT true,
    "CreatedOn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedOn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE "RiderVehicles" (
    "Id" SERIAL PRIMARY KEY,
    "VehicleName" TEXT NOT NULL,
    "VehicleNumber" TEXT UNIQUE NOT NULL,
    "VehicleModelNumber" TEXT NOT NULL,
    "VehicleType" TEXT NOT NULL,
    "WheelType" TEXT NOT NULL,
    "VehicleSeat" INT NOT NULL,
    "RefRiderUser" INT NOT NULL,
    "IsActive" BOOLEAN DEFAULT true,
    "CreatedOn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedOn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE SubscriptionPlan (
    Id SERIAL PRIMARY KEY,
    Amount INT,
    Duration VARCHAR(10),
    Limit INT,
    UserType VARCHAR(10)
    IsActive BOOLEAN
    CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE RideRequest (   
    Id SERIAL PRIMARY KEY,
    CustomerId INT REFERENCES CustomerUser(Id),
    PickupLocation GEOGRAPHY(POINT),
    DropoffLocation GEOGRAPHY(POINT), 
    RequestTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    RideStatus VARCHAR(50), -- 'Cancelled, Completed, Unfullfilled [ Driver Not Found], Pending(Searching), Acccepted'
    DriverId VARCHAR, --[deafualt null until driver found]
    EstimatedFare DECIMAL,
    ActualFare DECIMAL,
    IsReady BOOLEAN --show dropped location after otp
    OTP INT
    UserType VARCHAR(50),
    PaymentStatus VARCHAR(50),
    CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE (
    
)



CREATE TABLE RiderPayment (
    Id SERIAL PRIMARY KEY,
    RiderRequestId INT REFERENCES RiderRequest(Id),
    CustomerId INT,
    PaymentId VARCHAR(50)
    PaymentAmount DECIMAL,
    PaymentMethod VARCHAR(50),
    PaymentStatus VARCHAR(50),
    UserType VARCHAR(10)
    PaymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)




CREATE TABLE SubscriptionPurchsedUser (
    Id SERIAL PRIMARY KEY,
    CustomerId INT,
    SubscriptionPlanId INT REFERENCES SubscriptionPlan(Id),
    SubscriptionStartDate DATE,
    SubscriptionEndDate DATE,
    SubscriptionStatus VARCHAR(10),
    UserType VARCHAR(10)
    CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)