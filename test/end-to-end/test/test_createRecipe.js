const Nightmare = require('nightmare');
const expect = require('chai').expect;
const RecipesPage = require('../pages/recipes');
const CreateRecipePage = require('../pages/createRecipe');
const EditRecipePage = require('../pages/editRecipe');
const apiCall = require('../utils/apiCall');
const pageConfig = require('../config');

describe('Create Recipe Page', function () {
  this.timeout(15000);

  // Check BDCS API and Web service first
  before((done) => {
    apiCall.serviceCheck(done);
  });

  const recipesPage = new RecipesPage();
  const createRecipePage = new CreateRecipePage(pageConfig.recipe.simple.name
    , pageConfig.recipe.simple.description);

  describe('Input Data Validation Test', () => {
    context('Required Field Missing #acceptance', () => {
      it('should show alert message when create recipe without name @create-recipe-page', (done) => {
        // Highlight the expected result
        const expected = createRecipePage.varAlertInfo;

        const nightmare = new Nightmare();
        nightmare
          .goto(recipesPage.url)
          .wait(recipesPage.btnCreateRecipe)
          .click(recipesPage.btnCreateRecipe)
          .wait(page => document.querySelector(page.dialogRootElement).style.display === 'block'
            , createRecipePage)
          .wait(createRecipePage.btnSave)
          .click(createRecipePage.btnSave)
          .wait(createRecipePage.labelAlertInfo)
          .evaluate(page => document.querySelector(page.labelAlertInfo).innerText
            , createRecipePage)
          .end()
          .then((element) => {
            expect(element).to.equal(expected);
            done();
          });
      });
    });
    context('Simple Valid Input Test #acceptance', () => {
      const editRecipePage = new EditRecipePage(pageConfig.recipe.simple.name);

      // Delete created recipe after each creation case
      afterEach((done) => {
        apiCall.deleteRecipe(editRecipePage.recipeName, done);
      });

      it('should switch to Edit Recipe page - recipe creation success @create-recipe-page', (done) => {
        // Highlight the expected result

        const nightmare = new Nightmare();
        nightmare
          .goto(recipesPage.url)
          .wait(recipesPage.btnCreateRecipe)
          .click(recipesPage.btnCreateRecipe)
          .wait(page => document.querySelector(page.dialogRootElement).style.display === 'block'
            , createRecipePage)
          .insert(createRecipePage.inputName, createRecipePage.varRecName)
          .insert(createRecipePage.inputDescription, createRecipePage.varRecDesc)
          .click(createRecipePage.btnSave)
          .wait(editRecipePage.componentListItemRootElement)
          .exists(editRecipePage.componentListItemRootElement)
          .end()
          .then((element) => {
            expect(element).to.be.true; // eslint-disable-line no-unused-expressions
            done();
          });
      });
    });
  });
});
