class Navbar extends PageManager{

  constructor(container, adapter){
      super(container)
      this.adapter = adapter
  }

  initBindingsAndEventListeners(){
      this.container.addEventListener('click', this.handleClick.bind(this))
  }

  // Take action when clicking A tag
  handleClick(e){
    if(e.target.tagName === "A"){
      e.preventDefault()
      const route = e.target.id.split('-')[0]
      if(route !== this.currentPage()) { this.redirect(route) } 
    }
  }

  // Set initial html
  get staticHTML(){
    return (`
      <nav class="navbar navbar-expand-md navbar-light bg-light fixed-top" id="navbar-container">
        <a class="navbar-brand" href="#" aria-label="Home" title="Home" id="welcome-link">
          <img src="images/open-iconic/svg/spreadsheet.svg" alt="Home"> Recipe Costs
        </a>
      
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbars" aria-controls="navbars" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
    
        <div class="collapse navbar-collapse" id="navbars">
          <ul class="navbar-nav mr-auto">  
            <li class="nav-item">
              <a class="nav-link" id="recipes-link" href="#">Recipes</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" id="ingredients-link" href="#">Ingredients</a>
            </li>       
          </ul>
          <form class="form-inline my-2 my-lg-0" action="recipes" accept-charset="UTF-8" method="get">
            <input type="text" name="search" id="search" placeholder="Find Recipes" class="form-control mr-sm-2">  
            <input type="submit" value="Search" class="btn btn-secondary" data-disable-with="Search">
          </form>
        </div>
    `)
  }
}