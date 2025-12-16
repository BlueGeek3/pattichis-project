<?php
// =========================================================================
// SECTION 1: API Configuration and Security Headers (CORS)
// =========================================================================
// CORS + preflight
// Allow access from any origin (*).
header("Access-Control-Allow-Origin: *");
// Explicitly state that only the POST method is allowed for submitting credentials.
header("Access-Control-Allow-Methods: POST, OPTIONS");
// Standard headers required for complex requests (like those with JSON data).
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
// Ensure the response is correctly recognized as JSON data.
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight quickly
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// =========================================================================
// SECTION 2: Database Connection Details (Local XAMPP Setup)
// =========================================================================

// The hostname where MySQL is running (it's the same machine as PHP).
$host = "localhost"; 
// The name of the database created in phpMyAdmin.
$db_name = "multiplesclerosisdb"; 
// The default XAMPP MySQL username.
$username = "root";                   
// The default XAMPP MySQL password (usually empty).
$password = "";                       

// =========================================================================
// SECTION 3: Initial Request Validation
// =========================================================================

// Method Check: Must be a POST request.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    // Respond with HTTP 405 (Method Not Allowed) and a JSON error message.
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Error: Only POST requests are allowed."]);
    exit(); // Stop script execution immediately.
}

// Data Extraction
$data = json_decode(file_get_contents("php://input"));

// Presence Check: Verify both required fields exist in the JSON payload.
if (!isset($data->username) || !isset($data->password)) {
    // Respond with HTTP 400 (Bad Request).
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Error: Missing username or password in request."]);
    exit();
}

// Variable Assignment and Trimming.
$user = trim($data->username);
$pass = trim($data->password);

// 3.5 Empty Value Check.
if (empty($user) || empty($pass)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Error: Username and password cannot be empty."]);
    exit();
}

// =========================================================================
// SECTION 4: Database Connection and Error Handling
// =========================================================================

// Attempt to establish a connection to the database using MySQLi.
$conn = new mysqli($host, $username, $password, $db_name);

// Check if the connection attempt failed.
if ($conn->connect_error) {
    // Respond with HTTP 500 (Internal Server Error) if the database is unreachable.
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database Connection Failed: " . $conn->connect_error]);
    exit();
}

// =========================================================================
// SECTION 5: Secure Login Logic (Prepared Statements)
// =========================================================================

// SQL Query Preparation (Security Critical Step)
$query = "SELECT Password FROM users WHERE username = ? LIMIT 1"; 

// Prepare the statement. This sends the query structure to MySQL for parsing.
$stmt = $conn->prepare($query);

// Bind Parameters
$stmt->bind_param("s", $user);

// Execute Query
$stmt->execute();

// Store Result and Bind Output
$stmt->store_result();
// Binds the single column result to a PHP variable.
$stmt->bind_result($user_pass);
// Fetches the retrieved row into the $user_pass variable.
$stmt->fetch();

// =========================================================================
// SECTION 6: Verification and Response
// =========================================================================

// Core Verification Logic
if ($stmt->num_rows == 1 && $pass == $user_pass) {    
    // Success: Login credentials are valid.
    http_response_code(200); // OK
    echo json_encode(["success" => true, "message" => "Login successful. Welcome!", "user" => $user]);   
}
else {
    // Failure: Username not found OR password did not match.
    http_response_code(401); // Unauthorized
    echo json_encode(["success" => false, "message" => "Invalid username or password."]);
}

// =========================================================================
// SECTION 7: Cleanup
// =========================================================================
$stmt->close();
$conn->close();
?>
