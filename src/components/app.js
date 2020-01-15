class App{

  // Initialize
  constructor(){
    this.adapter = new BaseAdapter()
    this.initBindingsandEventListeners()

    // Instantiate Alert Manager
    this.alertManager = new Alert(this.alertContainer)

    // Instantiate appropriate pageManager as router
    this.router = new Router({
        'welcome': new WelcomePage(this.pageContainer, this.adapter),
        'recipe': new RecipePage(this.pageContainer, this.adapter),
        'recipe-edit': new RecipeEditPage(this.pageContainer, this.adapter),
        'recipe-new': new RecipeNewPage(this.pageContainer, this.adapter),
        'recipe-search': new RecipeSearchPage(this.pageContainer, this.adapter),
        'recipes': new RecipesPage(this.pageContainer, this.adapter),
        'ingredients': new IngredientPage(this.pageContainer, this.adapter)
    })

    // Instantiate and assign Navbar to router
    const navbar = new Navbar(this.navbarContainer, this.adapter)
    this.router.assignNavbar(navbar)
    // console.log("App.js navbar router assigned.")

    // Assign alert to router
    this.router.assignAlertHandler(this.handleAlert.bind(this))

    // Assign redirect to router
    this.router.assignRedirect(this.renderPage.bind(this))

    // Render initial screen
    this.renderPage('welcome')
  }

  // App-wide Bindings and Listeners
  initBindingsandEventListeners(){
    this.container = document.querySelector('#container')
    this.navbarContainer = document.querySelector('#navbar-container')
    this.pageContainer = document.querySelector('#page-container')
    this.alertContainer = document.querySelector('#alert-container')
  }

  // Render Alerts and set timeout for 10 secondes
  handleAlert(alertObj, timeout = 10000){
    this.alertManager.render(alertObj, timeout)
  }

  // Render page from router
  renderPage(page, obj){
    this.router.render(page, obj)
  }

}