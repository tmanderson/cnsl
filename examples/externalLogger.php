<?php
	//EXTERNAL LOGGER
	if(isset($_POST['msg']) && !empty($_POST['msg'])) {
		$msg = json_decode(stripslashes($_POST['msg']));
		file_put_contents('./log.txt', "{$msg->type}: {$msg->text}\n", FILE_APPEND);
	}
?>