class RecipesPage extends PageManager{

  constructor(container, adapter){
    super(container)
    this.adapter = new RecipeAdapter(adapter)
    this.recipe = null
    this.ingredients = null
  }

/* ---- Bindings and Event Listeners ---- */
    // Don't need initial bindings and listeners
    initBindingsAndEventListeners(){
      return null
    }

    // Bind and listen after all recipes load
    allRecipesBindingsAndEventListeners(){
      // debugger
      const newButton = this.container.querySelector('#new-button')
      const table = this.container.querySelector('table')

      newButton.addEventListener('click', this.handleNewClick.bind(this))
      table.addEventListener('click', this.handleTableClick.bind(this))
    }

    // Bind and listen after single recipe load
    recipeBindingsAndEventListeners(){
      this.recipeEditLink = this.container.querySelector('a#edit')
      this.recipeDeleteLink = this.container.querySelector('a#delete')

      this.recipeEditLink.addEventListener('click', this.handleRecipeEditClick.bind(this))
      this.recipeDeleteLink.addEventListener('click', this.handleRecipeDeleteClick.bind(this))
    }

    // Bind and listen after form load
    recipeFormBindingsAndEventListeners(){
      this.form = this.container.querySelector('form')
      const cancelButton = this.container.querySelector('#cancel')
  
      // Set listener based on form id
      if (this.form.id === "new-recipe-form") {   
        this.form.addEventListener('submit', this.handleNewSubmitClick.bind(this))
      }else{ 
        this.form.addEventListener('submit', this.handleUpdateSubmitClick.bind(this))
      }
  
      // this.form.addEventListener('submit', this.handleNewSubmitClick.bind(this))
      cancelButton.addEventListener('click', this.handleCancelClick.bind(this))
    }


/* ---- Link/Click Handlers ---- */
    // Handle new click
    handleNewClick(e){
      e.preventDefault()
      console.log('new clicked!');
      this.renderNewForm()
    }

    // Handle show, edit, and delete within recipe table
    handleTableClick(e){
      e.preventDefault()

      // Get recipe id and recipe object
      const recipeId = e.target.dataset.id
      // this.recipe = this.recipes.find(r => r.id == recipeId)
      this.recipe = this.getRecipeById(recipeId)
      

      // console.log(recipeId)
      // console.log(this.recipe)

      switch (e.target.id) {
        case 'show':
          // console.log(this.recipe)
          // this.redirect('recipes')
          this.renderRecipe()
          break;
        case 'edit':
          console.log('edit clicked!');
          this.renderEditForm(recipeId)
          break;
        case 'delete':
          this.deleteRecipe(recipeId)
          break;
        default:
          console.log('Invalid item');
          break;
      }

      // console.log(e.target.parentNode.parentNode.parentNode)
    }

    // Handle detail recipe edit
    handleRecipeEditClick(e){
      e.preventDefault()
      // Get recipe id and recipe object
      const recipeId = e.target.parentNode.dataset.id
      this.renderEditForm(recipeId)
    }

    // Handle detail recipe delete
    handleRecipeDeleteClick(e){
      e.preventDefault()
      // Get recipe id and recipe object
      const recipeId = e.target.parentNode.dataset.id
      this.deleteRecipe(recipeId)
    }

    // Handle form submit
    handleNewSubmitClick(e){
      e.preventDefault()
      console.log("Submitting new recipe.")
      // this.createRecipe(e)
    }

    // Handle form update submit
    handleUpdateSubmitClick(e){
      e.preventDefault()
      console.log("Submitting update.")
      // this.updateRecipe(e)
    }


/* ---- Fetchers and Renderers ---- */

  // Fetch recipes and render main recipes page
  async fetchAndRenderPageResources(){
    try{
      // if (this.recipe){
      //   // const recipeObj = await this.adapter.getRecipe()
      //   // // console.log(recipeObj)
      //   // this.recipe = new Recipe(recipeObj)
      //   // // console.log(this.recipe)
      //   this.renderRecipe()
      // } else {
      const recipeObj = await this.adapter.getRecipes()
      console.log(recipeObj.recipes)

      this.recipes = recipeObj.recipes.map(recipe => new Recipe(recipe))
      // console.log(this.recipes)

      // Render table
      this.renderRecipes()

    }catch(err){
      console.log(err)
      this.handleError(err)
      // console.log(err)
    }
  }


  // Render new form
  async renderNewForm(){
    const recipe = new Recipe({'recipe': {id:'', name:'', servings:'', total_cost:'', cost_per_serving:''}, 'ingredients':[]})

    // Get all ingredients for select list
    // Send request for all ingredients
    const ingAdapter = new IngredientAdapter(new BaseAdapter())
    const ingObj = await ingAdapter.getIngredients()
    // Fill this.ingredients with ingredient objects
    this.ingredients = ingObj.ingredients.map(ing => new Ingredient(ing))

    // Render form with ingredients
    this.container.innerHTML = recipe.recipeForm(this.ingredients)
    this.recipeFormBindingsAndEventListeners()
  }

  // Render edit form
  async renderEditForm(recipeId){
    // console.log(recipeId)

    // Place in try catch?
    // const foundRecipe = this.recipes.find(r => r.id == recipeId)
    // const foundRecipe = this.getRecipeById(recipeId)
    
    // Set this.recipe to edit

    // console.log(this.recipe.id)

    // console.log(recipeId)
    // console.log(this.recipe)

  
    // if id matches this.recipe.id, display edit form
    // if(foundRecipe && foundRecipe.id === this.recipe.id){

    // Find existing recipe by id
    const foundRecipe = this.getRecipeById(recipeId)

    // If recipe from id exists, render form and call new bindings and event listeners
    if (foundRecipe) {
      console.log("Real recipe!")
      console.log(foundRecipe)

      // Send request for all ingredients
      const ingAdapter = new IngredientAdapter(new BaseAdapter())
      const ingObj = await ingAdapter.getIngredients()
      // Fill this.ingredients with ingredient objects
      this.ingredients = ingObj.ingredients.map(ing => new Ingredient(ing))

      this.recipe = foundRecipe
      this.container.innerHTML = foundRecipe.recipeForm(this.ingredients)
      this.recipeFormBindingsAndEventListeners()
    }else{
      // else throw error
      this.handleError({
        type: "danger",
        msg: "Recipe was not found"
      })
    }
  }

    // handleRecipeDelete(recipeId){
    //   // console.log(recipeId)
    // }


    // // Go to edit recipe screen
    // handleEditClick(e){
    //   e.preventDefault()
    //   this.redirect('edit-recipe')
    // }

// Render single recipe
renderRecipe(recipe = this.recipe){
  if(recipe){
      // console.log(this.recipe)
      this.recipe = recipe
      this.container.innerHTML = this.recipe.showRecipe
      this.recipeBindingsAndEventListeners()
  }else{
      this.handleError({
        type: "danger",
        msg: "Recipe was not found"
      })
  } 
}

// Render multiple recipes
renderRecipes(){
  const title = "<h1>Recipes</h1>"

  const addButton = `<div class="mt-3 mb-3" id="new-resource">${this.renderNewBtn()}</div>`

  const tableTop = `
  <table class="table table-striped">
  <thead class="thead-dark">
    <tr>
      <th>Name</th>
      <th>Cost</th>
      <th>Links</th>
    </tr>
  </thead>
  <tbody>`

  const tableBottom = `
    </tbody>
  </table>
  `
  let recipeRows = this.recipes.map(recipe => recipe.showRecipeTr).join('')

  // Stitch together title, button, table, rows
  // this.container.innerHTML = title + addButton + tableTop + recipeRows + tableBottom
  this.container.innerHTML = title + addButton + tableTop + recipeRows + tableBottom

  // Bind and listen to new html
  this.allRecipesBindingsAndEventListeners()
}


// Render initial html. Use "loader" to display loading spinner.
get staticHTML(){
  return (`
    <div class="loader">
    </div>
  `)
}


/* ---- Update Database and Display ---- */
    // If real recipe, delete from this.recipes
    async deleteRecipe(id){
      // Find existing recipe by id
      const foundRecipe = this.getRecipeById(id)

      // If recipe from id exists, render form and call new bindings and event listeners
      if (foundRecipe) {
        // Find index of recipe to remove
        const recipeIndex = this.recipes.findIndex(recipe => recipe.id === foundRecipe.id)

        // Remove recipe and save it, in case error later
        const savedRecipe = this.recipes.splice(recipeIndex, 1)
        // console.log(savedRecipe)

        // Remove recipe from this.recipes
        // this.recipes = this.recipes.filter(r => r.id !== foundRecipe.id)
        console.log("New Recipes")
        console.log(this.recipes)
        // set this.recipes

        // console.log("Saved Recipe")
        // console.log(savedRecipe)
        
        // Optimistically render new recipe list
        this.renderRecipes()


      // findByIndex to get index
      // Use index to save to this.recipes
      // const oldRecipe = 
      // Use splice to remove from this.recipes
      
        try{
          const resp = await this.adapter.deleteRecipe(id)
  
          // Alert user of success
          this.handleAlert({
            type: "success",
            msg: "Recipe deleted"
          }) 
        }catch(err){
          // If failure, rerender list without db call, keeping recipe in same array location
          this.recipes[recipeIndex] = savedRecipe
          this.recipes = this.recipes.flat()
          console.log("Old recipe pushed back")
          console.log(this.recipes)

          this.renderRecipes()
          this.handleError(err)
        }
      }else{
        // Else show recipt not found
        this.handleError({
          type: "danger",
          msg: "Recipe was not found"
        })
      }
    }


    // cloneObject(obj) {
	  //   var clone = {};
	  //   for(var i in obj) {
	  //       if(obj[i] != null &&  typeof(obj[i])=="object")
	  //           clone[i] = this.cloneObject(obj[i]);
	  //       else
	  //           clone[i] = obj[i];
	  //   }
	  //   return clone;
	  // }


    // Handle form submit
    async updateRecipe(e){
      e.preventDefault()

// console.log(e.target.querySelectorAll('input'))

      // Set recipe variables for params
      // const [id, name, servings, recipe_ingredients_attributes] = Array.from(e.target.querySelectorAll('input')).map(i => i.value)

      const id = e.target.querySelector('input[name="recipe-id"]').value
      const name = e.target.querySelector('input[name="name"]').value
      const servings = e.target.querySelector('input[name="servings"]').value

      // console.log(id)
      // console.log(name)
      // console.log(servings)
      
      
      // query select for tag
      // query select all for rest

      // Get form ingredients and map to array
      const formIngArray = Array.from(e.target.querySelectorAll('div.form-ingredient'))
      let recipeIngredientsAttributes = formIngArray.map(el => {
        let s = el.querySelector('select')
        let ingAmount = el.querySelector('input.ingredient_amount').value
        let ingUnit = el.querySelector('input.ingredient_unit').value
        //recipeIngredientId
        return {
          ingredient_id: s.options[s.selectedIndex].value,
          ingredient_amount: ingAmount,
          ingredient_unit: ingUnit,
          _destroy: 0
        }
      })
      console.log(recipeIngredientsAttributes)

      // recipe_ingredients_attributes: {
      //   0: {ingredient_id: 13, ingredient_amount:5, ingredient_unit:"lb", _destroy: 1, id: 11}, 

      // Set params
      const params = { name, servings, recipeIngredientsAttributes, id }
      console.log(params)


      // Establish recipe object and set old data
      // const recipe = this.getRecipeById(id)
      // const oldRecipe = new Recipe({id, name, servings, totalCost, costPerServing, ingredients})
      // const oldRecipe = new Recipe({id, name, servings, recipe_ingredients_attributes})
      // const oldRecipe = this.getRecipeById(id)

      // Set params and optimistically render
      // recipe.name = name
      // recipe.servings = servings
      // recipe.ingredients = recipeIngredientsAttributes
      // this.renderRecipe(recipe)

      // Send fetch. If error, reset this.recipe to old 
      try{
          const resp = await this.adapter.updateRecipe(params)
          // const {name, servings, recipeIngredientsAttributes, id} = await this.adapter.updateRecipe(params)
          console.log("Successful patch request!")
          
          this.recipe = new Recipe(resp)
          console.log(this.recipe)
          // this.recipes.This.remove()

          // let updatedRecipe = this.getRecipeById(id)


      }catch(err){
          // this.recipe.name = oldRecipe.name
          // this.recipe.servings = oldRecipe.servings
          // this.recipe.totalCost = oldRecipe.totalCost
          // this.recipe.costPerServing = oldRecipe.costPerServing
          // this.recipe.ingredients = oldRecipe.ingredients
          // console.log("Old Recipe!")
          // console.log(oldRecipe)
          this.renderRecipe()
          this.handleError(err)
      }
      
  }

  // Create new recipe
  async createRecipe(e){     
    e.preventDefault()

    // Set params based on input
    const name = e.target.querySelector('input[name="name"]').value
    const servings = Number(e.target.querySelector('input[name="servings"]').value)

    // Take action if servings is a number
    if (!isNaN(servings)){ 

      // Get form ingredients and map to array
      const formIngArray = Array.from(e.target.querySelectorAll('div.form-ingredient'))
      let recipeIngredientsAttributes = formIngArray.map(el => {
        let s = el.querySelector('select')
        let ingAmount = el.querySelector('input.ingredient_amount').value
        let ingUnit = el.querySelector('input.ingredient_unit').value
        //recipeIngredientId
        return {
          ingredient_id: s.options[s.selectedIndex].value,
          ingredient_amount: ingAmount,
          ingredient_unit: ingUnit,
          _destroy: 0
        }
      })
      console.log(recipeIngredientsAttributes)

      // recipe_ingredients_attributes: {
      //   0: {ingredient_id: 13, ingredient_amount:5, ingredient_unit:"lb", _destroy: 1, id: 11}, 

      // Set params
      const params = { name, servings, recipeIngredientsAttributes }
      console.log(params)

      // Alert user submitting
      this.handleAlert({
        type: "info",
        msg: "Submitting recipe to server..."
      }) 

      // Try creating resource
      try{
        const resp = await this.adapter.updateRecipe(params)

        // const {name, servings, recipeIngredientsAttributes, id} = await this.adapter.updateRecipe(params)
        
        console.log("Successful patch request!")
        
        this.recipe = new Recipe(resp)
        console.log(this.recipe)

        // Add Recipe to this.recipes and sort alphabetically
        // this.recipes.push(newRecipe)
        // this.recipes.sort((a, b) => {
        //   if (a.name < b.name) //sort string ascending
        //       return -1 
        //   if (b.name > a.name)
        //       return 1
        //   return 0 //default return value (no sorting)
        // })

        this.renderRecipe()

        // Alert user of success
        this.handleAlert({
          type: "success",
          msg: "Recipe created!"
        }) 

      }catch(err){
        // If failure, leave form and give error alert
        this.handleError(err)
      }
    }else{
      // Display error and highlight field if servings isn't a number
      this.handleError({
        type: "danger",
        msg: "Ensure Servings is a number"
      })      
      this.form.querySelector('input#servings').classList.add("is-invalid")
    }
  }



/* ---- Helpers ---- */
  // Grab recipe object from id
  getRecipeById(id){
    return this.recipes.find(r => r.id == id)
  }

  // Button HTML
  renderNewBtn(){
    return (`
      <a class="btn btn-primary" href="#" role="button" id="new-button">Add new recipe</a>
    `)
  }    

}