<?php

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

// =========================================================================
// SECTION 1: API Configuration and Security Headers (CORS)
// =========================================================================

// Allow access from any origin (*).
// header("Access-Control-Allow-Origin: *");
// // Ensure the response is correctly recognized as JSON data.
// header("Content-Type: application/json; charset=UTF-8");
// // Explicitly state that only the POST method is allowed for submitting credentials.
// header("Access-Control-Allow-Methods: POST");
// // Standard headers required for complex requests (like those with JSON data).
// header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// =========================================================================
// SECTION 2: Database Connection Details (Local XAMPP Setup)
// =========================================================================

// The hostname where MySQL is running (it's the same machine as PHP).
$host = "localhost"; 
// The name of your database created in phpMyAdmin.
$db_name = "multiplesclerosisdb"; 
// The default XAMPP MySQL username.
$username = "root";                   
// The default XAMPP MySQL password (usually empty).
$password = "";                       

// =========================================================================
// SECTION 3: Initial Request Validation
// =========================================================================

// 3.1 Method Check: Must be a POST request.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    // Respond with HTTP 405 (Method Not Allowed) and a JSON error message.
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Error: Only POST requests are allowed."]);
    exit(); // Stop script execution immediately.
}

// 3.2 Data Extraction
$data = json_decode(file_get_contents("php://input"));

// 3.3 Presence Check: Verify both required fields exist in the JSON payload.
if (!isset($data->username) || !isset($data->password)) {
    // Respond with HTTP 400 (Bad Request).
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Error: Missing username or password in request."]);
    exit();
}

// 3.4 Variable Assignment and Trimming.
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

// 5.1 SQL Query Preparation (Security Critical Step)
$query = "SELECT Password FROM users WHERE username = ? LIMIT 1"; 

// Prepare the statement. This sends the query structure to MySQL for parsing.
$stmt = $conn->prepare($query);

// 5.2 Bind Parameters
$stmt->bind_param("s", $user);

// 5.3 Execute Query
$stmt->execute();

// 5.4 Store Result and Bind Output
$stmt->store_result();
// Binds the single column result to a PHP variable.
$stmt->bind_result($user_pass);
// Fetches the retrieved row into the $user_pass variable.
$stmt->fetch();

// =========================================================================
// SECTION 6: Verification and Response
// =========================================================================

// 6.1 Core Verification Logic
if ($stmt->num_rows == 1 && $pass == $user_pass) {    
    // Success: Login credentials are valid.
    // Generate a secure random token (acting as a session ID for now)
    // In a production app, you would store this in the DB or use a JWT library.
    $token = bin2hex(random_bytes(32));

    http_response_code(200); // OK
    echo json_encode(["success" => true, "message" => "Login successful. Welcome!","token" => $token]);   
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
