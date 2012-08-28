var RandomUser = function() {
	var names = []
	$.get('js/names.txt', function(data) {
		data.split('\n').forEach(function(name) {
			names.push(name)
		})
		generateUsers()
	})
	var users = []
	var generateUsers = function() {
		var kv = function(a, b) {
			return {"Key":a,"Value":b} 
		}
		
		var random = function(max) {
			max = max || names.length
			return parseInt(Math.random() * max)
		}
		
		for (x=0;x<700;x=x+1) {
			var article = {
				"__CreatedBy": "Strento",
				"__SchemaType": "User"
			}
			
			// load the billion properties
			
			var fullName = names[random()] + ' ' + names[random()];
			
			var p = []
			p.push(kv("Name",fullName))
			p.push(kv("Gender",["Male","Female"][random(2)]))
			p.push(kv("DOB","1990-05-31"))
			p.push(kv("Occupation",["Student","Engineer","Doctor","Lawyer","Chef"][random(5)]))
			p.push(kv("Blood_Group","O"))
			
			p.push(kv("Address","403, Viman Pride, Near Dutta Mandir Chowk, Viman Nagar "))
			p.push(kv("City","Pune"))
			p.push(kv("Telephone_Number","9887214405"))
			p.push(kv("Mobile_Number","020987654"))
			p.push(kv("Email_Id",fullName.replace(/ /g, '').toLowerCase() + '@gmail.com'))
			
			p.push(kv("Insurer",["LIC","Max New York Life", "Apollo Munich","Birla Sun Life"][random(4)]))
			p.push(kv("Insurance_Id",random(10000)))
			p.push(kv("Insurance_Type",["PI","PPO","HMO","POS"][random(4)]))
			p.push(kv("Eff_Date","2000-10-01"))
			p.push(kv("Term_Date","2020-10-01"))
			
			article.__Properties = p

			Gossamer.storage.articles.create(deploymentId, 'User', article, function(article) {
				console.log('Created: ' + article.__Properties[0].Value)
			})
			
			users.push(article)
		}
		
		console.dir(users)
	}
}
