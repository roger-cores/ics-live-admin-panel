<?php
	require '../../php/php2/dbase.php';
	$obj = new CreateTableDemo();
	if($obj->createProductKeyTable()){
	 echo 'table created successfully';
	}else{
	 echo 'Error occured in creating the table';
	}

?>
