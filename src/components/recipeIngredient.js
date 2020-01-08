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

  // Render existing ingredients in recipe form
  showEditIng(units){
    console.log(this)
    return (`
    <div class="form-row form-group form-ingredient">
      <input type="hidden" value="${this.ingredient.id}" name="ingredient_id" id="">
      <input type="hidden" value="${this.id}" name="id" id="">
      <div class="col-4">
        ${this.name}
      </div>
      <div class="col-2">
        <input placeholder="1" type="text" name="ingredient_amount" class="ingredient_amount form-control" required="required" value="${this.amount}">
      </div>
      <div class="col-2">
        <select name="ingredient_unit" class="ingredient_unit custom-select">${units.map(u => this.renderUnitOptions(u)).join('')}
        </select>
      </div>
      <div class="col pt-2 small">
        <a href="#" class="text-muted delete-existing">Delete</a>
      </div>
    </div><!-- / form-ingredient -->
    `)
  }

  // Render units as select list
  renderUnitOptions(unit){
    return (`
    <option value="${unit}" ${this.amountUnit == unit ? 'selected = "selected"' : ''}>${unit}</option>
    `)
  }

}