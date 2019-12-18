class RecipeIngredient{
  constructor(ingredientObj){
    const { id, name, ingredient, amount, amount_unit, total_cost } = ingredientObj
    this.id = id
    this.name = name
    this.amount = amount
    this.amountUnit = amount_unit
    this.totalCost = total_cost
    // this.recipes = recipes.map(r => new Recipe(r))
    this.ingredient = new Ingredient(ingredient)
  }

  // Render recipe ingredients row
  get showIngTr(){
    return (`
      <tr data-id="${this.id}">
        <td>$${this.totalCost}</td>
        <th scope="row">${this.name}</th>
        <td>${this.amount}</td>
        <td>${this.amountUnit}</td>
      </tr>  
    `)
  }

}