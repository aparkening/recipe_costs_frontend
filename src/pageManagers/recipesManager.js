class RecipesPage extends PageManager{

  constructor(container, adapter){
    super(container)
    this.adapter = new RecipeAdapter(adapter)
    this.recipe = null
  }

  /* ---- Bindings and Event Listeners ---- */
    // Don't need initial bindings and listeners
    initBindingsAndEventListeners(){
      return null
    }

    // Bind and listen after all recipes load
    allRecipesBindingsAndEventListeners(){
      const rTable = this.container.querySelector('table')
      rTable.addEventListener('click', this.handleTableRecipeClick.bind(this))
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
      const form = this.container.querySelector('form')
      form.addEventListener('submit', this.handleUpdateSubmit.bind(this))
    }


  /* ---- Link/Click Handlers ---- */
    // Handle show, edit, and delete within recipe table
    handleTableRecipeClick(e){
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
          this.handleRecipeUpdate(recipeId)
          break;
        case 'delete':
          console.log('delete clicked!')
          // console.log(e.target.parentNode.parentNode.parentNode);
          // e.target.parentNode.parentNode.parentNode.remove();
          this.handleRecipeDelete(recipeId)
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
      this.handleRecipeUpdate(recipeId)
    }

    // Handle detail recipe delete
    handleRecipeDeleteClick(e){
      e.preventDefault()
      // Get recipe id and recipe object
      const recipeId = e.target.parentNode.dataset.id
      this.handleRecipeDelete(recipeId)
    }

    handleRecipeUpdate(recipeId){
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
        this.recipe = foundRecipe
        this.container.innerHTML = Recipe.recipeForm(foundRecipe)
        this.recipeFormBindingsAndEventListeners()
      }else{
        // else throw error
        this.handleError({
            type: "404 Not Found",
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


    // If real recipe, delete from this.recipes
    async handleRecipeDelete(id){      
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
            type: "404 Not Found",
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
    async handleUpdateSubmit(e){
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
        // console.log(recipeObj.recipes)

        this.recipes = recipeObj.recipes.map(recipe => new Recipe(recipe))
        // console.log(this.recipes)
        
        this.renderRecipes()

    }catch(err){
      this.handleError(err)
      // console.log(err)
    }
  }

  /* ---- Renderers ---- */
    // Render single recipe
    renderRecipe(recipe = this.recipe){
      if(recipe){
          // console.log(this.recipe)
          this.recipe = recipe
          this.container.innerHTML = this.recipe.showRecipe
          this.recipeBindingsAndEventListeners()
      }else{
          this.handleError({
              type: "404 Not Found",
              msg: "Dog was not found"
          })
      } 
    }

    // Render multiple recipes
    renderRecipes(){
      const title = "<h1>Recipes</h1>"

      const addButton = `<div class="mt-3 mb-3"><a class="btn btn-primary" href="#" role="button" id="new-resource">Add new recipe</a></div>`

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


  /* ---- Helpers ---- */
    // Grab recipe object from id
    getRecipeById(id){
      return this.recipes.find(r => r.id == id)
    }

}