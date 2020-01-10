class App{

  // Initialize
  constructor(){
    this.adapter = new BaseAdapter()
    this.initBindingsandEventListeners()

    // Instantiate Alert Manager
    this.alertManager = new Alert(this.alertContainer)

    // Map routes with stringId: pageManager
    this.router = new Router({
        'welcome': new WelcomePage(this.pageContainer, this.adapter),
        'recipe': new RecipePage(this.pageContainer, this.adapter),
        'recipe-edit': new RecipeEditPage(this.pageContainer, this.adapter),
        'recipe-new': new RecipePage(this.pageContainer, this.adapter),
        'recipes': new RecipesPage(this.pageContainer, this.adapter),
        'ingredients': new IngredientPage(this.pageContainer, this.adapter)
    })

    // Instantiate and assign Navbar
    const navbar = new Navbar(this.navbarContainer, this.adapter)
    this.router.assignNavbar(navbar)
    // console.log("App.js navbar router assigned.")

    // Assign Alert
    this.router.assignAlertHandler(this.handleAlert.bind(this))

    // Define redirect passed to pageManager
    this.router.assignRedirect(this.pageManagerRedirect.bind(this))

    // Render initial screen
    this.renderPage('welcome')
  }

  // Bindings and Listeners
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

  // Redirect based on router callback
  pageManagerRedirect(page, obj){
    // console.log("App.js pageManagerRedirect fired")
    this.renderPage(page, obj)
  }

  // Render page via router
  renderPage(page, obj){
    // console.log("App.js renderPage fired")
    this.router.render(page, obj)
  }

}