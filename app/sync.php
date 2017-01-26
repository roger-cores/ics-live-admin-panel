<?php

	$uploadDir = dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'uploads';
	
	$var = json_decode(file_get_contents('php://input'));


	function traverseFiles($uploadDir, $var){
		
		$totalDownloadableSize = 0;

		$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($uploadDir, RecursiveDirectoryIterator::SKIP_DOTS), RecursiveIteratorIterator::SELF_FIRST);
		$filesOnServer = array();
		foreach ($iterator as $file => $object){
			if(!is_dir($object->getPathname()))
				array_push($filesOnServer, $object->getPathname());
		}

		

		foreach ($var->files as $file){
			$filePath = $uploadDir . DIRECTORY_SEPARATOR . $file->path;
			if(file_exists($filePath)){
				$modifiedDateOnClient =  \DateTime::createFromFormat("d:m:Y:H:i:s", $file->modified);
				$modifiedDateOnServer = new DateTime();
				$modifiedDateOnServer->setTimestamp(filemtime($filePath));
				
				if(($modifiedDateOnClient < $modifiedDateOnServer) || $file->size != filesize($filePath)){
					$file->action="u";
					$file->filesize = filesize($filePath);
					$totalDownloadableSize += $file->filesize;
				} else {
					$key = array_search($file, $var->files);
					if($key!==false){
						unset($var->files[$key]);
					}
				}
			} else {
				$file->action = "d";
			}
			
			$key = array_search($filePath,$filesOnServer);
			$file->key = $key;
			if($key!==false){
			    unset($filesOnServer[$key]);
			}

			
			
		}



		foreach ($filesOnServer as $fp){
			$newFile = (object) array();
			$arr = explode($uploadDir. DIRECTORY_SEPARATOR, $fp);
			$newFile->path = $arr[1];
			$newFile->action = "u";
			$newFile->filesize = filesize($fp);
			$totalDownloadableSize += $newFile->filesize;
			array_push($var->files, $newFile);
		}

		$var->totalSize = $totalDownloadableSize;
	}

	
	
	traverseFiles($uploadDir, $var);

	$temp = array_values($var->files);
	$var->files = $temp;

	header('Content-Type: application/json');
	echo json_encode($var);

?>
