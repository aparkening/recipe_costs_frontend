class RecipePage extends PageManager{

// This page handles individual recipe 
// - Reading
// - Creating
// - Updating

  constructor(container, adapter){
    super(container)
    this.adapter = new RecipeAdapter(adapter)
    this.recipe = null
    this.ingredients = null
    this.currentOjb = null
  }


/* ---- Bindings and Event Listeners ---- */
  // Don't need initial bindings and listeners
  initBindingsAndEventListeners(){
    return null
  }

  // Bind and listen after single recipe load
  readBindingsAndEventListeners(){
    this.recipeEditLink = this.container.querySelector('a#edit')
    this.recipeDeleteLink = this.container.querySelector('a#delete')

    this.recipeEditLink.addEventListener('click', this.handleRecipeEditClick.bind(this))
    this.recipeDeleteLink.addEventListener('click', this.handleRecipeDeleteClick.bind(this))
  }

  // Bind and listen after new form load
  newFormBindingsAndEventListeners(){
    this.form = this.container.querySelector('form')
    this.ingFields = this.form.querySelector('#ingredients')
    const cancelButton = this.form.querySelector('#cancel')
    const addBadge = this.form.querySelector('#add-ingredient')

    // Delete and add new ingredients
    this.ingFields.addEventListener('click', this.handleDeleteIngFieldsClick.bind(this))    
    addBadge.addEventListener('click', this.handleAddIngFieldsClick.bind(this))
    
    // Cancel and submit clicks
    cancelButton.addEventListener('click', this.handleCancelClick.bind(this))
    this.form.addEventListener('submit', this.handleNewSubmitClick.bind(this))   
  }

  // Bind and listen after edit form load
  editFormBindingsAndEventListeners(){
    this.form = this.container.querySelector('form')
    this.ingFields = this.form.querySelector('#ingredients')
    const cancelButton = this.form.querySelector('#cancel')
    const addBadge = this.form.querySelector('#add-ingredient')

    // Delete existing ingredient

          
    // Delete and add new ingredients follow existing pattern
    this.ingFields.addEventListener('click', this.handleDeleteIngFieldsClick.bind(this))
    addBadge.addEventListener('click', this.handleAddIngFieldsClick.bind(this))

    // Cancel and submit clicks
    cancelButton.addEventListener('click', this.handleCancelClick.bind(this))
    this.form.addEventListener('submit', this.handleUpdateSubmitClick.bind(this))
  }


/* ---- Link/Click Handlers ---- */

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
    this.createRecipe(e)
  }

  // Handle form update submit
  handleUpdateSubmitClick(e){
    e.preventDefault()
    console.log("Submitting update.")
    this.updateRecipe(e)
  }

  // Handle form cancel button
  handleCancelClick(e){
    e.preventDefault()
    // this.newContainer.innerHTML = this.renderNewBtn()
    // this.indexBindingsAndEventListeners()
    this.redirect('recipes')
  }

  // Handle delete ingredients within recipe form
  handleDeleteIngFieldsClick(e){
    e.preventDefault()

    // If no recipe_ingredient id, simply remove
    if(e.target.tagName === "A" && e.target.classList.contains('delete')){
      e.target.parentNode.parentNode.remove()
    }
  }

  // Handle add ingredients within recipe form
  handleAddIngFieldsClick(e){
    e.preventDefault()
    if(e.target.tagName === "A"){

      // Build new div
      let newRow = document.createElement('div')
      newRow.innerHTML = this.recipe.renderIngRow(this.ingredients, this.units)

      // Append div to ingredient fields container
      this.ingFields.appendChild(newRow)
    }
  }


/* ---- Fetchers and Renderers ---- */
  async fetchAndRenderPageResources(){
    // Single recipe
    try{
      console.log(this)

      const recipeObj = await this.adapter.getRecipe()
      // console.log(recipeObj)

      this.recipe = new Recipe(recipeObj)
      // console.log(this.recipe)

      this.renderRecipe()

    }catch(err){
        // this.handleError(err)
        console.log(err)
    }
  }

  // Render single recipe
  renderRecipe(recipe = this.recipe){
    if(recipe){
      // console.log(this.recipe)
      this.recipe = recipe
      this.container.innerHTML = this.recipe.showRecipe
      this.readBindingsAndEventListeners()
    }else{
      this.handleError({
        type: "danger",
        msg: "Recipe was not found"
      })
    } 
  }

  // Render new form
  async renderNewForm(){
    this.recipe = new Recipe({'recipe': {id:'', name:'', servings:'', total_cost:'', cost_per_serving:''}, 'ingredients':[]})

    // Get all ingredients for select list
    // Send request for all ingredients
    const ingAdapter = new IngredientAdapter(new BaseAdapter())
    const ingObj = await ingAdapter.getIngredients()
    // Fill this.ingredients with ingredient objects
    this.ingredients = ingObj.ingredients.map(ing => new Ingredient(ing))
    this.units = ingObj.units

    // Render form with ingredients
    this.container.innerHTML = this.recipe.recipeForm(this.ingredients, this.units)
    this.newFormBindingsAndEventListeners()
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
      this.units = ingObj.units

      // Render form with ingredients
      this.recipe = foundRecipe
      this.container.innerHTML = foundRecipe.editRecipeForm(this.ingredients, this.units)
      this.editFormBindingsAndEventListeners()
    }else{
      // else throw error
      this.handleError({
        type: "danger",
        msg: "Recipe was not found"
      })
    }
  }


  // Render initial html. Use "loader" to display loading spinner.
  get staticHTML(){

    this.currentObj


    return (`
      <div class="loader">
      </div>
    `)
  }


/* ---- Update Database and Display ---- */


  // If real recipe, delete from this.recipes

/* *** Deal with this.recipes */

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

  // Handle form submit
  async updateRecipe(e){
    e.preventDefault()

    const id = e.target.querySelector('input[name="recipe-id"]').value
    const name = e.target.querySelector('input[name="name"]').value
    const servings = e.target.querySelector('input[name="servings"]').value    
    
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
    // const servings = Number(e.target.querySelector('input[name="servings"]').value)
    const servings = e.target.querySelector('input[name="servings"]').value

    // Take action if servings is a number
    // if (!isNaN(servings)){ 

      // Get form ingredients and map to array
      const formIngArray = Array.from(e.target.querySelectorAll('div.form-ingredient'))
      
      let recipeIngredientsAttributes = formIngArray.map(el => {
        // Get ingredient id value from select list
        let sId = el.querySelector('select[name="ingredient_id"]')

        // Get ingredient amount from input
        let ingAmount = el.querySelector('input.ingredient_amount').value

        // Get ingredient unit value from select list
        let sUnit = el.querySelector('select[name="ingredient_unit"]')

        return {
          ingredient_id: sId.options[sId.selectedIndex].value,
          ingredient_amount: ingAmount,
          ingredient_unit: sUnit.options[sUnit.selectedIndex].value
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
        const resp = await this.adapter.createRecipe(params)

        // const {name, servings, recipeIngredientsAttributes, id} = await this.adapter.updateRecipe(params)
        
        console.log("Successful recipe creation!")
        console.log(resp)
        this.recipe = new Recipe(resp)
        console.log(this.recipe)

        // Add Recipe to this.recipes and sort alphabetically
        this.recipes.push(this.recipe)
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
        console.log(err)
        // If failure, leave form and give error alert
        this.handleError(err)
      }
    // }else{
    //   // Display error and highlight field if servings isn't a number
    //   this.handleError({
    //     type: "danger",
    //     msg: "Ensure Servings is a number"
    //   })      
    //   this.form.querySelector('input#servings').classList.add("is-invalid")
    // }
  }

/* ---- Helpers ---- */
  // Grab recipe object from id
  getRecipeById(id){
    return this.recipes.find(r => r.id == id)
  }

}