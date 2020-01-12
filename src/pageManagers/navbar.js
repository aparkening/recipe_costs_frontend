class Navbar extends PageManager{

  constructor(container, adapter){
    super(container)
    this.adapter = adapter
  }

  initBindingsAndEventListeners(){
    // this.container.addEventListener('click', this.handleClick.bind(this))

    // Use onclick to avoid multipe virtual page loads
    this.container.onclick = this.handleClick.bind(this)
  }

  // Take action on any A tag
  handleClick(e){
    e.preventDefault()

    if(e.target.tagName === "A"){
      // Remove '-link' from href id
      const route = e.target.id.split('-')[0]

      // Only redirect if clicking for new screen
      if(route !== this.currentPage()) { 
        // console.log(`>>> Navbar.js redirecting route to ${route}`)
        return this.redirect(route) 
      } 
    }
  }

  // Set initial html
  get staticHTML(){
    return (`
      <nav class="navbar navbar-expand-sm navbar-light bg-light fixed-top" id="navbar-container">
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
        </div>
    `)
  }
}