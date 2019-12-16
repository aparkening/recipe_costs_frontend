class RecipeAdapter{


  constructor(baseAdapter){
      this.baseAdapter = baseAdapter
      this.baseURL = this.baseAdapter.baseURL
  }

  // get token(){
  //     return this.baseAdapter.token
  // }

  get headers(){
      return this.baseAdapter.headers
  }

  // Update record
  async updateRecipe(params){
      const { name, servings, recipe_ingredients_attributes, id} = params
      const url = `${this.baseURL}/recipes/${id}`
      const body = {
          recipe: {
              name, 
              servings,
              recipe_ingredients_attributes,
          }
      }
      const res = await fetch(url, {
          method: 'PATCH',
          headers: this.headers,
          body: JSON.stringify(body)
      })
      await this.baseAdapter.checkStatus(res)
      return await res.json()
  }

  // Fetch all records
  async getRecipes(){

      const res = await fetch(`${this.baseURL}/recipes`, {
          headers: this.headers
      })
      await this.baseAdapter.checkStatus(res)
      return await res.json()

  }

}