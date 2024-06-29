# Policy Management API

This project provides a set of APIs to manage and query insurance policy data. The APIs allow for uploading data from XLSX/CSV files into MongoDB, searching policy information by username, and aggregating policy data for each user. Additionally, the project includes functionality to monitor real-time CPU utilization and restart the server if usage exceeds a specified threshold. It also includes a service to insert scheduled messages into a database.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [API Endpoints](#api-endpoints)
    - [Upload Data](#upload-data)
    - [Search Policy Info](#search-policy-info)
    - [Get Aggregated Policies](#get-aggregated-policies)
    - [Track CPU Utilization](#track-cpu-utilization)
    - [Schedule Messages](#schedule-messages)
- [Data Model](#data-model)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Althamish16/insuredmine.git
    cd insuredmine
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up MongoDB:

    Make sure you have MongoDB installed and running. Update the MongoDB connection string in the `.env` file.

4. Run the application:

    ```bash
    npm run start
    ```
5. Stop the application:

    ```bash
    npm run stop
    ```

6. To see the logs:

    ```bash
    npm run logs
    ```

## Usage

### API Endpoints

#### Upload Data

**Endpoint:** `POST http://localhost:8000/api/upload`

Uploads XLSX/CSV data into MongoDB using worker threads.

- **Request:**
  - Headers: `Content-Type: multipart/form-data`
  - Body: File (XLSX/CSV)

- **Response:**
  - Status: `200 OK`
  - Body: `{ "message": "Data upload started" }`

#### Search Policy Info

**Endpoint:** `GET http://localhost:8000/api/search-policy`

Search for policy information by username.

- **Request:**
  - Query Parameter: `username` - The username to search for.

- **Response:**
  - Status: `200 OK`
  - Body: JSON object containing policy information.

#### Get Aggregated Policies

**Endpoint:** `GET http://localhost:8000/api/users/:userId/aggregated-policy`

Get aggregated policy data for each user.

- **Request:**
  - Path Parameter: `userId` - The ID of the user whose aggregated policy data is being requested.

- **Response:**
  - Status: `200 OK`
  - Body: JSON object containing aggregated policy data.

#### Track CPU Utilization

**Endpoint:** N/A (Server-side functionality)

Monitors real-time CPU utilization and restarts the server when usage exceeds 70%.

#### Schedule Messages

**Endpoint:** `POST http://localhost:8000/api/message`

Inserts a message into the database to be scheduled at a specific day and time.

- **Request:**
  - Headers: `Content-Type: application/json`
  - Body: `{ "message": "your message", "day": "YYYY-MM-DD", "time": "HH:MM:SS" }`

- **Response:**
  - Status: `200 OK`
  - Body: Return Saved JSON object data.

## Data Model

The data is organized into the following collections in MongoDB:

1. **Agent**
   - `agentId`
   - `agentName`
   - `createdAt`
   - `updatedAt`

2. **User**
   - `userId`
   - `firstname`
   - `dob`
   - `address`
   - `phone`
   - `state`
   - `zip`
   - `email`
   - `gender`
   - `userType`
   - `city`
   - `primary`
   - `agentId`
   - `createdAt`
   - `updatedAt`

3. **User's Account**
   - `userId`
   - `account_name`
   - `account_type`
   - `createdAt`
   - `updatedAt`

4. **Policy Info**
   - `policyId`
   - `policy_number`
   - `policy_start_date`
   - `policy_end_date`
   - `policy_type`
   - `policy_mode`
   - `csr`
   - `premium_amount_written`
   - `premium_amount`
   - `producer`
   - `hasActiveClientPolicy`
   - `categoryId`
   - `companyId`
   - `userId`
   - `createdAt`
   - `updatedAt`

5. **Policy Category**
   - `categoryId`
   - `category_name`
   - `createdAt`
   - `updatedAt`

6. **Policy Carrier**
   - `companyId`
   - `company_name`
   - `createdAt`
   - `updatedAt`

7. **Planned Message**
   - `message`
   - `day`
   - `time`
   - `datetime`
   - `createdAt`

8. **Message**
   - `message`
   - `createdAt`


## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss your changes.

## License

This project is licensed under the ISC License.

