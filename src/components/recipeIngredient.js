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

}


// Render recipe ingredients row
this.showIngTr(){
  return (`
    <tr data-id="${ing.id}">
      <td>$${ing.totalCost}</td>
      <th scope="row">${ing.name}</th>
      <td>${ing.amount}</td>
      <td>${ing.amountUnit}</td>
    </tr>  
  `)
}