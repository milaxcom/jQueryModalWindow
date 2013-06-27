<?
header("Content-type: application/json; charset=utf-8");

$data = array(
	"data"	=> "html",
	"info"	=> "about json",
	"html"	=> "..come content.."
);

echo json_encode( $data );


?>