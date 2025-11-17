<?php
ob_start(); 

// =========================================================================
// SECTION 1: API Configuration and Security Headers (CORS)
// =========================================================================
// CORS + preflight

// This header allows any client (* means all origins, i.e., your mobile app)
// to make a request to this script, preventing CORS errors in the emulator.
header("Access-Control-Allow-Origin: *");

// // Specifies that the response body will be in JSON format.
header("Content-Type: application/json; charset=UTF-8");

// // Only allows the secure POST method for sending sensitive data.
header("Access-Control-Allow-Methods: POST, OPTIONS");

// // Specifies which headers are allowed in the request.
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


$server_response = ["success" => false, "message" => "Initialization error."];
$server_response_code = 500; // Default to server error

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

// Handle preflight quickly
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    ob_end_clean(); // Discard any output buffer content for a clean 204 response
    exit();
}

// 405 Method Not Allowed check: Immediately stops the script if it's not a POST request.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $server_response_code = 405;
    http_response_code($server_response_code);
    $server_response = ["success" => false, "message" => "Error: Only POST requests are allowed."];
    echo json_encode($server_response);
    exit();
}

// Reads the raw JSON data sent in the request body from the mobile app (php://input).
$data = json_decode(file_get_contents("php://input"));

// 400 Bad Request check: Ensures both required fields are present in the JSON payload.
if (!isset($data->username_label) || !isset($data->password_label) || !isset($data->email_label)) {
    $server_response_code = 400;
    $server_response = ["success" => false, "message" => "Error: Missing username, password or email in request."];
    goto cleanup;
}

// Clean up and assign the received data to PHP variables.
$user = trim($data->username_label);
$pass = trim($data->password_label);
$email = trim($data->email_label);

// =========================================================================
// SECTION 4: Database Connection
// =========================================================================

// Establishes the connection to the MySQL database.
$conn = new mysqli($host, $username, $password, $db_name);
//require_once db-connection-util.php;

// 500 Server Error check: Handles cases where XAMPP's MySQL service is not running.
if ($conn->connect_error) {
    $server_response_code = 500;
    $server_response = ["success" => false, "message" => "Database Connection Failed: " . $conn->connect_error];
    goto final_response;
}

// =========================================================================
// SECTION 5: Username Availability Check (Prevent Duplicates)
// =========================================================================

// Query only needs to select the username, as we just want to know if a row exists.
$check_stmt = $conn->prepare("SELECT username FROM users WHERE username = ? LIMIT 1");
$check_stmt->bind_param("s", $user);

//$check_stmt = $conn->prepare("SELECT username FROM users WHERE username = ? OR Email = ? LIMIT 1");
//$check_stmt->bind_param("ss", $user, $email);

// Execute the check query.
$check_stmt->execute();
$check_stmt->store_result(); // Stores the result set locally for counting rows.

// If the number of rows found is greater than 0, the username already exists.
if ($check_stmt->num_rows > 0) {
    // 409 Conflict: Indicates the registration failed because the resource already exists.
    $server_response_code = 409;
    $server_response = ["success" => false, "message" => "Registration Failed: Username already exists."];
    $check_stmt->close();
    goto cleanup;
}

$check_stmt->close();

// =========================================================================
// SECTION 6: Password and Email Insertion
// =========================================================================


// SQL query to insert the new user record.

//$hashed_password = password_hash($pass, PASSWORD_DEFAULT);

$insert_query = "INSERT INTO users (username, Password, Email) VALUES (?, ?, ?)";
$insert_stmt = $conn->prepare($insert_query);

// Bind the three parameters
$insert_stmt->bind_param("sss", $user, $pass, $email);

// Attempt to execute the insertion into the database.
if ($insert_stmt->execute()) {
    // 201 Created: The user record was successfully created in the database.
    $server_response_code = 201;
    $server_response = ["success" => true, "message" => "Registration successful! You can now log in."];
} else {
    // 500 Server Error: Generic failure if the database insert operation fails.
    $server_response_code = 500;
    $server_response = ["success" => false, "message" => "Registration failed due to a server error." . $conn->connect_error];

}

// =========================================================================
// SECTION 7: Cleanup
// =========================================================================

// Close the insertion statement
// NOTE: This MUST be done before 'cleanup' if a statement was successfully prepared/executed
if (isset($insert_stmt) && $insert_stmt instanceof mysqli_stmt) {
    $insert_stmt->close();
}

cleanup:
// Close connection if it was successfully opened earlier.
if (isset($conn) && $conn instanceof mysqli) {
    $conn->close();
}

final_response:
// 1. Set the determined HTTP status code.
http_response_code($server_response_code);

// 2. The single, final echo of the JSON response.
echo json_encode($server_response);

// 3. CRITICAL FIX: Flush the buffer to send the JSON data to the client, 
//    then turn off buffering.
ob_end_flush();

?>