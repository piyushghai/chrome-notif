function show()
{
	console.log("Inside JS file");
document.getElementById('container').style.display = 'block';
document.getElementById('image').src = '/ic_launcher.png';
document.getElementById('title').textContent = 'Hello';
document.getElementById('desc').textContent = 'Via ';
document.getElementById('message').textContent = 'Hello From Mars';
}

show();