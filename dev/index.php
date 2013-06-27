<?$s=split("/",$_SERVER["SCRIPT_NAME"] );$d="dev";$f=array_pop($s);define("__URL__","http://".$_SERVER["HTTP_HOST"].mb_ereg_replace("{$d}/{$f}","",$_SERVER["SCRIPT_NAME"]));unset($s,$d,$f);?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>

<head>
<title>jQuery Modal Window || LaoSun work place</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<script type="text/javascript" src="<?=__URL__;?>lib/jquery-1.10.1.js"></script>
<script type="text/javascript" src="<?=__URL__;?>dev/ModalWin-1.2.js"></script>
<script type="text/javascript" src="<?=__URL__;?>dev/stuff/obj.DOM.js"></script>
</head>
<body style="height: 800px;">
<style type="text/css">
.modal-win {
	position:fixed;
	top:0;
	left:0;
	width:100%;
	height:100%;
	text-align:center;
	overflow:auto;
	z-index:10003;
	//position:absolute;
	//top:expression((document.getElementsByTagName("body")[0].scrollTop) + 'px');
}
	
.modal-win-container {
	position:relative;
	text-align:left;
	margin:0 auto;
	width:700px;
	background-color:#fff;
	z-index:5;
}
	
.modal-win-space-top {
	position:relative;
	width:100%;
	height:50px;
}
	
.modal-win-space-bottom {
	position:relative;
	width:100%;
	height:40px;
}
	
.modal-win-shadow {
	position: fixed;
	top:0;
	left:0;
	width:100%;
	height:100%;
	background-color:#000;
	opacity:0.4;
	z-index:10001;
	//position:absolute;
	//top:expression((document.getElementsByTagName("body")[0].scrollTop) + 'px');
	filter: alpha(opacity = 40);
}

#example-window-1{background-color:#fbf9b9;}
#example-window-1 p {padding:10px 60px; height: 900px;}
#example-window-2{width:300px; background-color:#b9e1fb;}
#example-window-2 p{padding:25px 30px;}
</style>
<div id="block"></div>
<?
//require("temp.php");
?>
<script>

	$.ModalWin({
		id	: "example-window-1",
		html: "11111"
	});
	
	$.ModalWin({
		id	: "example-window-2",
		html: "222222"
	});
	
</script>
</body>
</html>