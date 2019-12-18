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
      // form.addEventListener('submit', this.handleUpdateRecipe.bind(this))
    }


  /* ---- Link/Click Handlers ---- */
    // Handle show, edit, and delete within recipe table
    handleTableRecipeClick(e){
      e.preventDefault()

      // Get recipe id and recipe object
      const recipeId = e.target.dataset.id
      this.recipe = this.recipes.find(r => r.id == recipeId)

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
          break;
        case 'delete':
          // console.log('delete clicked!')
          console.log(e.target.parentNode.parentNode.parentNode);
          // e.target.parentNode.parentNode.parentNode.remove();
          // Send delete to server
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
      // console.log(recipeId)
      const foundRecipe = this.recipes.find(r => r.id == recipeId)
      // console.log(this.recipe.id)

      // console.log(recipeId)
      // console.log(this.recipe)

      console.log('edit clicked!');

      // if id matches this.recipe.id, display edit form
      if(foundRecipe && foundRecipe.id === this.recipe.id){
        console.log("They match!")
          this.container.innerHTML = Recipe.recipeForm(this.recipe)
          this.recipeFormBindingsAndEventListeners()
      }else{
          // else throw error
          this.handleError({
              type: "404 Not Found",
              msg: "Recipe was not found"
          })
      }

    }

    // Handle detail recipe delete
    handleRecipeDeleteClick(e){
      e.preventDefault()

      // Get recipe id and recipe object
      const recipeId = e.target.parentNode.dataset.id
      console.log(recipeId)
      // this.recipe = this.recipes.find(r => r.id == recipeId)
      console.log(this.recipe.id)

      // console.log(recipeId)
      // console.log(this.recipe)

      console.log('delete clicked!');

      // if id matches this.recipe.id, go to edit

      // else throw error
    }


    // // Go to edit recipe screen
    // handleEditClick(e){
    //   e.preventDefault()
    //   this.redirect('edit-recipe')
    // }





  // Fetch recipes and render page
  async fetchAndRenderPageResources(){
    try{

// console.log(this.recipe)

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
    renderRecipe(){
      if(this.recipe){
          // console.log(this.recipe)
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
}