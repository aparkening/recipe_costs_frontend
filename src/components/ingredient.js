class Ingredient{
  constructor(ingredient){
      const { id, name, cost, cost_size, cost_unit } = ingredient
      this.id = id
      this.name = name
      this.cost = cost
      this.cost_size = cost_size
      this.cost_unit = cost_unit
      // this.recipes = recipes.map(r => new Recipe(r))
  }

  get showHTML(){
      return (`
      <h2>${this.name}</h2>
      <h4>${this.cost}</h4>
      `)
  }
}