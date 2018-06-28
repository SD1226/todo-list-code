<?php
if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || ($_SERVER['HTTP_X_REQUESTED_WITH'] != 'XMLHttpRequest'))
	die('<h1>Error: Direct Access Denied.</h1>');
define('BASE_C', TRUE);
define('CONN_C', TRUE);
require 'base.php';
require 'connect.php';
if(!loggedin())
	die('<h1>You are not logged in.</h1>');
$user_id = $_SESSION['id'];
$content = format($_POST['content']);
$c_date = $_POST['c_date'];
$d_date = $_POST['d_date'];
try
	{    
		$query = "INSERT INTO work VALUES('', '$content', '$c_date', '$d_date', '$user_id', 0)";
        $query_run = $conn->prepare($query);
	    if($query_run->execute())
		{
			$data->id = $query_run->lastInsertId();
			$data->todo = '<div class="work"><button class="tick"></button><button class="del"></button>'.$content.
			'</div><div class="mdate">Last Modified: '.$c_date.'</div><div class="ddate">Due Date: '.$d_date.'</div>';
			$conn = null;
			echo json_encode($data);
		}
		else
		{
			$conn = null;
			echo false;
		}
	}
catch(PDOException $e)
	{
		die(false);
	}
?>