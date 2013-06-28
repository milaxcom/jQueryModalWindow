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
<style>
	
	html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {margin: 0; padding: 0; border: 0; vertical-align: baseline;}
	
	/* A */
 
	html {width:100%; height:100%;}
 * {font-size: 14px; font-family: "Helvetica Neue", Arial, Tahoma !important; line-height: 1.4; }
	body {padding:0;margin:0;height:100%;background-color: #fafafa; text-align: center;}
	
</style>
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