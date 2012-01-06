<?php
		
	include('XMPPHP/XMPP.php');
	
	//EXTERNAL LOGGER
	if(isset($_POST['msg']) && !empty($_POST['msg']) && isset($_POST['jid']) && !empty($_POST['jid'])) {
		$msg = json_decode(stripslashes($_POST['msg']));
		$message_body = $msg->type .' : '. $msg->text;
		$jid = stripslashes($_POST['jid']);
				
		$conn = new XMPPHP_XMPP('jabber.org', 5222, 'cnsl@jabber.org', 'cnsluser', 'cnsl');
		$conn->connect();
		$conn->processUntil('session_start');
		$conn->message($jid, $message_body);
		$conn->disconnect();
		
		echo 'ok';
	}
?>