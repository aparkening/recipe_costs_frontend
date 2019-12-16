

// Grab and parse cookie
function getCookie(name) {
  if (!document.cookie) {
    return null;
  }

  const xsrfCookies = document.cookie.split(';')
    .map(c => c.trim())
    .filter(c => c.startsWith(name + '='));

  if (xsrfCookies.length === 0) {
    return null;
  }

  return decodeURIComponent(xsrfCookies[0].split('=')[1]);
}

const url = 'http://localhost:3000/users'

// get csrf token
const csrfToken = getCookie('CSRF-TOKEN');

// Fetch with token
const res = await fetch(url, {
  method: 'GET',
  headers: {
    "Accept": "application/json", 
    "Content-Type": 'application/json',
    'X-XSRF-TOKEN': csrfToken
  },
	credentials: 'include'
})







// Test login Post
fetch('http://localhost:3000/api/v1/users/signup', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Jamie Oliver',
    password: 'testing123',
    email: 'jamie@testing.com'
  }),
  headers: {
    "Accept": "application/json", 
    "Content-Type": 'application/json'
  }
})
.then(res => res.json())
.then(console.log)


fetch('http://localhost:3000/api/v1/users/signup', {
  method: 'POST',
  body: JSON.stringify({
    user: {
      name: 'Test user',
      email: 'user@example.com',
      password: 'testing123',
      password_confirmation: 'testing123', 
      admin: 'true', 
      organization: 'The Culinary Institute of America'
    }
  }),
  headers: {
    "Accept": "application/json", 
    "Content-Type": 'application/json'
  }
})
.then(res => res.json())
.then(console.log)




// Test Get
fetch('http://localhost:3000/api/v1/login', {
  method: 'GET',
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  }
})
.then(res => res.json())
.then(console.log)


// Test logout
fetch('http://localhost:3000/api/v1/login', {
  method: 'DELETE',
  body: JSON.stringify({
    session: 'Jamie Oliver',
    password: 'testing123'
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
.then(res => res.json())
.then(console.log)



async dispatchGetRequest(url){
  try {
    const res = await fetch(url, {
      method: 'GET',
      this.getHeaders,
      credentials: "include"
    })
    if(res.status < 200) || res.status > 300) throw new Error(res.statusText || res.status)
    return await res.json()
  } catch(e) {
    return `${e}`
  }
}


get getHeaders() {
  return {
    "Accept": 'application/json',
    "X-HANDSHAKE-TOKEN": token
  }

}



// Make new recipe
fetch('http://localhost:3000/api/v1/recipes', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Purple Bread',
    servings: 9
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
.then(res => res.json())
.then(console.log)



// New recipe with ingredients
fetch('http://localhost:3000/api/v1/recipes', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Green Bread',
    servings: 9,
    recipe_ingredients_attributes: {
      0: {ingredient_id: 13, ingredient_amount:5, ingredient_unit:"lb", _destroy: 0}, 
      1: {ingredient_id: 21, ingredient_amount:1, ingredient_unit:"oz", _destroy: 0}, 
      2: {ingredient_id: 16, ingredient_amount:1, ingredient_unit:"lb", _destroy: 0}, 
    }
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
.then(res => res.json())
.then(console.log)



// New recipe with ingredients
fetch('http://localhost:3000/api/v1/recipes', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Green Bread',
    servings: 9,
    recipe_ingredients_attributes: {
      0: {ingredient_id: 13, ingredient_amount:5, ingredient_unit:"lb", _destroy: 0}, 
      1: {ingredient_id: 21, ingredient_amount:1, ingredient_unit:"oz", _destroy: 0}, 
      2: {ingredient_id: 16, ingredient_amount:1, ingredient_unit:"lb", _destroy: 0}, 
    }
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
.then(res => res.json())
.then(console.log)


// Update recipe with ingredients
fetch('http://localhost:3000/api/v1/recipes/37', {
  method: 'PATCH',
  body: JSON.stringify({
    name: 'Green Bread',
    servings: 6,
    recipe_ingredients_attributes: {
      0: {ingredient_id: 13, ingredient_amount:5, ingredient_unit:"lb", _destroy: 1, id: 11}, 
      1: {ingredient_id: 21, ingredient_amount:1, ingredient_unit:"oz", _destroy: 0, id: 12}, 
      2: {ingredient_id: 16, ingredient_amount:1, ingredient_unit:"lb", _destroy: 0, id: 13}, 
      3: {ingredient_id: 18, ingredient_amount:12, ingredient_unit:"oz", _destroy: 0, id: 14},
    }
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
.then(res => res.json())
.then(console.log)

// Update recipe with ingredients
fetch('http://localhost:3000/api/v1/recipes/37', {
  method: 'DELETE',
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
.then(res => res.json())
.then(console.log)

// Get recipe
fetch('http://localhost:3000/api/v1/recipes/37', {
  method: 'GET',
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
.then(res => res.json())
.then(console.log)

// Get all recipes
fetch('http://localhost:3000/api/v1/recipes', {
  method: 'GET',
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
.then(res => res.json())
.then(console.log)




// New ingredient
fetch('http://localhost:3000/api/v1/ingredients', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Apple Sauce',
    cost: 10.00,
    cost_size: 1,
    cost_unit: "lb"
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
.then(res => res.json())
.then(console.log)

// Get all ingredients
fetch('http://localhost:3000/api/v1/ingredients', {
  method: 'GET',
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
.then(res => res.json())
.then(console.log)


// Update ingredient
fetch('http://localhost:3000/api/v1/ingredients/25', {
  method: 'PATCH',
  body: JSON.stringify({
    name: 'Apple Sauce',
    cost: 5.00,
    cost_size: 8,
    cost_unit: "oz"
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
.then(res => res.json())
.then(console.log)


// Delete ingredient
fetch('http://localhost:3000/api/v1/ingredients/25', {
  method: 'DELETE',
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
.then(res => res.json())
.then(console.log)