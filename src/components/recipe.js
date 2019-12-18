class Recipe{
  constructor(recipeObj){
    const { recipe, ingredients } = recipeObj

    this.id = recipe.id
    this.name = recipe.name
    this.servings = recipe.servings
    this.totalCost = recipe.total_cost
    this.costPerServing = recipe.cost_per_serving

    this.ingredients = ingredients.map(ing => new RecipeIngredient(ing))
  }

  get showHTML(){
    let html = `
      <h1>${this.name}</h1>
      <h2>Total Cost: $${this.totalCost}</h2>
    `

    if (this.servings !== null){
      html = html + `<h4>Serves ${this.servings} | Cost per serving: $${this.servings}</h4>`
    }

    const ingTableTop = `
    <table class="table table-striped">
      <thead class="thead-dark">
        <tr>
          <th>Cost</th>
          <th>Name</th>
          <th>Amount</th>
          <th>Amount Unit</th>
        </tr>
      </thead>
      <tbody>
    `

    const ingTableBottom = `
      </tbody>  
    </table>
    `

    const ingHTML = this.ingredients.map(ing => {
      return (`
      <tr>
        <td>$${ing.totalCost}</td>
        <th scope="row">${ing.name}</th>
        <td>${ing.amount}</td>
        <td>${ing.amountUnit}</td>
      </tr>  
      `)
    }).join('')
    // const ingHTML = 'testing'

    // html = html + this.ingredients
    html = html + ingTableTop + ingHTML + ingTableBottom

    return html
  }

  // Render recipes table
  get showRecipes(){
    return (`
      <table class="table table-striped">
        <thead class="thead-dark">
          <tr>
            <th>Name</th>
            <th>Cost</th>
            <th>Links</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row"><a href="/users/10/recipes/15">Cinnamon Raisin Bread</a></th>
            <td>$3.05
              &nbsp;|&nbsp; per serving: $0.38
            </td>
            <td><small><a class="text-muted" href="/users/10/recipes/15/edit">Edit</a> | <a class="text-muted" data-confirm="Are you sure?" rel="nofollow" data-method="delete" href="/users/10/recipes/15">Delete</a></small></td>
          </tr>   
        </tbody>  
      </table>`)

  }

}