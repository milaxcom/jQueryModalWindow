<?$s=mb_split("/",$_SERVER["SCRIPT_NAME"] );$d="dev";$f=array_pop($s);define("__URL__","http://".$_SERVER["HTTP_HOST"].mb_ereg_replace("{$d}/{$f}","",$_SERVER["SCRIPT_NAME"]));unset($s,$d,$f);?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>

<head>
<title>jQuery Modal Window || LaoSun work place</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<script type="text/javascript" src="<?=__URL__;?>lib/jquery-1.10.1.js"></script>
<script type="text/javascript" src="<?=__URL__;?>dev/jqmodalwin-1.2.js"></script>
</head>
<body>
<?
//require("temp.php");
?>
<script>

	$.ModalWin({
		id				: "example-window-1",
		html			: "sample html",
		url				: "sample_html.php",
		"top-space"		: "50px",
		"bottom-space"	: "40px",
		"shadow"		: {						
			"opacity" 			: 0.3,		
			"animate-opacity"	: 0,		
			"animate-show"		: 500,		
			"animate-hide"		: 500,		
			"background" 		: "#F0F",	
			"close"				: true
		}
	});
	
	$.ModalWin({});
	
</script>
</body>
</html>