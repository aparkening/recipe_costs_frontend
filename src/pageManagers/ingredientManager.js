class IngredientPage extends PageManager{

  constructor(container, adapter){
    super(container)
    this.adapter = new IngredientAdapter(adapter)
    // this.recipe = null
  }

  // Set links and actions
  initBindingsAndEventListeners(){
    // this.recipesLink = this.container.querySelector('a#recipes')
    // this.ingredientsLink = this.container.querySelector('a#ingredients')

    // this.recipesLink.addEventListener('click', this.handleRecipesClick.bind(this))
    // this.ingredientsLink.addEventListener('click', this.handleIngredientsClick.bind(this))
    return null
  }

  // // Go to recipes screen
  // handleRecipesClick(e){
  //     e.preventDefault()
  //     this.redirect('recipes')
  // }

  // // Go to ingredients screen
  // handleIngredientsClick(e){
  //     e.preventDefault()
  //     this.redirect('ingredients')
  // }

  // Render initial html
  get staticHTML(){
    return (`
      <div>this is the ingredients page
      </div>
    `)
  }
}