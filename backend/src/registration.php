<?php
// =========================================================================
// SECTION 1: API Configuration and Security Headers (CORS)
// =========================================================================
// CORS + preflight
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight quickly
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// This header allows any client (* means all origins, i.e., your mobile app)
// to make a request to this script, preventing CORS errors in the emulator.
// header("Access-Control-Allow-Origin: *");

// // Specifies that the response body will be in JSON format.
// header("Content-Type: application/json; charset=UTF-8");

// // Only allows the secure POST method for sending sensitive data.
// header("Access-Control-Allow-Methods: POST");

// // Specifies which headers are allowed in the request.
// header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// =========================================================================
// SECTION 2: Database Connection Details
// =========================================================================

// These details are for the database (MySQL) connection on your XAMPP server.
$host = "localhost";
$db_name = "multiplesclerosisdb"; // Ensure this matches your actual database name
$username = "root"; // Default XAMPP MySQL user
$password = "";    // Default XAMPP MySQL password (usually empty)

// =========================================================================
// SECTION 3: Initial Request Validation and Data Extraction
// =========================================================================

// 405 Method Not Allowed check: Immediately stops the script if it's not a POST request.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Error: Only POST requests are allowed."]);
    exit();
}

// Reads the raw JSON data sent in the request body from the mobile app (php://input).
$data = json_decode(file_get_contents("php://input"));

// 400 Bad Request check: Ensures both required fields are present in the JSON payload.
if (!isset($data->username) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Error: Missing username or password in request."]);
    exit();
}

// Clean up and assign the received data to PHP variables.
$user = trim($data->username);
$pass = trim($data->password);

// =========================================================================
// SECTION 4: Database Connection
// =========================================================================

// Establishes the connection to the MySQL database.
$conn = new mysqli($host, $username, $password, $db_name);

// 500 Server Error check: Handles cases where XAMPP's MySQL service is not running.
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database Connection Failed: " . $conn->connect_error]);
    exit();
}

// =========================================================================
// SECTION 5: Username Availability Check (Prevent Duplicates)
// =========================================================================

// Query only needs to select the username, as we just want to know if a row exists.
$check_stmt = $conn->prepare("SELECT username FROM users WHERE username = ? LIMIT 1");
$check_stmt->bind_param("s", $user);

// Execute the check query.
$check_stmt->execute();
$check_stmt->store_result(); // Stores the result set locally for counting rows.

// If the number of rows found is greater than 0, the username already exists.
if ($check_stmt->num_rows > 0) {
    // 409 Conflict: Indicates the registration failed because the resource already exists.
    http_response_code(409); 
    echo json_encode(["success" => false, "message" => "Registration Failed: Username already exists."]);
    $check_stmt->close();
    $conn->close();
    exit();
}

$check_stmt->close();

// =========================================================================
// SECTION 6: Secure Password Hashing and Insertion
// =========================================================================


// SQL query to insert the new user record.
$insert_query = "INSERT INTO users (username, Password) VALUES (?, ?)";
$insert_stmt = $conn->prepare($insert_query);

// Bind the two parameters
$insert_stmt->bind_param("ss", $user, $pass);

// Attempt to execute the insertion into the database.
if ($insert_stmt->execute()) {
    // 201 Created: The user record was successfully created in the database.
    http_response_code(201);
    echo json_encode(["success" => true, "message" => "Registration successful! You can now log in."]);
} else {
    // 500 Server Error: Generic failure if the database insert operation fails.
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Registration failed due to a server error."]);
}

// =========================================================================
// SECTION 7: Cleanup
// =========================================================================

$insert_stmt->close();
$conn->close();
?>