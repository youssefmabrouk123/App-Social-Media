http://localhost:8080/auth/signup
{
    "firstname":"ala",
    "lastname":"ahmed",
    "email":"userr@ensit.u-tunis.tn",
    "password":"azerty123456"
    "role":"USER"
}

http://localhost:8080/auth/signin
{
    "email":"userr@ensit.u-tunis.tn",
    "password":"azerty123456"
}
-----------------------
    	@PostMapping("/pub/publish")
http://localhost:8080/user/pub/publish
{
    "content":"111111111111111"
}

	@PutMapping("/pub/{id}")
http://localhost:8080/user/pub/{id}
{
    "content":"azeazrfqsfqs132"
}
	@DeleteMapping("/pub/{id}")
http://localhost:8080/user/pub/{id}
