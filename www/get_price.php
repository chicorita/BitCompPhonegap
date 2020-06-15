<?php 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	if (!empty($_POST['key'])) {
		if ($_POST['key'] !== "06a628d478e20665f76d6047bcb9042f") {
			response(403, 21, "Access Denied", NULL);
			return;
		}

		include 'config.php';

		$conn = new mysqli($configs["servername"], $configs["username"], $configs["password"], $configs["dbname"]);
		if ($conn->connect_error) {
		   response(500, 21, "Failed to connect to database.", NULL);
		   return;
		}

		$stmt = $conn->prepare('SELECT DISTINCT cryto_price.* FROM cryto_price INNER JOIN (SELECT site, MAX(time) as max_time FROM cryto_price WHERE time >= now() and site <> "bitfinex" and site <> "cex" and site <> "okex" GROUP BY site) AS max_price_table WHERE cryto_price.site = max_price_table.site AND time = max_time ORDER BY price DESC');

		if ($stmt->execute()) {
			$result = $stmt->get_result();
			$data = $result->fetch_all(MYSQLI_ASSOC);
			response(201, 0, "", $data);
		} else {
			// User already exist, login directly
			$error = $conn->errno;

			response(500, 21, $error, NULL);
		}

		$conn->close();
	} else {
		response(400, 2, "Info not provided.", NULL);
		return;
	}
} else {
	response(400, 400, "Invalid Request", NULL);
	return;
}

function response($status_code, $status, $status_message, $data) {
	http_response_code($status_code);
	header('Content-Type: application/json;');
	$response['status'] = $status;
	$response['status_message'] = $status_message;
	if ($data != null) {
		$response['data'] = $data;
	}

	$json_response = json_encode($response);
	echo $json_response;
}

?>
