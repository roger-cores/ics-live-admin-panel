<?php

if ( !empty( $_FILES ) ) {

    $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
    $noteId = $_POST["name"];
    if(!file_exists(dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $noteId)){
		mkdir(dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $noteId, 0777);
	}

	$uploadPath = dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $noteId . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];
    $uploadDir = dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $noteId;
    echo $uploadPath;
    echo $_FILES['fileToUpload']['temp_name'];
    if(move_uploaded_file( $tempPath, $uploadPath )){
    	echo 'yes';
    	$zip = new ZipArchive();
    	$x = $zip->open($uploadPath);
    	if($x == true){
    		$zip->extractTo($uploadDir);
    		$zip->close();

    		unlink($uploadPath);
    	}

    }else{
    	echo 'no';
    }

    $answer = array( 'answer' => 'File transfer completed' );
    $json = json_encode( $answer );

    echo $json;

} else {

    echo 'No files';

}

?>
