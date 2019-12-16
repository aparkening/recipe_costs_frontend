class WelcomePage extends PageManager{

  // Set links and actions
  initBindingsAndEventListeners(){
    this.recipesLink = this.container.querySelector('a#recipes')
    this.ingredientsLink = this.container.querySelector('a#ingredients')

    this.recipesLink.addEventListener('click', this.handleRecipesClick.bind(this))
    this.ingredientsLink.addEventListener('click', this.handleIngredientsClick.bind(this))
  }

  // Go to recipes screen
  handleRecipesClick(e){
      e.preventDefault()
      this.redirect('recipes')
  }

  // Go to ingredients screen
  handleIngredientsClick(e){
      e.preventDefault()
      this.redirect('ingredients')
  }

  // Render initial html
  get staticHTML(){
      return (`
        <div class="jumbotron bg-white">
          <h1 class="display-4">Price recipes easily and quickly!</h1>
          <p class="lead">Recipe Costs helps you to record your recipes and ingredient costs in one location.</p>
          <hr class="my-4">
          <a class="btn btn-primary btn-lg" href="#" role="button" id="recipes">All Recipes</a> &nbsp; or &nbsp;
          <a class="btn btn-primary btn-lg" href="#" role="button" id="ingredients">All Ingredients</a>
        </div>
      `)
  }
}