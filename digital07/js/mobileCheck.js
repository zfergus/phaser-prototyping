/* Checks if the game is being played on a mobile device.      */
/* Returns a boolean for if the browser is on a mobile device. */
mobileCheck: function()
{
	var check = false;
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
	{
		check = true;
	}		
	return check;
}