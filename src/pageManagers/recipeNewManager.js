class RecipeNewPage extends PageManager{

  constructor(container, adapter){
    super(container)
    this.adapter = new RecipeAdapter(adapter)
    this.recipe = null
    this.ingredients = null
    this.currentObj = null
  }

/* ---- Bindings and Event Listeners ---- */  
  // Don't need initial bindings and listeners
  initBindingsAndEventListeners(){
    return null
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

/* ---- Link/Click Handlers ---- */

  // Handle form cancel button
  handleCancelClick(e){
    e.preventDefault()
    this.redirect('recipes')
  }

  // Handle form update submit
  handleUpdateSubmitClick(e){
    e.preventDefault()
    console.log("Submitting update.")
    this.updateRecipe(e)
  }

  // Handle delete ingredients within recipe form
  handleDeleteIngFieldsClick(e){
    e.preventDefault()

    // Only activate on href click
    if(e.target.tagName === "A"){ 
      Ingredient.deleteField(e)
    }
  }

  // Handle add ingredients within recipe form
  handleAddIngFieldsClick(e){
    e.preventDefault()

    // Only activate on href click
    if(e.target.tagName === "A"){

      // Build new ingredient div and append to ingredient fields container
      let newRow = document.createElement('div')
      newRow.innerHTML = this.recipe.renderIngRow(this.ingredients, this.units)
      this.ingFields.appendChild(newRow)
    }
  }



/* ---- Update Database and Display ---- */
  // Handle form submit
  async updateRecipe(e){
    // e.preventDefault()

    // Set recipe variables for inputs
    const id = e.target.querySelector('input[name="recipe-id"]').value
    const name = e.target.querySelector('input[name="name"]').value
    const servings = e.target.querySelector('input[name="servings"]').value

    // Set recipeIngredientsAttributes from each ingredient input
    let recipeIngredientsAttributes = Array.from(e.target.querySelectorAll('div.form-ingredient')).map(el => {
      let ingObj = {}
      let ingId = ''
      
      // If new ingredient, get id from select list. Else look for hidden inputs and set extra new object properties.
      if(el.classList.contains("new-ingredient")){
        // Get id from select list value
        let sId = el.querySelector('select[name="ingredient_id"]')
        ingId = sId.options[sId.selectedIndex].value

      }else{
        // Get hidden inputs
        ingId = Number(el.querySelector('input[name="ingredient_id"]').value)
        let id = Number(el.querySelector('input[name="recipe_ingredient_id"]').value)

        // Set destroy to hidden input value if it exists (if ingredient should be removed from database)
        let destroy = el.querySelector('input[name="destroy"]') ? Number(el.querySelector('input[name="destroy"]').value) : 0
      
        // Set id and destroy
        ingObj.id = id
        ingObj['_destroy'] = destroy
      }
      
      let ingAmount = el.querySelector('input.ingredient_amount').value
      // Get ingredient unit value from select list
      let sUnit = el.querySelector('select[name="ingredient_unit"]')

      // Set and return new object
      ingObj.ingredient_id = ingId
      ingObj.ingredient_amount = ingAmount
      ingObj.ingredient_unit = sUnit.options[sUnit.selectedIndex].value
      return ingObj
    })
    // console.log("Recipe Ingredients Attributes")
    // console.log(recipeIngredientsAttributes)

    // Set params for submission
    const params = { name, servings, recipeIngredientsAttributes, id }

    // Send fetch. If error, reset this.recipe to old 
    try{
      const resp = await this.adapter.updateRecipe(params)
      
      // Update this.recipe
      this.recipe = new Recipe(resp)
      console.log(this.recipe)

      // Send to recipe display when ready

/* Change */      
      // this.recirect('recipe', this.recipe)
      this.redirect('recipes')

    }catch(err){
      // this.renderRecipe()
      this.handleError(err)
/* Change */      
      // this.recirect('recipe', this.recipe)
      this.redirect('recipes')
    }  
  }


/* ---- Fetchers and Renderers ---- */  
  async fetchAndRenderPageResources(){
    // Display if object exists
    if (this.currentObj){
      // Set recipe from redirect obj  
      this.recipe = this.currentObj

      // Get all ingredients and ingredient units for form fields
      const ingAdapter = new IngredientAdapter(new BaseAdapter())
      const ingObj = await ingAdapter.getIngredients()

      // Fill this.ingredients with ingredient objects
      this.ingredients = ingObj.ingredients.map(ing => new Ingredient(ing))
      this.units = ingObj.units

      // Render form with ingredients
      this.container.innerHTML = this.recipe.editRecipeForm(this.ingredients, this.units)
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
    return (`
      <div class="loader">
      </div>
    `)
  }

}