class RecipesPage extends PageManager{

  constructor(container, adapter){
    super(container)
    this.adapter = new RecipeAdapter(adapter)
  }

  // Set links and actions
  initBindingsAndEventListeners(){
    return null
  }

  // Bind and listen after recipes loaded
  recipesBindingsAndEventListeners(){
    // this.editLink = this.container.querySelector('a#edit')
    // this.deleteLink = this.container.querySelector('a#delete')

    // this.editLink.addEventListener('click', this.handleEditClick.bind(this))
    // this.deleteLink.addEventListener('click', this.handleDeleteClick.bind(this))

    const rTable = this.container.querySelector('table')
    rTable.addEventListener('click', this.handleRecipeClick.bind(this))
  }

  // Handle edit or delete
  handleRecipeClick(e){
    e.preventDefault()

    switch (e.target.id) {
      case 'show':
        console.log('show clicked!');
        // this.redirect('ingredients')
        break;
      case 'edit':
        console.log('edit clicked!');
        break;
      case 'delete':
        console.log('delete clicked!')
        //console.log(e.target.parentNode.parentNode.parentNode);
        // e.target.parentNode.parentNode.parentNode.remove();
        // Send delete to server
        break;
      default:
        console.log('Invalid item');
        break;
    }

    // console.log(e.target.parentNode.parentNode.parentNode)
  }


  // // Go to edit recipe screen
  // handleEditClick(e){
  //   e.preventDefault()
  //   this.redirect('edit-recipe')
  // }

  // Fetch recipes and render page
  async fetchAndRenderPageResources(){
    try{
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
    this.recipesBindingsAndEventListeners()
  }

  // Render initial html. Use "loader" to display loading spinner.
  get staticHTML(){
    return (`
      <div class="loader">
      </div>
    `)
  }
}