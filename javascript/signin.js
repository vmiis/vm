//---------------------------------------------
$vm.signin=function(){
	if($vm.user_name=='guest'){
		window.open($vm.api_address+"/signin.html?db=dev","Sign In","width=600, height=700");
	}
}
//---------------------------------------------
$vm.signout=function(){
	$vm.clear_token();
	sessionStorage["signinout"]=1;
	location.reload(true);
}
//---------------------------------------------
