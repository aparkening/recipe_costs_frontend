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

  get ingredientHTML(){
      return (`
          <h2>Welcome ${this.name}! </h2>
          <h3>Your dogs:</h3>
          <ul>
              ${this.dogs.map(d => d.liAndLinkHTML).join('')}
          </ul>
      `)
  }
}