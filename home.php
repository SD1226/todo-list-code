<?php
if(!defined('INDEX'))
	header('Location: index.php');
require 'connect.php';
try
	{
		$list = array();
		$i = 0;
		$id = $_SESSION['id'];
		$query = 'SELECT username FROM users WHERE id = :id';
        $query_run = $conn->prepare($query);
	    $query_run->bindParam(':id',$id);
	    $query_run->execute();
	    $data = $query_run->fetch(PDO::FETCH_OBJ);
		$name = $data->username;
		$query = 'SELECT todo_id, content, c_date, d_date, done FROM work WHERE user_id = :id';
		$query_run = $conn->prepare($query);
	    $query_run->bindParam(':id',$id);
	    $query_run->execute();
	    while($data = $query_run->fetch(PDO::FETCH_OBJ))
		{
			$list[$i] = 
			array('todo_id'=>$data->todo_id, 'content'=>$data->content, 'c_date'=>$data->c_date, 'd_date'=>$data->d_date, 'done'=>$data->done);
		    $i++;
		}
		$conn = null;
	}
catch(PDOException $e)
	{
	    die('<h1>Connection failed!</h1>');
	}	
?>
<!DOCTYPE html>
<html>
<head>
<title>HOME
</title>
<link rel="stylesheet" type="text/css" href="style2.css" />
<link rel="icon" href="notebook.png" sizes="any">
<meta name="viewport" content="width=device-width,initial-scale=1.0" />
</head>
<body>
    <div id="header">
		<img src="dd.png" id="dd" />
        My To-Do List
	</div>
<div id="content">
<?php 
$j = 0;
while($j < $i)
{
	echo '<div class="todo"><div class="work"><button class="tick"></button><button class="del"></button>'.
	    $list[$j]['content'].'</div><div class="mdate">Last Modified: '.
		$list[$j]['c_date'].'</div><div class="ddate">Due Date: '.$list[$j]['d_date'].'</div></div>';
	$j++;
}
?>
</div>
<div id="dBar">
    <span id="user"><?php echo $name; ?></span><br />
    <a href="edit_profile.php">Edit Profile</a><br />
    <a href='log_out.php'>Log out</a>
</div>
<button id="add">
    +
</button>
</body>
<script>
var ids = [];
var marked = [];
<?php
$j = 0;
while($j < $i)
{
	echo 'ids['.$j.'] = '.$list[$j]['todo_id'].';';
	echo 'marked['.$j.'] = '.$list[$j]['done'].';';
	$j++;
}
?>
</script>
<script src="jquery-3.3.1.min.js"></script>
<script src="script.js"></script>
</html>